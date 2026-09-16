import { expect, Page } from "@playwright/test";
import { WithProductsPage } from "@helpers/page/with-products.page";
import { BasketBasePage } from "@helpers/page/basketBasePage";
import { OrderSummaryPage } from "@pages/order-summary/order-summary.page";
import { PaymentPage } from "@pages/payment/payment.page";
import { DeliveryPage } from "@pages/delivery/delivery.page";
import { AddressSelectPage } from "@pages/address/address-select.page";

export async function assertAddToBasketIncreasesCount(page: WithProductsPage, number = 0) {
  const before = await page.getBasketCount();
  await page.addProductToBasket(number);
  await expect
    .poll(() => page.getBasketCount(), {
      timeout: 15_000,
      intervals: [1000, 1000],
    })
    .toBeGreaterThan(before);
}

export async function assertTotalPrice(basketPage: BasketBasePage, productPage: WithProductsPage) {
  await productPage.open();
  await assertAddToBasketIncreasesCount(productPage, 1);
  await assertAddToBasketIncreasesCount(productPage, 1);
  await productPage.cartBtn.click();
  await expect(basketPage.basketHeader).toBeVisible();
  const count = await basketPage.getCountProductInPage();
  if (count > 0) {
    await expect
      .poll(async () => await basketPage.rowItems.count(), {
        timeout: 15_000,
        intervals: [1000, 1000],
      })
      .toBeGreaterThan(0);

    const sum = await basketPage.getTotalCountProducts();
    expect
      .poll(async () => await basketPage.getCountProductInPage(), {
        timeout: 15000,
        intervals: [1000, 1000],
      })
      .toEqual(sum);
    const total = await basketPage.getTotalCost();
    const price = (await basketPage.totalPrice.innerText()).replace(/[^\d.]/g, "");
    expect(+total).toEqual(+price);
  }
}
export async function assertEmptyBasket(basketPage: BasketBasePage, page: Page) {
  await basketPage.open();
  await expect(page).toHaveURL(basketPage.url);
  await expect(basketPage.checkoutBtn).toBeVisible();
  // await expect(basketPage.checkoutBtn).toBeDisabled();
}

export async function checkOneProductInBasket(
  basketPage: BasketBasePage,
  productPage: WithProductsPage,
) {
  await productPage.open();
  await assertAddToBasketIncreasesCount(productPage);
  await productPage.cartBtn.click();
  await expect(basketPage.basketHeader).toBeVisible();
  const quantityText = await basketPage.rowItems
    .locator(".cdk-column-quantity span.cell-initial-font")
    .innerText();
  await expect(quantityText.length).toBeGreaterThan(0);
  const productsInBasket = await basketPage.countProductsInCart.innerText();
  expect(Number(quantityText)).toEqual(Number(productsInBasket));
  await basketPage.checkoutBtn.click();
}
export async function assertCompleteCheckout(
  page: Page,
  addressSelectPage: AddressSelectPage,
  deliveryPage: DeliveryPage,
  paymentPage: PaymentPage,
  orderSummaryPage: OrderSummaryPage,
) {
  // Адрес доставки (#/address/select)
  await expect(addressSelectPage.heading).toBeVisible({ timeout: 15_000 });
  await expect(addressSelectPage.continueButton).toBeDisabled();
  await addressSelectPage.selectAddress();
  await expect(addressSelectPage.continueButton).toBeEnabled();
  await addressSelectPage.continueToDeliveryMethod();

  // Способ/скорость доставки (#/delivery-method)
  await expect(deliveryPage.deliveryAddressHeading).toBeVisible({ timeout: 15_000 });
  await expect(deliveryPage.continueButton).toBeDisabled();
  await deliveryPage.selectDeliverySpeed(1); // Fast Delivery
  await expect(deliveryPage.continueButton).toBeEnabled();
  await deliveryPage.continueToPayment();

  // Способ оплаты (#/payment/shop)
  await expect(paymentPage.heading).toBeVisible({ timeout: 15_000 });
  await expect(paymentPage.continueButton).toBeDisabled();
  await paymentPage.selectCard(0); // выбрать карту
  await expect(paymentPage.continueButton).toBeEnabled();
  await paymentPage.continueToReview(); // → просмотр заказа

  // Просмотр заказа (#/order-summary)
  await expect(orderSummaryPage.placeOrderButton).toBeVisible({ timeout: 15_000 });
  // Итог зависит от цены товара и выбранной доставки — проверяем формат валюты.
  await expect(orderSummaryPage.totalPrice).toHaveText(/^\d+\.\d{2}¤$/);
  await orderSummaryPage.placeOrder(); // → оформление/оплата заказа

  // Завершение заказа (#/order-completion)
  await expect(page.getByRole("heading", { name: /thank you for your purchase/i })).toBeVisible({
    timeout: 15_000,
  });
}
