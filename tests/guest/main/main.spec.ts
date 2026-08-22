import { test } from "./main.fixture";

test.describe("Main page guest", () => {
  test.describe("smoke @smoke", async () => {
    test("add to basket", async ({ mainPage }) => {
      await mainPage.addTobasketProduct();
    });
  });
  test.describe("regression @regression", () => {
    test("Pagination. The number of displayed products should be less than or equal to the pagination limit.", async ({
      mainPage,
    }) => {
      await mainPage.changeCountInPage();
    });

    test("should navigate to the next, prev page", async ({ mainPage }) => {
      await mainPage.paginationPage();
    });
  });
});
