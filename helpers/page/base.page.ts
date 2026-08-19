import { Locator, Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;
  readonly dialog: Locator;
  readonly showHideUserBtn: Locator;
  readonly userEmailBtn: Locator;
  readonly searchOpenBtn: Locator;
  readonly searchCloseBtn: Locator;
  readonly searchInput: Locator;
  readonly cartBtn: Locator;
  readonly countProductsInCart: Locator;
  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole("dialog");
    this.showHideUserBtn = page.getByRole("button", {
      name: "Show/hide account menu",
    });
    this.userEmailBtn = this.page.getByRole("menuitem", {
      name: /go to user profile/i,
    });
    this.searchOpenBtn = this.page.getByRole("button", {
      name: "Open search",
    });
    this.searchCloseBtn = this.page.getByRole("button", {
      name: "Close search",
    });
    this.searchInput = this.page.locator(".search-container input");
    this.cartBtn = this.page.getByRole("button", {
      name: /shopping cart/i,
    });
    this.countProductsInCart = this.cartBtn.locator(".warn-notification");
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press("Enter");
  }
  async goTo(url: string) {
    await this.page.goto(url);
    try {
      const closeWelcomeBanner = this.page.getByRole("button", {
        name: "Close Welcome Banner",
      });
      await closeWelcomeBanner
        .waitFor({ state: "visible", timeout: 3000 })
        .catch(() => {
          console.log("Banner not found");
        });

      if (await closeWelcomeBanner.isVisible()) {
        await closeWelcomeBanner.click();
      }

      const coockieBtn = this.page.getByRole("button", {
        name: "dismiss cookie message",
      });
      await coockieBtn
        .waitFor({ state: "visible", timeout: 3000 })
        .catch(() => {
          console.log("Coockie not found");
        });
      if (await coockieBtn.isVisible()) {
        await coockieBtn.click();
      }
    } catch {}
  }
}
