import { APIRequestContext, expect } from "@playwright/test";
import { generateRigisterData } from "../../data/register.data";
import { test } from "./fixtures/loginPage.fixture";
import { createUser } from "../../helpers/register-user-api.helper";

test.describe("Login", () => {
  test.describe("smoke @smoke", () => {
    test("Verify successful login and redirect to the home page or dashboard @regression", async ({
      page,
      loginPage,
      request,
      baseURL,
    }) => {
      const user = await createUser(request, baseURL);
      await loginPage.fillForm({ email: user.email, password: user.password });
      await loginPage.submitButton.click();
      expect(page.url()).not.toContain("*/#/login");
      await loginPage.showHideUserBtn.click();
      await expect(loginPage.userEmailBtn).toBeVisible();
      await expect(loginPage.userEmailBtn).toContainText(user.email);
    });
  });

  test.describe("regression @regression", () => {
    test("Login with an incorrect password. An authentication error message is displayed, and the user is not logged in.", async ({
      page,
      loginPage,
      request,
      baseURL,
    }) => {
      const user = await createUser(request, baseURL);
      await loginPage.fillForm({
        email: user.email,
        password: "invalid+passwoord",
      });
      await loginPage.submitButton.click();
      await expect(page).toHaveURL(loginPage.url);
      await loginPage.submitButton.click();

      const err = page.locator("div.error");
      await expect(err).toBeVisible({ timeout: 5000 });
      await expect(err).toHaveText("Invalid email or password.");
    });
    test("Login with an unregistered email address. An authentication error message is displayed, and the user is not logged in.", async ({
      page,
      loginPage,
      request,
      baseURL,
    }) => {
      const user = await createUser(request, baseURL);
      await loginPage.fillForm({
        email: "invalidEmailjkl@ttt.ru",
        password: "invalid+passwoord",
      });
      await loginPage.submitButton.click();
      await expect(page).toHaveURL(loginPage.url);
      await loginPage.submitButton.click();

      const err = page.locator("div.error");
      await expect(err).toBeVisible({ timeout: 5000 });
      await expect(err).toHaveText("Invalid email or password.");
    });
  });

  test.describe("negative @negative", () => {
    test("Login with an empty input fields. The 'Login' button should be disabled", async ({
      page,
      loginPage,
    }) => {
      await expect(loginPage.submitButton).toBeDisabled();
    });

    test("login with an empty email address. The 'Login' button should be disabled", async ({
      page,
      loginPage,
    }) => {
      const registerData = generateRigisterData();
      await loginPage.fillForm({
        email: "",
        password: "password",
      });
      const emailFailed = page.locator("mat-error", {
        hasText: /email address/i,
      });
      await expect(emailFailed.first()).toBeVisible();
      await expect(loginPage.submitButton).toBeDisabled();
    });

    test("Login with an empty password. The 'Login' button should be disabled", async ({
      page,
      loginPage,
    }) => {
      await loginPage.fillForm({
        email: "sdfsd@jj.ru",
        password: "",
      });
      await expect(loginPage.submitButton).toBeDisabled();
    });
  });
});
