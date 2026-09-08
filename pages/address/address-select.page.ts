import { Locator, Page } from "@playwright/test";
import { BasePage } from "@helpers/page/base.page";

/**
 * Страница выбора адреса доставки (#/address/select).
 * Пользователь попадает сюда автоматически после оформления заказа из корзины,
 * поэтому обычно `open()` вызывать не требуется — достаточно передать текущий `page`.
 */
export class AddressSelectPage extends BasePage {
  readonly url = "#/address/select";
  readonly heading: Locator;
  readonly addressRows: Locator;
  readonly addressRadios: Locator;
  readonly continueButton: Locator;
  readonly addNewAddressButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Select an address" });
    this.addressRows = page.locator("mat-table mat-row");
    this.addressRadios = page.locator("mat-radio-button");
    this.continueButton = page.getByRole("button", {
      name: "Proceed to payment selection",
    });
    this.addNewAddressButton = page.getByRole("button", {
      name: "Add a new address",
    });
  }

  async open() {
    await this.goTo(this.url);
  }

  async selectAddress(index = 0) {
    await this.addressRadios.nth(index).click();
  }

  async continueToDeliveryMethod() {
    await this.continueButton.click();
  }
}
