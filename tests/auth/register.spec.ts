import { expect } from "@playwright/test";
import { generateRigisterData } from "../../data/register.data";
import { test } from "./fixtures/registerPage.fixture";

// test.describe.configure({ mode: "serial" });

test.describe("Register Page", () => {
  test("should navigate to the register page", async ({
    page,
    registerPage,
  }) => {
    await expect(page).toHaveURL(registerPage.url);
  });

  test("The input fields should be visible", async ({ page, registerPage }) => {
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.repeatPasswordInput).toBeVisible();
    await expect(registerPage.securityQuestionSelect).toBeVisible();
    await expect(registerPage.securityAnswerInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
  });

  test("Registration completes successfully, and the user is created. The card creation page/dashboard is displayed.", async ({
    page,
    registerPage,
  }) => {
    const registerData = generateRigisterData();
    await registerPage.fillForm({
      ...registerData,
    });
    await expect(registerPage.submitButton).toBeEnabled();
    await registerPage.submitButton.click();
    await page.waitForURL("**/#/login", { timeout: 15000 });
    await expect(page).toHaveURL(registerPage.loginUrl);
  });

  test("Register with an already existing email. The app should show an error and not complete registration", async ({
    page,
    registerPage,
  }) => {
    const registerData = generateRigisterData();

    await registerPage.fillForm({
      ...registerData,
    });
    await expect(registerPage.submitButton).toBeEnabled();
    await registerPage.submitButton.click();
    await page.waitForURL("**/#/login", { timeout: 15000 });
    await expect(page).toHaveURL(registerPage.loginUrl);

    await page.goto(registerPage.url);

    const duplicateRegisterData = generateRigisterData({
      email: registerData.email,
    });
    await registerPage.fillForm({
      ...duplicateRegisterData,
    });
    await expect(registerPage.submitButton).toBeEnabled();
    await registerPage.submitButton.click();

    const duplicateEmailError = page.getByText("Email must be unique");
    await expect(duplicateEmailError).toBeVisible();
    await expect(page).toHaveURL(registerPage.url);
  });

  test("Register with an empty input fields. The 'Register' button should be disabled", async ({
    page,
    registerPage,
  }) => {
    await expect(registerPage.submitButton).toBeDisabled();
  });

  test("Register with an empty email address. The 'Register' button should be disabled", async ({
    page,
    registerPage,
  }) => {
    const registerData = generateRigisterData();
    await registerPage.fillForm({
      ...registerData,
      email: "",
    });
    const emailFailed = page.locator("mat-error", {
      hasText: /email address/i,
    });
    await expect(emailFailed.first()).toBeVisible();
    await expect(registerPage.submitButton).toBeDisabled();
  });

  test("Register user with password less 5 symbol", async ({
    page,
    registerPage,
  }) => {
    const registerData = generateRigisterData({ password: "12qw" });
    await registerPage.fillForm({
      ...registerData,
    });
    await expect(registerPage.passwordInput).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(registerPage.submitButton).toBeDisabled();
  });
  test("Register user with password more 40 symbol", async ({
    page,
    registerPage,
  }) => {
    const registerData = generateRigisterData({
      password: "12$qw12$qw12$qw12$qw12$qw12$qw12$qw12$qw12$qw",
    });
    await registerPage.fillForm({
      ...registerData,
    });
    await expect(registerPage.passwordInput).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(registerPage.submitButton).toBeDisabled();
  });

  test("Register a user with a password longer than 40 characters. After correcting the password, the error message should disappear", async ({
    page,
    registerPage,
  }) => {
    const registerData = generateRigisterData({
      password: "12$qw12$qw12$qw12$qw12$qw12$qw12$qw12$qw12$qw",
    });
    await registerPage.fillForm({
      ...registerData,
    });
    await expect(registerPage.passwordInput).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await registerPage.passwordInput.fill(
      "12$qw12$qw12$qw12$qw12$qw12$qw12$qw12$qw",
    );
    await expect(registerPage.passwordInput).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  test("Register a user with a missmatched password. After correcting the password, the error message should disappear", async ({
    page,
    registerPage,
  }) => {
    const registerData = generateRigisterData();
    await registerPage.fillForm({
      ...registerData,
    });
    await expect(registerPage.repeatPasswordInput).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    await registerPage.repeatPasswordInput.fill("passw");
    await expect(registerPage.repeatPasswordInput).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await registerPage.repeatPasswordInput.fill(registerData.repeatPassword);
    await expect(registerPage.repeatPasswordInput).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  test("Register without choosing a security question. The field should show an error and the 'Register' button should stay disabled", async ({
    page,
    registerPage,
  }) => {
    const registerData = generateRigisterData();

    await registerPage.fillInputs(registerData);

    await registerPage.securityQuestionSelect.click({ force: true });
    await page.keyboard.press("Escape");
    await registerPage.emailInput.click();

    const securityQuestionFailed = page.locator("mat-error", {
      hasText: /security question/i,
    });
    await expect(securityQuestionFailed.first()).toBeVisible({
      timeout: 10000,
    });
    await expect(registerPage.submitButton).toBeDisabled();
  });
});
