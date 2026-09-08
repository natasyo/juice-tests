import { test as base, expect } from "@playwright/test";
import { BasketPage } from "@pages/basket/basket.page";

import fs from "fs";
import { MainPage } from "@pages/main/main.page";

type BasketFixtureAuth = {
  basketPageAuth: BasketPage;
  mainPage: MainPage;
};
const sessionState = JSON.parse(fs.readFileSync(".auth/session.json", "utf-8"));

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
