import { expect } from "@playwright/test";
import { test } from "./search.fixture";
import { SearchPage } from "./search.page";
import { faker } from "@faker-js/faker";

test.describe("Search", () => {
  const pageErrors: string[] = [];
  test.beforeEach(async ({ page }) => {
    pageErrors.length = 0;
    page.on("pageerror", (err) => pageErrors.push(err.message));
  });
  //++++++++++++++++++++++++ Smoke tests+++++++++++++++++++++++++++++
  test.describe("smoke @smoke", async () => {
    test("The search bar and product cards are displayed, and available products are visible to the user.  @regression", async ({
      searchPage,
    }) => {
      await expect
        .poll(async () => await searchPage.product.count())
        .toBeGreaterThan(0);
      await searchPage.product.first().click();
      await expect(searchPage.productDetails).toBeVisible();
      await searchPage.closeProductDetails.click();
      await expect(searchPage.productDetails).not.toBeVisible();
    });

    test("Only products matching the search query are displayed in the list. Other products are hidden.   @regression", async ({
      searchPage,
    }) => {
      const searchTerm = "Apple Juice";
      await searchPage.search(searchTerm);
      await expect(searchPage.searchInput).toHaveValue(searchTerm);
      await expect
        .poll(async () => await searchPage.product.count())
        .toBeGreaterThan(0);

      await expect(searchPage.product.first()).toContainText(searchTerm, {
        ignoreCase: true,
      });
    });

    test("add to basket", async ({ searchPage }) => {
      await expect
        .poll(async () => await searchPage.addToBasket.count())
        .toBeGreaterThan(1);

      const count = await searchPage.addToBasket.count();
      await searchPage.addToBasket.first().click();
      const countProductsInBasket = Number(
        await searchPage.countProductsInCart.textContent(),
      );
      expect(countProductsInBasket).toBeGreaterThan(0);
    });
  });
  //++++++++++++++++++++++++ Regression tests+++++++++++++++++++++++++++++
  test.describe("regression @regression", () => {
    test("Search is case-insensitive, and all products containing the word 'juice' are displayed", async ({
      searchPage,
    }) => {
      const searchTerm = "juice";
      await searchPage.search(searchTerm);
      await expect
        .poll(async () => await searchPage.product.count())
        .toBeGreaterThan(0);

      await expect(searchPage.product.first()).toContainText(searchTerm, {
        ignoreCase: true,
      });
    });
    test("An empty search query displays the full list of products without showing an empty state", async ({
      searchPage,
      page,
    }) => {
      await searchPage.searchInput.fill("");
      await searchPage.searchInput.press("Enter");

      await expect
        .poll(async () => await searchPage.product.count())
        .toBeGreaterThan(0);
      const wrapper = page.locator("mat-card").first();
      await expect(wrapper).not.toContainClass("emptyState");
    });

    test("An", async ({ searchPage, page }) => {
      await searchPage.search("skdjfksdjfk");

      const wrapper = page.locator("mat-card");
      await expect(wrapper).toContainClass("emptyState");
      await expect
        .poll(async () => await searchPage.product.count())
        .toEqual(0);
    });
  });
  test.afterEach(() => {
    expect(pageErrors).toEqual([]);
  });
});
