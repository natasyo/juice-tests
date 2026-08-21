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

  async paginationPage() {
    await expect(this.paginator.previousPageButton).toBeDisabled();
    await expect(this.productName.first()).toBeVisible();
    const productsFirst = await this.productName.allInnerTexts();

    await this.paginator.nextPage();
    await expect(this.productName.first()).toBeVisible();
    const productsSecond = await this.productName.allInnerTexts();
    expect(productsFirst).not.toEqual(productsSecond);
    await expect(this.paginator.previousPageButton).not.toBeDisabled();

    await this.paginator.previousPage();
    await expect(this.productName.first()).toBeVisible();
    const productFirstNew = await this.productName.allInnerTexts();

    expect(productsFirst).toEqual(productFirstNew);
    expect(productFirstNew).not.toEqual(this);
    await expect(this.paginator.previousPageButton).toBeDisabled();
    while (await this.paginator.nextPageButton.isEnabled()) {
      await this.paginator.nextPage();
      await expect(this.productName.first()).toBeVisible();
    }
    await expect(this.paginator.nextPageButton).toBeDisabled();
  }

  async changeCountInPage() {
    await test.step("default count products in page", async () => {
      const count = await this.paginator.getPageSize();
      const countProducts = await this.product.count();

      expect(countProducts).toBeLessThanOrEqual(count);
    });

    await test.step("change count products in page", async () => {
      await this.paginator.setPageSize("30");

      const countProducts = await this.product.count();
      const count = await this.paginator.getPageSize();

      expect(countProducts).toBeLessThanOrEqual(count);
    });
  }
}
