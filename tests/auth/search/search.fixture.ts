import { test as base, expect } from "@playwright/test";
import fs from "fs";
import { SearchPage } from "./search.page";

type SearchFixtures = {
  searchPage: SearchPage;
};

const sessionState = JSON.parse(fs.readFileSync(".auth/session.json", "utf-8"));

const COLLAPSED_MAX_WIDTH = 10;
const EXPANDED_MIN_WIDTH = 10;

export const test = base.extend<SearchFixtures>({
  searchPage: async ({ page }, use) => {
    // Восстанавливаем sessionStorage ДО первого goto()
    await page.addInitScript((bid) => {
      sessionStorage.setItem("bid", String(bid));
    }, sessionState.bid);

    const searchPage = new SearchPage(page);

    await searchPage.open();
    await expect(page).toHaveURL(searchPage.url);

    await expect(
      (await searchPage.searchInput.boundingBox())?.width ?? 0,
    ).toBeLessThan(COLLAPSED_MAX_WIDTH);

    await searchPage.searchOpenBtn.click();

    await expect
      .poll(
        async () => (await searchPage.searchInput.boundingBox())?.width ?? 0,
      )
      .toBeGreaterThan(EXPANDED_MIN_WIDTH);

    await use(searchPage);
  },
});
