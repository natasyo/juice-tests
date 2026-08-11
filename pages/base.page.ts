import { Locator, Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;
  readonly dialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole("dialog");
  }
  async goTo(url: string) {
    await this.page.goto(url);
  }
}
