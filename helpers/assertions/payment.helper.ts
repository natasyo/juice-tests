import { generateCardData } from "@data/card.data";
import { PaymentPage } from "@pages/payment/payment.page";
import { expect, Page } from "@playwright/test";

export async function assertCreatePayment(page: Page, paymentPage: PaymentPage) {
  await expect(page).toHaveURL(paymentPage.url, { timeout: 15_000 });
  const cardData = generateCardData();
  await paymentPage.openAddNewCard();
  await paymentPage.fillCardForm(cardData);
  await paymentPage.submitNewCard();
}
