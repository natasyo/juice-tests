import { expect, Locator, Page } from "@playwright/test";

import { RegisterType } from "../../../types/register.type";
import { BasePage } from "../../../pages/base.page";

export class RegisterPage extends BasePage {
  readonly url: string = "#/register";
  readonly loginUrl: string = "#/login";
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly securityQuestionSelect: Locator;
  readonly securityAnswerInput: Locator;
  readonly submitButton: Locator;
  readonly registrationForm: Locator;
  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByRole("textbox", {
      name: "Email address field",
    });

    this.passwordInput = page.getByRole("textbox", {
      name: "Field for the password",
    });

    this.repeatPasswordInput = page.getByRole("textbox", {
      name: "Field to confirm the password",
    });

    this.securityQuestionSelect = page.locator(
      'mat-select[name="securityQuestion"]',
    );
    this.securityAnswerInput = page.getByLabel("Answer");
    this.submitButton = page.getByRole("button", {
      name: "Button to complete the registration",
    });
    this.registrationForm = page.locator("#registration-form");
  }

  async open() {
    await this.goTo(this.url);
  }

  async fillForm(data: RegisterType) {
    await this.fillInputs(data);
    await this.selectSecurityQuestion();
  }

  async fillInputs(data: RegisterType) {
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.repeatPasswordInput.fill(data.repeatPassword);
    await this.securityAnswerInput.fill(data.securityAnswer);
  }

  private async selectSecurityQuestion() {
    const listbox = this.page.locator('[role="listbox"]');
    const firstOption = listbox.locator("mat-option").first();

    for (let attempt = 0; attempt < 4; attempt++) {
      await this.securityQuestionSelect.evaluate((el: HTMLElement) =>
        el.click(),
      );

      try {
        await listbox.waitFor({ state: "visible", timeout: 3000 });
        await firstOption.waitFor({ state: "visible", timeout: 1500 });
        await firstOption.click();
        await listbox
          .waitFor({ state: "hidden", timeout: 1500 })
          .catch(() => {});
        return;
      } catch {
        await this.page.keyboard.press("Escape").catch(() => {});
      }
    }

    throw new Error("Security question dropdown did not open");
  }
}
