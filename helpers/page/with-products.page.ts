import test, { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { PaginationComponent } from "../components/pagination.component";

export class WithProductsPage extends BasePage {
  readonly product: Locator;
  readonly productName: Locator;
  readonly addToBasket: Locator;
  readonly productDetails: Locator;
  readonly closeProductDetails: Locator;
  readonly paginator: PaginationComponent;

  constructor(page: Page) {
    super(page);
    this.product = this.page.locator("app-product");
    this.productName = this.page.locator(".name");
    this.addToBasket = this.page.getByRole("button", {
      name: /Add to Basket/i,
    });
    this.productDetails = this.page.locator("app-product-details");
    this.closeProductDetails = this.productDetails.getByRole("button", {
      name: /close/i,
    });
    this.paginator = new PaginationComponent(page);
  }

  async openProductCardDialog() {
    await this.product.first().click();
    await expect(this.productDetails).toBeVisible();
    await this.closeProductDetails.click();
    await expect(this.productDetails).not.toBeVisible();
  }

  async getBasketCount() {
    return Number(await this.countProductsInCart.textContent());
  }

  async addFirstProductToBasket() {
    await this.addToBasket.first().click();
  }
}
