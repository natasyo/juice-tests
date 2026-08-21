import { expect, Locator, Page } from "@playwright/test";

export type PageSize = "15" | "30" | "45" | "60";

export class PaginationComponent {
  readonly paginator: Locator;
  readonly pageSizeSelect: Locator;
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly rangeLabel: Locator;
  readonly touch: Locator;
  // mat-mdc-paginator-touch-target

  constructor(private readonly page: Page) {
    this.paginator = page.locator("mat-paginator");

    this.pageSizeSelect = this.paginator.locator("mat-select");

    this.nextPageButton = this.paginator.getByRole("button", {
      name: "Next page",
    });

    this.previousPageButton = this.paginator.getByRole("button", {
      name: "Previous page",
    });

    this.rangeLabel = this.paginator.locator(".mat-mdc-paginator-range-label");
    this.touch = this.paginator.locator(".mat-mdc-paginator-touch-target");
  }

  async getPageSize() {
    const value = await this.pageSizeSelect.innerText();
    return Number(value.trim());
  }

  async setPageSize(size: PageSize) {
    // await this.pageSizeSelect.evaluate((e: HTMLElement) => e.click());
    await this.touch.click();

    await this.page
      .getByRole("option", {
        name: String(size),
        exact: true,
      })
      .click();
    await expect(this.pageSizeSelect).toHaveText(String(size));
  }

  async nextPage() {
    await this.nextPageButton.click();
  }

  async previousPage() {
    await this.previousPageButton.click();
  }

  async expectRange(text: string) {
    await expect(this.rangeLabel).toHaveText(text);
  }
}
