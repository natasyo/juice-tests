import { Page } from "@playwright/test";
import { BasketBasePage } from "@helpers/page/basketBasePage";

/**
 * Страница корзины.
 * Используется и гостевыми, и авторизованными тестами — различие между
 * guest/auth обеспечивается на уровне фикстур (state/session), а не класса.
 */
export class BasketPage extends BasketBasePage {
  constructor(page: Page) {
    super(page);
  }
}
