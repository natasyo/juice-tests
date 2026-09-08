import { test as setup } from "@playwright/test";
import fs from "fs";
import { createUser } from "@helpers/api/register-user-api.helper";

const authFile = ".auth/user.json";
const sessionFile = ".auth/session.json";

setup("prepare db and authenticate", async ({ baseURL, request, page }) => {
  const user = await createUser(request, baseURL);

  const res = await request.post("/rest/user/login", {
    data: {
      email: user.email,
      password: user.password,
    },
  });

  if (!res.ok()) {
    throw new Error(`Login failed: ${res.status()}\n${await res.text()}`);
  }

  const body = await res.json();

  const token = body.authentication.token;
  const bid = body.authentication.bid;
  const email = body.authentication.umail;

  await page.addInitScript(
    ({ token, email, bid }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      sessionStorage.setItem("bid", String(bid));
    },
    { token, email, bid },
  );

  await page.goto("/");

  if (!fs.existsSync(".auth")) {
    fs.mkdirSync(".auth", { recursive: true });
  }

  // cookies + localStorage
  await page.context().storageState({
    path: authFile,
  });

  // sessionStorage отдельно
  const sessionData = await page.evaluate(() => ({
    bid: window.sessionStorage.getItem("bid"),
  }));

  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
});
