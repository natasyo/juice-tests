import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { RegisterType } from "../types/register.type";

export class RegisterPage extends BasePage {
  readonly url: string = "http://localhost:3000/#/register";
  readonly loginUrl: string = "http://localhost:3000/#/login";
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly securityQuestionSelect: Locator;
  readonly securityAnswerInput: Locator;
  readonly submitButton: Locator;
  readonly registrationForm: Locator;
  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByLabel("Email address field");

    this.passwordInput = page.locator("#passwordControl");

    this.repeatPasswordInput = page.locator("#repeatPasswordControl");

    this.securityQuestionSelect = page.locator(
      'mat-select[name="securityQuestion"]',
    );
    this.securityAnswerInput = page.getByLabel("Answer");
    this.submitButton = page.locator("#registerButton");
    this.registrationForm = page.locator("#registration-form");
  }

  async open() {
    await this.goTo(this.url);

    const closeWelcomeBanner = this.page.getByRole("button", {
      name: "Close Welcome Banner",
    });
    await closeWelcomeBanner
      .waitFor({ state: "visible", timeout: 3000 })
      .catch(() => {
        console.log("Banner not found");
      });

    if (await closeWelcomeBanner.isVisible()) {
      await closeWelcomeBanner.click();
    }

    const coockieBtn = this.page.getByRole("button", {
      name: "dismiss cookie message",
    });
    await coockieBtn.waitFor({ state: "visible", timeout: 3000 }).catch(() => {
      console.log("Coockie not found");
    });
    if (await coockieBtn.isVisible()) {
      await coockieBtn.click();
    }
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

  // async getQuestions() {
  //   await expect(this.securityQuestionSelect).toBeVisible();
  //   const wrapper = this.securityQuestionSelect.locator(
  //     'xpath=ancestor::div[contains(@class, "mat-mdc-text-field-wrapper")][1]',
  //   );
  //   await wrapper.click({ force: true });

  //   const listbox = await this.page.getByRole("listbox", {
  //     name: "Selection list for the security question",
  //   });
  //   await expect(listbox).toBeVisible();
  //   const items = await this.page.getByRole("option").allTextContents();
  //   await this.page.keyboard.press("Escape");
  //   // console.log(items);
  //   return items.map((text) => text.trim());
  // }
}
