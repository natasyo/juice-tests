import { Locator, Page } from "@playwright/test";
import { BasePage } from "@helpers/page/base.page";

export class BasketBasePage extends BasePage {
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
  async getTotalCost() {
    let sum = 0;
    const count = await this.rowItems.count();
    for (let i = 0; i < count; i++) {
      const item = this.rowItems.nth(i);
      const countLocator = item.locator(".cdk-column-quantity span.cell-initial-font");
      const count = Number(await countLocator.innerText());
      const priceLocator = item.locator(".cdk-column-price");
      // console.log(Number((await priceLocator.innerText()).trim()));
      const price = parseFloat((await priceLocator.innerText()).replace(/[^\d.]/g, ""));
      sum += price * count;
    }
    return sum;
  }
  async getTotalCountProducts() {
    const quantityText = await this.rowItems
      .locator(".cdk-column-quantity span.cell-initial-font")
      .allInnerTexts();
    return quantityText.reduce((acc, num) => {
      return acc + +num;
    }, 0);
  }
}
