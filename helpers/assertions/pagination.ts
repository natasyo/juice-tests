import { expect, test } from "@playwright/test";
import { WithProductsPage } from "../page/with-products.page";

export async function assertPagination(page: WithProductsPage) {
  await expect(page.paginator.previousPageButton).toBeDisabled();
  await expect(page.productName.first()).toBeVisible();
  const productsFirst = await page.productName.allInnerTexts();

  await page.paginator.nextPage();
  await expect(page.productName.first()).toBeVisible();
  const productsSecond = await page.productName.allInnerTexts();
  expect(productsFirst).not.toEqual(productsSecond);
  await expect(page.paginator.previousPageButton).not.toBeDisabled();

  await page.paginator.previousPage();
  await expect(page.productName.first()).toBeVisible();
  const productFirstNew = await page.productName.allInnerTexts();

  expect(productsFirst).toEqual(productFirstNew);
  expect(productFirstNew).not.toEqual(page);
  await expect(page.paginator.previousPageButton).toBeDisabled();
  while (await page.paginator.nextPageButton.isEnabled()) {
    await page.paginator.nextPage();
    await expect(page.productName.first()).toBeVisible();
  }
  await expect(page.paginator.nextPageButton).toBeDisabled();
}

export async function assertChangeCountInPage(page: WithProductsPage) {
  await test.step("default count products in page", async () => {
    const count = await page.paginator.getPageSize();
    const countProducts = await page.product.count();

    expect(countProducts).toBeLessThanOrEqual(count);
  });

  await test.step("change count products in page", async () => {
    await page.paginator.setPageSize("30");

    const countProducts = await page.product.count();
    const count = await page.paginator.getPageSize();

    expect(countProducts).toBeLessThanOrEqual(count);
  });
}
