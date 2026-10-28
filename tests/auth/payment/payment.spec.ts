import { assertCreatePayment } from "@helpers/assertions/payment.helper";
import { generateCardData } from "@data/card.data";
import { PaymentPage } from "@pages/payment/payment.page";
import { expect, test } from "@playwright/test";

test.describe("Payment methods", () => {
  test("should add a new payment method", async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.open();

    await assertCreatePayment(page, paymentPage);
  });

  test("should not allow submitting an empty payment form", async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.open();
    await paymentPage.openAddNewCard();

    await expect(paymentPage.submitButton).toBeDisabled();
  });

  test("should not allow adding a card without the cardholder name", async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.open();
    await paymentPage.openAddNewCard();
    await paymentPage.fillCardForm(generateCardData());
    await paymentPage.nameInput.fill("");

    await expect(paymentPage.submitButton).toBeDisabled();
  });

  test("should not allow adding a card without the card number", async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.open();
    await paymentPage.openAddNewCard();
    await paymentPage.fillCardForm(generateCardData());
    await paymentPage.cardNumberInput.fill("");

    await expect(paymentPage.submitButton).toBeDisabled();
  });
});
