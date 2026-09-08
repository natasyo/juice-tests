import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "@helpers/page/base.page";
import { PaginationComponent } from "@helpers/components/pagination.component";

export abstract class WithProductsPage extends BasePage {
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
  abstract open(): Promise<void>;
  async openProductCardDialog() {
    await this.product.first().click();
    await expect(this.productDetails).toBeVisible();
    await this.closeProductDetails.click();
    await expect(this.productDetails).not.toBeVisible();
  }

  async getBasketCount() {
    return Number(await this.countProductsInCart.textContent());
  }

  async addProductToBasket(num = 0) {
    await expect(this.addToBasket.nth(num)).toBeVisible({ timeout: 15_000 });

    if ((await this.addToBasket.count()) > num) await this.addToBasket.nth(num).click();
  }
}
