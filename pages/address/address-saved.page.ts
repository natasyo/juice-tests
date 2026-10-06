import { Locator, Page } from "@playwright/test";

import { ADDRESS_SAVED_ENDPOINT } from "@helpers/endpoints";
import { BasePage } from "@helpers/page/base.page";

/**
 * Страница "My saved addresses" (#/address/saved).
 * Отображает список сохранённых адресов в таблице с кнопками Edit / Remove
 * и кнопкой добавления нового адреса.
 */
export class AddressSavedPage extends BasePage {
  readonly url = ADDRESS_SAVED_ENDPOINT;

  readonly heading: Locator;
  readonly addressTable: Locator;
  readonly addressRows: Locator;
  readonly nameCells: Locator;
  readonly addressCells: Locator;
  readonly countryCells: Locator;
  readonly editButtons: Locator;
  readonly removeButtons: Locator;
  readonly addNewAddressButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "My saved addresses" });
    this.addressTable = page.locator("mat-table.address-table");
    this.addressRows = this.addressTable.locator("mat-row");

    this.nameCells = this.addressTable.locator(".cdk-column-Name");
    this.addressCells = this.addressTable.locator(".cdk-column-Address");
    this.countryCells = this.addressTable.locator(".cdk-column-Country");

    // Иконки Edit/Remove не имеют текста и aria-label, поэтому цепляемся за ячейки.
    this.editButtons = this.addressTable.locator(".cdk-column-Edit button");
    this.removeButtons = this.addressTable.locator(".cdk-column-Remove button");

    this.addNewAddressButton = page.getByRole("button", {
      name: "Add a new address",
    });
  }

  async open() {
    await this.goTo(this.url);
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

  async editAddress(index = 0) {
    await this.editButtons.nth(index).click();
  }

  async removeAddress(index = 0) {
    await this.removeButtons.nth(index).click();
  }

  async addNewAddress() {
    await this.addNewAddressButton.click();
  }
}
