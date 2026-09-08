import { assertAddToBasketIncreasesCount } from "@helpers/assertions/basket.helper";
import { assertChangeCountInPage, assertPagination } from "@helpers/assertions/pagination";
import { test } from "@tests/guest/main/main.fixture";

test.describe("Main page guest", () => {
  test.describe("smoke @smoke", async () => {
    test("add to basket", async ({ mainPage }) => {
      await assertAddToBasketIncreasesCount(mainPage);
    });
  });
  test.describe("regression @regression", () => {
    test("Pagination. The number of displayed products should be less than or equal to the pagination limit.", async ({
      mainPage,
    }) => {
      await assertChangeCountInPage(mainPage);
    });

    test("should navigate to the next, prev page", async ({ mainPage }) => {
      await assertPagination(mainPage);
    });
  });
});
