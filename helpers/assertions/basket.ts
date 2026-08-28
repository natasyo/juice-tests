import { expect } from "@playwright/test";
import { WithProductsPage } from "../page/with-products.page";

export async function assertAddToBasketIncreasesCount(
  page: WithProductsPage,
  number = 0,
) {
  const before = await page.getBasketCount();
  await page.addProductToBasket(number);
  await expect.poll(() => page.getBasketCount()).toBeGreaterThan(before);
}
