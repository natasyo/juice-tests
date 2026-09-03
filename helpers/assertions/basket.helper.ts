import { expect, Page } from "@playwright/test";
import { WithProductsPage } from "../page/with-products.page";
import { BasketBasePage } from "../page/basketBasePage";
import { MainPage } from "../../tests/guest/main/main.page";

export async function assertAddToBasketIncreasesCount(
  page: WithProductsPage,
  number = 0,
) {
  const before = await page.getBasketCount();
  await page.addProductToBasket(number);
  await expect
    .poll(() => page.getBasketCount(), {
      timeout: 15_000,
      intervals: [1000, 1000],
    })
    .toBeGreaterThan(before);
}

export async function assertTotalPrice(
  basketPage: BasketBasePage,
  mainPage: MainPage,
  page: Page,
) {
  await mainPage.open();
  await assertAddToBasketIncreasesCount(mainPage);
  await assertAddToBasketIncreasesCount(mainPage, 1);
  await mainPage.cartBtn.click();
  await expect(basketPage.basketHeader).toBeVisible();
  const count = await basketPage.getCountProductInPage();
  if (count > 0) {
    await expect
      .poll(async () => await basketPage.rowItems.count(), {
        timeout: 15_000,
        intervals: [1000, 1000],
      })
      .toBeGreaterThan(0);

    const sum = await basketPage.getTotalCountProducts();
    expect
      .poll(async () => await basketPage.getCountProductInPage(), {
        timeout: 15000,
        intervals: [1000, 1000],
      })
      .toEqual(sum);
    const total = await basketPage.getTotalCost();
    const price = (await basketPage.totalPrice.innerText()).replace(
      /[^\d.]/g,
      "",
    );
    expect(+total).toEqual(+price);
  }
}
export async function assertEmptyBasket(
  basketPage: BasketBasePage,
  page: Page,
) {
  await basketPage.open();
  await expect(page).toHaveURL(basketPage.url);
  await expect(basketPage.checkoutBtn).toBeVisible();
  await expect(basketPage.checkoutBtn).toBeDisabled();
}
