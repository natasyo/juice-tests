import { Locator, Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;
  readonly dialog: Locator;
  readonly showHideUserBtn: Locator;
  readonly userEmailBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole("dialog");
    this.showHideUserBtn = page.getByRole("button", {
      name: "Show/hide account menu",
    });
    this.userEmailBtn = this.page.getByRole("menuitem", {
      name: /go to user profile/i,
    });
  }
  async goTo(url: string) {
    await this.page.goto(url);
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
    await coockieBtn.waitFor({ state: "visible", timeout: 3000 }).catch(() => {
      console.log("Coockie not found");
    });
    if (await coockieBtn.isVisible()) {
      await coockieBtn.click();
    }
  }
}
