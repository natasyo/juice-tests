import { Locator, Page } from "@playwright/test";
import { WithProductsPage } from "../../../helpers/page/with-products.page";

export class SearchPage extends WithProductsPage {
  readonly url = "#/search";
  constructor(page: Page) {
    super(page);
  }
  async open() {
    await this.goTo(this.url);
  }
}
