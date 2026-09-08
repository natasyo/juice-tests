import { expect, test } from "@playwright/test";
import { WithProductsPage } from "@helpers/page/with-products.page";

export async function assertPagination(page: WithProductsPage) {
  await expect(page.paginator.previousPageButton).toBeDisabled();
  // Ждём, что первая страница товаров реально отрисовалась (список не пуст),
  // прежде чем читать эталонный набор.
  await expect
    .poll(async () => await page.productName.allInnerTexts(), {
      timeout: 15000,
      intervals: [1000, 1000],
    })
    .not.toHaveLength(0);
  const productsFirst = await page.productName.allInnerTexts();

  await page.paginator.nextPage();
  // дожидаемся, что набор товаров реально сменился (первая → вторая страница)
  await expect
    .poll(async () => await page.productName.allInnerTexts())
    .not.toEqual(productsFirst);
  const productsSecond = await page.productName.allInnerTexts();
  expect(productsSecond).not.toEqual(productsFirst);
  await expect(page.paginator.previousPageButton).not.toBeDisabled();

  await page.paginator.previousPage();
  // дожидаемся, что вернулся исходный набор товаров (перечитываем по кругу)
  await expect
    .poll(async () => await page.productName.allInnerTexts())
    .toEqual(productsFirst);
  const productFirstNew = await page.productName.allInnerTexts();
  expect(productFirstNew).toEqual(productsFirst);
  await expect(page.paginator.previousPageButton).toBeDisabled();
  while (await page.paginator.nextPageButton.isEnabled()) {
    await page.paginator.nextPage();
    await expect.poll(async () => await page.productName.first().isVisible());
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
