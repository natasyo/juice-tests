import { test as base, expect } from "@playwright/test";
import { BasketGuestPage } from "./basket.page";
import { MainPage } from "../main/main.page";

type BasketFixtureGuest = {
  basketPageGuest: BasketGuestPage;
  mainPage: MainPage;
};

export const test = base.extend<BasketFixtureGuest>({
  basketPageGuest: async ({ page }, use) => {
    const basket = new BasketGuestPage(page);
    await use(basket);
  },
  mainPage: async ({ page }, use) => {
    const main = new MainPage(page);
    await use(main);
  },
});
