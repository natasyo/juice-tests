import { expect, test } from "@playwright/test";
import { createUser } from "@helpers/api/register-user-api.helper";

test.describe("Login API", () => {
  test("should login successfully with valid credentials", async ({ request, baseURL }) => {
    const user = await createUser(request, baseURL);

    const response = await request.post(`${baseURL}/rest/user/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("authentication");
    expect(body.authentication).toHaveProperty("token");
    expect(body.authentication).toHaveProperty("bid");
    expect(body.authentication.token).toBeTruthy();
  });

  test("should issue a new token on repeated login for the same user", async ({
    request,
    baseURL,
  }) => {
    const user = await createUser(request, baseURL);

    const firstLogin = await request.post(`${baseURL}/rest/user/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    expect(firstLogin.status()).toBe(200);
    const firstBody = await firstLogin.json();
    const firstToken = firstBody.authentication.token;
    const firstBid = firstBody.authentication.bid;

    const secondLogin = await request.post(`${baseURL}/rest/user/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    expect(secondLogin.status()).toBe(200);
    const secondBody = await secondLogin.json();
    const secondToken = secondBody.authentication.token;
    const secondBid = secondBody.authentication.bid;

    expect(firstBody.authentication.umail).toBe(user.email);
    expect(secondBody.authentication.umail).toBe(user.email);
    expect(firstBid).toBe(secondBid);
    expect(secondToken).not.toBe(firstToken);
  });

  test("should fail to login with a non-existent email", async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/rest/user/login`, {
      data: {
        email: `nonexistent-${Date.now()}@example.com`,
        password: "Pass!123",
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.text();
    expect(body).toContain("Invalid email or password");
  });

  test("should fail to login with a wrong password", async ({ request, baseURL }) => {
    const user = await createUser(request, baseURL);

    const response = await request.post(`${baseURL}/rest/user/login`, {
      data: {
        email: user.email,
        password: "WrongPassword123!",
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.text();
    expect(body).toContain("Invalid email or password");
  });

  test("should fail to login with an invalid email format", async ({ request, baseURL }) => {
    test.info().annotations.push({
      type: "issue",
      description: "https://github.com/natasyo/juice-tests/issues/3",
    });

    const response = await request.post(`${baseURL}/rest/user/login`, {
      data: {
        email: "invalid-email",
        password: "Pass!123",
      },
    });

    // Ожидается 400 Bad Request: email имеет невалидный формат.
    expect(response.status()).toBe(400);
  });

  test("should fail to login with an empty data", async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/rest/user/login`, {
      data: {},
    });

    expect(response.status()).toBe(401);
  });
});
