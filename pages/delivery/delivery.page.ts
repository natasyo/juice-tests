import { Locator, Page } from "@playwright/test";
import { BasePage } from "@helpers/page/base.page";

/**
 * Страница выбора способа/скорости доставки (#/delivery-method).
 * Сюда пользователь попадает после выбора адреса на странице address/select.
 * На странице показан выбранный адрес и таблица способов доставки.
 */
export class DeliveryPage extends BasePage {
  readonly url = "#/delivery-method";
  readonly deliveryAddressHeading: Locator;
  readonly deliverySpeedHeading: Locator;
  readonly addressBlock: Locator;
  readonly deliveryRows: Locator;
  readonly deliveryRadios: Locator;
  readonly continueButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddressHeading = page.getByRole("heading", {
      name: "Delivery Address",
    });
    this.deliverySpeedHeading = page.getByRole("heading", {
      name: "Choose a delivery speed",
    });
    this.addressBlock = page.locator(".addressCont");
    this.deliveryRows = page.locator("mat-table mat-row");
    this.deliveryRadios = page.locator("mat-radio-button");
    this.continueButton = page.getByRole("button", {
      name: "Proceed to delivery method selection",
    });
    this.backButton = page.getByRole("button", { name: "Back" });
  }

  async open() {
    await this.goTo(this.url);
  }

  async selectDeliverySpeed(index = 0) {
    await this.deliveryRadios.nth(index).click();
  }

  async continueToPayment() {
    await this.continueButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }
}
