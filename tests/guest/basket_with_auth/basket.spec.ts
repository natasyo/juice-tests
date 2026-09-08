import { expect } from "@playwright/test";
import {
  assertEmptyBasket,
  assertTotalPrice,
  checkOneProductInBasket,
} from "@helpers/assertions/basket.helper";
import { test } from "@tests/guest/basket_with_auth/basket.fixture";
import { createUser, loginWithApi } from "@helpers/api/register-user-api.helper";
import { createAddress } from "@helpers/api/address-api.helper";

test.describe("Basket with auth", () => {
  test.beforeEach(async ({ baseURL, request, page }) => {
    const user = await createUser(request, baseURL);
    const login = await loginWithApi(
      { email: user.email, password: user.password },
      request,
      baseURL,
    );
    await createAddress(request, baseURL, login.token);
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
  test("User can add 1 product  @regression", async ({ mainPage, basketPageAuth, page }) => {
    await checkOneProductInBasket(basketPageAuth, mainPage);
    await expect(page).toHaveURL(/address/i);
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
