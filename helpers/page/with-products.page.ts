import { expect, Locator, Page } from "@playwright/test";
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

  async addTobasketProduct() {
    const countProductInBasket = Number(
      await this.countProductsInCart.textContent(),
    );
    await expect
      .poll(async () => await this.addToBasket.count(), {
        intervals: [1000, 1000],
      })
      .toBeGreaterThan(0);

    const count = await this.addToBasket.count();
    await this.addToBasket.first().click();
    const countProductsInBasket = Number(
      await this.countProductsInCart.textContent(),
    );
    expect(countProductsInBasket).toBeGreaterThan(countProductInBasket);
  }
}
