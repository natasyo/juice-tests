import { APIRequestContext, expect, Locator, Page } from "@playwright/test";

import { LoginType } from "../../../types/login.type";
import { createUser } from "../../../helpers/register-user-api.helper";
import { BasePage } from "../../../helpers/page/base.page";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly url = "#/login";
  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.getByRole("textbox", {
      name: "Text field for the login email",
    });
    this.passwordInput = this.page.getByRole("textbox", {
      name: "Text field for the login password",
    });
    this.submitButton = this.page.getByRole("button", {
      name: /^Login$/i,
    });
  }

  async open() {
    await this.goTo(this.url);
  }

  async fillForm(loginData: LoginType) {
    await this.emailInput.fill(loginData.email);
    await this.passwordInput.fill(loginData.password);
  }

  async loginWithError(loginData: LoginType) {
    await this.fillForm({
      email: loginData.email,
      password: loginData.password,
    });
    await this.submitButton.click();
    await expect(this.page).toHaveURL(this.url);

    const err = this.page.locator("div.error");
    await expect(err).toBeVisible({ timeout: 5000 });
    await expect(err).toHaveText("Invalid email or password.");
  }
}
