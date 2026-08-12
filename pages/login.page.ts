import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { LoginType } from "../types/login.type";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly url = "http://localhost:3000/#/login";
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
}
