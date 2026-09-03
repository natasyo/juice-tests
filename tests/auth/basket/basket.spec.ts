import { expect } from "@playwright/test";
import {
  assertAddToBasketIncreasesCount,
  assertEmptyBasket,
  assertTotalPrice,
} from "../../../helpers/assertions/basket.helper";
import { test } from "./basket.fixture";

test.describe("Basket with auth", () => {
  //   test("User can add 1 product  @regression", async ({
  //     mainPage,
  //     basketPageGuest,
  //     page,
  //   }) => {
  //     await mainPage.open();
  //     await assertAddToBasketIncreasesCount(mainPage);
  //     await mainPage.cartBtn.click();
  //     await expect(basketPageGuest.basketHeader).toBeVisible();
  //     const quantityText = await basketPageGuest.rowItems
  //       .locator(".cdk-column-quantity span.cell-initial-font")
  //       .innerText();
  //     await expect(quantityText.length).toBeGreaterThan(0);
  //     const productsInBasket =
  //       await basketPageGuest.countProductsInCart.innerText();
  //     expect(Number(quantityText)).toEqual(Number(productsInBasket));
  //     await basketPageGuest.checkoutBtn.click();
  //   });
  test("User can add 2 products, verify basket quantity, and is redirected to address/select  @regression", async ({
    mainPage,
    basketPageAuth,
    page,
  }) => {
    await assertTotalPrice(basketPageAuth, mainPage, page);
    await basketPageAuth.checkoutBtn.click();
    await expect(page).toHaveURL(/address/i);
  });

  test(" Cart is empty.", async ({ page, basketPageAuth }) => {
    await assertEmptyBasket(basketPageAuth, page);
  });
});
