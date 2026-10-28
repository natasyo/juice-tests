import { generateRegisterData } from "@data/register.data";
import { assertCreateNewAddress } from "@helpers/assertions/address.helper";
import {
  assertAddToBasketIncreasesCount,
  assertSelectionDelivery,
} from "@helpers/assertions/basket.helper";
import { AddressSelectPage } from "@pages/address/address-select.page";
import { BasketPage } from "@pages/basket/basket.page";
import { LoginPage } from "@pages/login/login.page";
import { RegisterPage } from "@pages/register/register.page";
import { SearchPage } from "@pages/search/search.page";
import test, { expect } from "@playwright/test";
import { AddressSavedPage } from "@pages/address/address-saved.page";
import { AddressCreatePage } from "@pages/address/address-create.page";
import { ADDRESS_SELECTED_ENDPOINT } from "@helpers/endpoints";
import { DeliveryPage } from "@pages/delivery/delivery.page";
import { PaymentPage } from "@pages/payment/payment.page";
import { assertCreatePayment } from "@helpers/assertions/payment.helper";

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
    await test.step("Selection of delivery method", async () => {
      const deliveryPage = new DeliveryPage(page);
      await assertSelectionDelivery(page, deliveryPage);
    });
    await test.step("creation and selection of payment method", async () => {
      const paymentPage = new PaymentPage(page);
      await assertCreatePayment(page, paymentPage);

      // Выбираем только что добавленную карту и продолжаем к просмотру заказа
      await expect(paymentPage.cardRadios).not.toHaveCount(0);
      await paymentPage.selectCard((await paymentPage.cardRadios.count()) - 1);
      await expect(paymentPage.continueButton).toBeEnabled();
      await paymentPage.continueToReview();
      await expect(page).toHaveURL("#/order-summary", { timeout: 15_000 });
    });
  });
});
