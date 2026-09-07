import { expect } from "@playwright/test";
import {
  assertAddToBasketIncreasesCount,
  assertEmptyBasket,
  assertTotalPrice,
} from "../../../helpers/assertions/basket.helper";
import { test } from "./basket.fixture";
import {
  createUser,
  loginWithApi,
} from "../../../helpers/api/register-user-api.helper";

test.describe("Basket with auth", () => {
  test.beforeEach(async ({ baseURL, request, page }) => {
    const user = await createUser(request, baseURL);
    const login = await loginWithApi(
      { email: user.email, password: user.password },
      request,
      baseURL,
    );
    await page.addInitScript(
      ({ token, email }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
      },
      { token: login.token, email: login.umail },
    );
    await page.addInitScript((bid) => {
      sessionStorage.setItem("bid", String(bid));
    }, login.bid);
  });
  test("User can add 1 product  @regression", async ({
    mainPage,
    basketPageAuth,
  }) => {
    await mainPage.open();
    await assertAddToBasketIncreasesCount(mainPage);
    await mainPage.cartBtn.click();
    await expect(basketPageAuth.basketHeader).toBeVisible();
    const quantityText = await basketPageAuth.rowItems
      .locator(".cdk-column-quantity span.cell-initial-font")
      .innerText();
    await expect(quantityText.length).toBeGreaterThan(0);
    const productsInBasket =
      await basketPageAuth.countProductsInCart.innerText();
    expect(Number(quantityText)).toEqual(Number(productsInBasket));
    await basketPageAuth.checkoutBtn.click();
  });
  test("User can add 2 products, verify basket quantity, and is redirected to address/select  @regression", async ({
    mainPage,
    basketPageAuth,
    page,
  }) => {
    await assertTotalPrice(basketPageAuth, mainPage);
    await basketPageAuth.checkoutBtn.click();
    await expect(page).toHaveURL(/address/i);
  });

  test(" Cart is empty.", async ({ page, basketPageAuth }) => {
    await assertEmptyBasket(basketPageAuth, page);
  });
});
