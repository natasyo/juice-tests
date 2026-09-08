import { Locator, Page } from "@playwright/test";
import { BasePage } from "@helpers/page/base.page";
import { CreateCardRequest } from "@models/card.type";

/**
 * Страница выбора способа оплаты (#/payment/shop).
 * Сюда пользователь попадает после выбора способа доставки.
 * Позволяет выбрать сохранённую карту, добавить новую, применить купон
 * и перейти к просмотру заказа.
 */
export class PaymentPage extends BasePage {
  readonly url = "#/payment/shop";
  readonly heading: Locator;
  readonly cardRows: Locator;
  readonly cardRadios: Locator;
  readonly continueButton: Locator;
  readonly backButton: Locator;

  // Добавление новой карты (expension-panel "Add new card")
  readonly addNewCardPanel: Locator;
  readonly nameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryMonthSelect: Locator;
  readonly expiryYearSelect: Locator;
  readonly submitButton: Locator;

  // Купон
  readonly couponPanel: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "My Payment Options" });
    this.cardRows = page.locator("mat-table mat-row");
    this.cardRadios = page.locator("mat-table mat-radio-button");
    this.continueButton = page.getByRole("button", {
      name: "Proceed to review",
    });
    this.backButton = page.getByRole("button", { name: "Back" });

    this.addNewCardPanel = page.locator("mat-expansion-panel", {
      has: page.getByText("Add new card"),
    });
    this.nameInput = page.locator('mat-expansion-panel input[type="text"]').first();
    this.cardNumberInput = page.locator('mat-expansion-panel input[type="number"]').first();
    this.expiryMonthSelect = page.locator("mat-expansion-panel select").nth(0);
    this.expiryYearSelect = page.locator("mat-expansion-panel select").nth(1);
    this.submitButton = page.locator("#submitButton");

    this.couponPanel = page.locator("#collapseCouponElement");
    this.couponInput = page.locator("#coupon");
    this.applyCouponButton = page.locator("#applyCouponButton");
  }

  async open() {
    await this.goTo(this.url);
  }

  async selectCard(index = 0) {
    await this.cardRadios.nth(index).click();
  }

  async continueToReview() {
    await this.continueButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }

  async openAddNewCard() {
    await this.addNewCardPanel.click();
  }

  async fillCardForm(card: CreateCardRequest) {
    await this.nameInput.fill(card.fullName);
    await this.cardNumberInput.fill(String(card.cardNum));
    await this.expiryMonthSelect.selectOption(String(card.expMonth));
    await this.expiryYearSelect.selectOption(String(card.expYear));
  }

  async submitNewCard() {
    await this.submitButton.click();
  }

  async openCoupon() {
    await this.couponPanel.click();
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }
}
