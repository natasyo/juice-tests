import { Locator, Page } from "@playwright/test";

import { ADDRESS_CREATE_ENDPOINT } from "@helpers/endpoints";
import { BasePage } from "@helpers/page/base.page";
import { AddressType } from "@models/address.type";

export class AddressCreatePage extends BasePage {
  readonly url = ADDRESS_CREATE_ENDPOINT;

  readonly countryInput: Locator;
  readonly nameInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly zipCodeInput: Locator;
  readonly addressTextarea: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;

  readonly countryError: Locator;
  readonly nameError: Locator;
  readonly mobileNumberError: Locator;
  readonly zipCodeError: Locator;
  readonly addressError: Locator;
  readonly cityError: Locator;

  readonly backButton: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    super(page);

    this.countryInput = page.getByLabel("Country");
    this.nameInput = page.getByLabel("Name");
    this.mobileNumberInput = page.getByLabel("Mobile Number");
    this.zipCodeInput = page.getByLabel("ZIP Code");
    this.addressTextarea = page.getByLabel("Address");
    this.cityInput = page.getByLabel("City");
    this.stateInput = page.getByLabel("State");

    this.countryError = this.fieldError(this.countryInput);
    this.nameError = this.fieldError(this.nameInput);
    this.mobileNumberError = this.fieldError(this.mobileNumberInput);
    this.zipCodeError = this.fieldError(this.zipCodeInput);
    this.addressError = this.fieldError(this.addressTextarea);
    this.cityError = this.fieldError(this.cityInput);

    this.backButton = page.getByRole("button", { name: "Back" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.successToast = page.getByText(/successfully added to your addresses/i);
  }

  async open() {
    await this.goTo(this.url);
  }

  /**
   * mat-error рендерится внутри mat-form-field своего поля,
   * поэтому поднимаемся от контрола к общему контейнеру поля.
   */
  private fieldError(control: Locator): Locator {
    return control
      .locator("xpath=ancestor::mat-form-field")
      .locator("mat-error");
  }

  async fillAddressForm(data: AddressType) {
    await this.countryInput.fill(data.country);
    await this.nameInput.fill(data.fullName);
    await this.mobileNumberInput.fill(String(data.mobileNum));
    await this.zipCodeInput.fill(data.zipCode);
    await this.addressTextarea.fill(data.streetAddress);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
  }

  async submit() {
    await this.submitButton.click();
  }
}
