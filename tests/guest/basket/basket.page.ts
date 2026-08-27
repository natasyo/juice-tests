import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../helpers/page/base.page";
export class BasketGuestPage extends BasePage {
  url = "#/basket";
  readonly basketHeader: Locator;
  readonly totalPrice: Locator;
  readonly checkoutBtn: Locator;
  readonly rowItems: Locator;
  constructor(page: Page) {
    super(page);
    this.basketHeader = page.locator("app-purchase-basket h1");

    this.totalPrice = page.locator("#price");

    this.checkoutBtn = page.locator("#checkoutButton");

    this.rowItems = page.locator("mat-table mat-row");
  }
  async open() {
    await this.page.goto(this.url);
  }
}
