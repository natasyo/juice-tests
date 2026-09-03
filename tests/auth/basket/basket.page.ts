import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../helpers/page/base.page";
import { BasketBasePage } from "../../../helpers/page/basketBasePage";
export class BasketGuestPage extends BasketBasePage {
  constructor(page: Page) {
    super(page);
  }
}
