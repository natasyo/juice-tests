import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class WithProductsPage extends BasePage {
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

  async openProductCardDialog() {
    await this.product.first().click();
    await expect(this.productDetails).toBeVisible();
    await this.closeProductDetails.click();
    await expect(this.productDetails).not.toBeVisible();
  }

}
