import { expect } from "@playwright/test";
import { assertAddToBasketIncreasesCount } from "../../../helpers/assertions/basket";
import { test } from "./basket.fixture";

test.describe("Basket without auth", () => {
  test("Guest user can add 1 product and is redirected to login on checkout @regression", async ({
    mainPage,
    basketPageGuest,
    page,
  }) => {
    await mainPage.open();
    await assertAddToBasketIncreasesCount(mainPage);
    await mainPage.cartBtn.click();
    await expect(basketPageGuest.basketHeader).toBeVisible();
    const quantityText = await basketPageGuest.rowItems
      .locator(".cdk-column-quantity span.cell-initial-font")
      .innerText();
    const productsInBasket =
      await basketPageGuest.countProductsInCart.innerText();
    expect(Number(quantityText)).toEqual(Number(productsInBasket));
    await basketPageGuest.checkoutBtn.click();
    await expect(page).toHaveURL(/login/i);
  });
  test("Guest user can add 2 products, verify basket quantity, and is redirected to login on checkout @regression", async ({
    mainPage,
    basketPageGuest,
    page,
  }) => {
    await mainPage.open();
    await assertAddToBasketIncreasesCount(mainPage);
    await assertAddToBasketIncreasesCount(mainPage, 1);
    await mainPage.cartBtn.click();
    await expect(basketPageGuest.basketHeader).toBeVisible();
    const count = await basketPageGuest.getCountProductInPage();
    if (count > 0) {
      await expect
        .poll(async () => await basketPageGuest.rowItems.count(), {
          timeout: 15_000,
          intervals: [1000, 1000],
        })
        .toBeGreaterThan(0);
      const quantityText = await basketPageGuest.rowItems
        .locator(".cdk-column-quantity span.cell-initial-font")
        .allInnerTexts();
      const sum = quantityText.reduce((acc, num) => {
        return acc + +num;
      }, 0);
      expect(count).toEqual(sum);
      await basketPageGuest.checkoutBtn.click();
      await expect(page).toHaveURL(/login/i);
    }
  });
});
