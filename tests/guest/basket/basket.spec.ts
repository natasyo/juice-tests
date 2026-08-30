import { expect } from "@playwright/test";
import {
  assertAddToBasketIncreasesCount,
  assertTotalPrice,
} from "../../../helpers/assertions/basket.helper";
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
    await assertTotalPrice(basketPageGuest, mainPage, page);
    await basketPageGuest.checkoutBtn.click();
    await expect(page).toHaveURL(/login/i);
  });
});
