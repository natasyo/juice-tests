import { expect } from "@playwright/test";
import { WithProductsPage } from "../page/with-products.page";

export async function assertAddToBasketIncreasesCount(page: WithProductsPage) {
  const before = await page.getBasketCount();
  await page.addFirstProductToBasket();
  await expect.poll(() => page.getBasketCount()).toBeGreaterThan(before);
}
