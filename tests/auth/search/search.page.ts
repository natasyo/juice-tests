import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../pages/base.page";

export class SearchPage extends BasePage {
  readonly url = "http://localhost:3000/#/search";
  readonly product: Locator;
  readonly addToBasket: Locator;
  readonly productDetails: Locator;
  readonly closeProductDetails: Locator;

  constructor(page: Page) {
    super(page);
    this.product = this.page.locator("app-product");
    this.addToBasket = this.page.getByRole("button", {
      name: /Add to Basket/i,
    });
    this.productDetails = this.page.locator("app-product-details");
    this.closeProductDetails = this.productDetails.getByRole("button", {
      name: /close/i,
    });
  }

  async open() {
    await this.goTo(this.url);
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press("Enter");
  }
}
