import { Locator, Page } from "@playwright/test";
import { BasePage } from "@helpers/page/base.page";

/**
 * Страница подтверждения заказа (order summary, #/order-summary).
 * Сюда пользователь попадает после выбора способа оплаты.
 * Показывает адрес, способ оплаты, корзину, итоговую стоимость и кнопку оплаты.
 */
export class OrderSummaryPage extends BasePage {
  readonly url = "#/order-summary";
  readonly deliveryAddressBlock: Locator;
  readonly paymentMethodBlock: Locator;
  readonly basketBlock: Locator;
  readonly basketRows: Locator;
  readonly orderSummaryBlock: Locator;
  readonly itemsPrice: Locator;
  readonly deliveryPrice: Locator;
  readonly promotionPrice: Locator;
  readonly totalPrice: Locator;
  readonly placeOrderButton: Locator;
  readonly bonusPoints: Locator;

  constructor(page: Page) {
    super(page);

    this.deliveryAddressBlock = page
      .locator("mat-card", {
        hasText: "Delivery Address",
      })
      .first();

    this.paymentMethodBlock = page
      .locator("mat-card", {
        hasText: "Payment Method",
      })
      .first();

    this.basketBlock = page.locator("#app-purchase-basket");
    this.basketRows = this.basketBlock.locator("mat-table mat-row");

    this.orderSummaryBlock = page.locator(".order-summary").first();

    this.itemsPrice = page.locator(".mat-table tr", { hasText: "Items" }).locator(".price");
    this.deliveryPrice = page.locator(".mat-table tr", { hasText: "Delivery" }).locator(".price");
    this.promotionPrice = page.locator(".mat-table tr", { hasText: "Promotion" }).locator(".price");
    this.totalPrice = page.locator(".mat-table tr", { hasText: "Total Price" }).locator(".price");

    this.placeOrderButton = page.getByRole("button", {
      name: "Complete your purchase",
    });
    this.bonusPoints = page.locator(".bonus-points");
  }

  async open() {
    await this.goTo(this.url);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
