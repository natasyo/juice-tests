import { Page } from "@playwright/test";
import { WithProductsPage } from "../../../helpers/page/with-products.page";

export class MainPage extends WithProductsPage {
  url = "/";
  constructor(page: Page) {
    super(page);
  }
  async open() {
    await this.goTo(this.url);
  }
}
