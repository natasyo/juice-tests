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
  readonly addressTable: Locator;
  readonly addressRows: Locator;
  readonly addressRadios: Locator;
  readonly nameCells: Locator;
  readonly addressCells: Locator;
  readonly countryCells: Locator;
  readonly continueButton: Locator;
  readonly addNewAddressButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Select an address" });
    this.addressTable = page.locator("mat-table.address-table");
    this.addressRows = this.addressTable.locator("mat-row");

    this.addressRadios = this.addressTable.locator(".cdk-column-Selection mat-radio-button");
    this.nameCells = this.addressTable.locator(".cdk-column-Name");
    this.addressCells = this.addressTable.locator(".cdk-column-Address");
    this.countryCells = this.addressTable.locator(".cdk-column-Country");

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

  /** Строка адреса по индексу (0-based). */
  getRow(index = 0): Locator {
    return this.addressRows.nth(index);
  }

  /** Радиокнопка выбора в строке по индексу (0-based). */
  getRowRadio(index = 0): Locator {
    return this.addressRadios.nth(index);
  }

  /** Имя из строки с адресом по индексу (0-based). */
  getRowName(index = 0): Locator {
    return this.nameCells.nth(index);
  }

  /** Полный адрес из строки по индексу (0-based). */
  getRowAddress(index = 0): Locator {
    return this.addressCells.nth(index);
  }

  /** Страна из строки по индексу (0-based). */
  getRowCountry(index = 0): Locator {
    return this.countryCells.nth(index);
  }

  /** Строка таблицы, содержащая указанный адрес. */
  getRowByAddress(address: string): Locator {
    return this.addressRows.filter({ hasText: address });
  }

  async selectAddress(index = 0) {
    await this.getRowRadio(index).click();
  }

  async addNewAddress() {
    await this.addNewAddressButton.click();
  }

  async continueToDeliveryMethod() {
    await this.continueButton.click({ noWaitAfter: true });
  }
}
