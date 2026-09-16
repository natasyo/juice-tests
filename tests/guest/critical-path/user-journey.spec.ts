import { generateRegisterData } from "@data/register.data";
import { LoginPage } from "@pages/login/login.page";
import { RegisterPage } from "@pages/register/register.page";
import { SearchPage } from "@pages/search/search.page";
import test, { expect } from "@playwright/test";

test.describe("User Journey", () => {
  test("should complete the critical path successfully", async ({ page }) => {
    const registerData = generateRegisterData();
    await test.step("Register a new user", async () => {
      const registerPage = new RegisterPage(page);
      await registerPage.open();
      // Assuming you have a function to generate test data
      await registerPage.fillForm(registerData);
      await expect(registerPage.submitButton).toBeEnabled;
      await registerPage.submitButton.click();
      await page.waitForURL(registerPage.loginUrl, { timeout: 15000 });
      await expect(page).toHaveURL(registerPage.loginUrl);
    });

    test.step("Login with the newly registered user", async () => {
      const lognPage = new LoginPage(page);
      await lognPage.open();
      await lognPage.fillForm({
        email: registerData.email,
        password: registerData.password,
      });
      await expect(lognPage.submitButton).toBeEnabled;
      await lognPage.submitButton.click();
      await page.waitForURL("#/search", { timeout: 15000 });
      await expect(page).toHaveURL("#/search");
    });
    await test.step("Search for a product", async () => {
      const searchPage = new SearchPage(page);
      await expect
        .poll(async () => await searchPage.product.count(), {
          timeout: 15000,
          intervals: [1000, 1000],
        })
        .toBeGreaterThan(0);
    });
  });
});
