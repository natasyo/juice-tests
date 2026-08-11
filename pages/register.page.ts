import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { RegisterType } from "../types/register.type";

export class RegisterPage extends BasePage {
  readonly url: string = "http://localhost:3000/#/register";
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly securityQuestionSelect: Locator;
  readonly securityAnswerInput: Locator;
  readonly submitButton: Locator;
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
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.repeatPasswordInput.fill(data.repeatPassword);

    // Пробуем mouse.click по form-field (обходит label)
    const formField = this.page
      .locator("mat-form-field")
      .filter({ has: this.securityQuestionSelect });
    const box = await formField.boundingBox();
    if (box) {
      await this.page.mouse.click(
        box.x + box.width * 0.85,
        box.y + box.height * 0.55
      );
    }

    // Ждём появления опции. Если не появилась — fallback: нативный DOM click
    const option = this.page.locator(".mat-mdc-option, .mat-option").first();
    try {
      await option.waitFor({ state: "visible", timeout: 2000 });
    } catch {
      await this.securityQuestionSelect.evaluate((el: HTMLElement) =>
        el.click()
      );
      await option.waitFor({ state: "visible", timeout: 8000 });
    }
    await option.click();

    await this.securityAnswerInput.fill(data.securityAnswer);
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
