import { test as base, expect } from "@playwright/test";
import { BasketAuthPage } from "./basket.page";

import fs from "fs";
import { MainPage } from "../../guest/main/main.page";

type BasketFixtureAuth = {
  basketPageAuth: BasketAuthPage;
  mainPage: MainPage;
};
const sessionState = JSON.parse(fs.readFileSync(".auth/session.json", "utf-8"));

export const test = base.extend<BasketFixtureAuth>({
  basketPageAuth: async ({ page }, use) => {
    await page.addInitScript((bid) => {
      sessionStorage.setItem("bid", String(bid));
    }, sessionState.bid);

    const basket = new BasketAuthPage(page);
    await use(basket);
  },
  mainPage: async ({ page }, use) => {
    const main = new MainPage(page);
    await use(main);
  },
});
