import { test as base, expect } from "@playwright/test";
import { LoginPage } from "./login.page";


type LoginFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(page).toHaveURL(loginPage.url);
    await use(loginPage);
  },
});
