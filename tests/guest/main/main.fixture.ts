import { test as base, expect } from "@playwright/test";
import { MainPage } from "./main.page";

type MainFixtures = {
  mainPage: MainPage;
};

export const test = base.extend<MainFixtures>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await mainPage.open();
    await expect(page).toHaveURL(mainPage.url);
    await use(mainPage);
  },
});
