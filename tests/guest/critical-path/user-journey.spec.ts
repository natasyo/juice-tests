import { generateRegisterData } from "@data/register.data";
import { assertCreateNewAddress } from "@helpers/assertions/address.helper";
import { assertAddToBasketIncreasesCount } from "@helpers/assertions/basket.helper";
import { AddressSelectPage } from "@pages/address/address-select.page";
import { BasketPage } from "@pages/basket/basket.page";
import { LoginPage } from "@pages/login/login.page";
import { RegisterPage } from "@pages/register/register.page";
import { SearchPage } from "@pages/search/search.page";
import test, { expect } from "@playwright/test";
import { createAddress } from "@helpers/api/address-api.helper";
import { AddressSavedPage } from "@pages/address/address-saved.page";
import { AddressCreatePage } from "@pages/address/address-create.page";
import { ADDRESS_SELECTED_ENDPOINT, DELIVERY_METHOD_ENDPOINT } from "@helpers/endpoints";

test.describe("User Journey", () => {
  test("should complete the critical path successfully", async ({ page }) => {
    test.slow();
    const registerData = generateRegisterData();
    await test.step("Register a new user", async () => {
      const registerPage = new RegisterPage(page);
      await registerPage.open();
      // Assuming you have a function to generate test data
      await registerPage.fillForm(registerData);
      await expect(registerPage.submitButton).toBeEnabled;
      await registerPage.submitButton.click();
      await page.waitForURL(registerPage.loginUrl, { timeout: 15000 });
      await expect(page).toHaveURL(registerPage.loginUrl);
    });

    await test.step("Login with the newly registered user", async () => {
      const lognPage = new LoginPage(page);
      await lognPage.open();
      await lognPage.fillForm({
        email: registerData.email,
        password: registerData.password,
      });
      await expect(lognPage.submitButton).toBeEnabled();
      await lognPage.submitButton.click();
      await page.waitForURL("#/search", { timeout: 15000 });
      await expect(page).toHaveURL("#/search");
    });
    const searchPage = new SearchPage(page);
    await test.step("Search for a product", async () => {
      await expect
        .poll(async () => await searchPage.product.count(), {
          timeout: 15000,
          intervals: [1000, 1000],
        })
        .toBeGreaterThan(0);
      await assertAddToBasketIncreasesCount(searchPage, 0);
      await assertAddToBasketIncreasesCount(searchPage, 1);
    });
    await test.step("Checkout an order", async () => {
      const basketPage = new BasketPage(page);
      await searchPage.cartBtn.click();
      await expect(page).toHaveURL(basketPage.url);
      await expect(basketPage.checkoutBtn).toBeEnabled();
      expect(await basketPage.rowItems.count()).toBeGreaterThan(0);
      await basketPage.checkoutBtn.click();
    });
    await test.step("creation and selection of an address", async () => {
      const addressSelectPage = new AddressSelectPage(page);
      await page.waitForURL(addressSelectPage.url);
      await addressSelectPage.addNewAddressButton.click();
      const createAddressPage = new AddressCreatePage(page);
      await page.waitForURL(createAddressPage.url);
      const savedAddressPage = new AddressSavedPage(page);
      await assertCreateNewAddress(
        createAddressPage,
        savedAddressPage,
        page,
        ADDRESS_SELECTED_ENDPOINT,
      );
      await expect(addressSelectPage.continueButton).toBeDisabled();
      await addressSelectPage.selectAddress();
      await expect(addressSelectPage.continueButton).toBeEnabled();
      await addressSelectPage.continueToDeliveryMethod();
    });
    await test.step("Choose delivery method", async () => {
      await page.waitForURL(DELIVERY_METHOD_ENDPOINT);
    });
  });
});
