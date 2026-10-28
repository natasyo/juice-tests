import { test as base } from "@playwright/test";
import { BasketPage } from "@pages/basket/basket.page";
import { MainPage } from "@pages/main/main.page";
import { AddressSelectPage } from "@pages/address/address-select.page";
import { DeliveryPage } from "@pages/delivery/delivery.page";
import { PaymentPage } from "@pages/payment/payment.page";
import { OrderSummaryPage } from "@pages/order-summary/order-summary.page";

type BasketFixtureAuth = {
  basketPageAuth: BasketPage;
  mainPage: MainPage;
  addressSelectPage: AddressSelectPage;
  deliveryPage: DeliveryPage;
  paymentPage: PaymentPage;
  orderSummaryPage: OrderSummaryPage;
};

export const test = base.extend<BasketFixtureAuth>({
  basketPageAuth: async ({ page }, use) => {
    const basket = new BasketPage(page);
    await use(basket);
  },
  mainPage: async ({ page }, use) => {
    const main = new MainPage(page);
    await use(main);
  },
  addressSelectPage: async ({ page }, use) => {
    const addressSelect = new AddressSelectPage(page);
    await use(addressSelect);
  },
  deliveryPage: async ({ page }, use) => {
    const delivery = new DeliveryPage(page);
    await use(delivery);
  },
  paymentPage: async ({ page }, use) => {
    const payment = new PaymentPage(page);
    await use(payment);
  },
  orderSummaryPage: async ({ page }, use) => {
    const orderSummary = new OrderSummaryPage(page);
    await use(orderSummary);
  },
});
