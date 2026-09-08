import { test as base } from "@playwright/test";
import { BasketPage } from "@pages/basket/basket.page";
import { MainPage } from "@pages/main/main.page";

type BasketFixtureAuth = {
  basketPageAuth: BasketPage;
  mainPage: MainPage;
};

export const test = base.extend<BasketFixtureAuth>({
  basketPageAuth: async ({ page }, use) => {
    const basket = new BasketPage(page);
    await use(basket);
  },
  mainPage: async ({ page }, use) => {
    const main = new MainPage(page);
    await use(main);
  },
});
