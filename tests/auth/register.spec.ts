import { expect, test } from "@playwright/test";
import { RegisterPage } from "../../pages/register.page";
import { generateRigisterData } from "../../data/register.data";
test.describe("Register Page", () => {
  test("should navigate to the register page", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goTo(registerPage.url);
    await expect(page).toHaveURL(registerPage.url);
  });

  test("should", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.open();
    await expect(page).toHaveURL(registerPage.url);
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.repeatPasswordInput).toBeVisible();
    await expect(registerPage.securityQuestionSelect).toBeVisible();
    await expect(registerPage.securityAnswerInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
  });

  test("Registration completes successfully, and the user is created. The card creation page/dashboard is displayed.", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.open();
    await expect(page).toHaveURL(registerPage.url);

    const registerData = generateRigisterData();
    await registerPage.fillForm({
      ...registerData,
    });
    await registerPage.submitButton.click();
  });
});
