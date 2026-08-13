import { test as base, expect } from "@playwright/test";
import { SearchPage } from "./search.page";

type SearchFixtures = {
  searchPage: SearchPage;
};

const COLLAPSED_MAX_WIDTH = 10;
const EXPANDED_MIN_WIDTH = 10;

export const test = base.extend<SearchFixtures>({
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await searchPage.open();
    await expect(page).toHaveURL(searchPage.url);

    // Пока свёрнуто — поле узкое
    await expect(
      (await searchPage.searchInput.boundingBox())?.width ?? 0,
    ).toBeLessThan(COLLAPSED_MAX_WIDTH);

    await searchPage.searchOpenBtn.click();

    // После клика — поле разворачивается (ширина растёт)
    await expect
      .poll(
        async () => (await searchPage.searchInput.boundingBox())?.width ?? 0,
      )
      .toBeGreaterThan(EXPANDED_MIN_WIDTH);

    await use(searchPage);
  },
});
