import { expect } from "@playwright/test";
import { assertAddToBasketIncreasesCount } from "../../../helpers/assertions/basket";
import { test } from "./basket.fixture";

test.describe("Basket without auth", () => {
  test("Success", async ({ mainPage, basketPageGuest }) => {
    await mainPage.open();
    await assertAddToBasketIncreasesCount(mainPage);
    await mainPage.cartBtn.click();
    await expect(basketPageGuest.basketHeader).toBeVisible();
    const quantityText = await basketPageGuest.rowItems
      .locator(".cdk-column-quantity span.cell-initial-font")
      .innerText();
    console.log(quantityText);
  });
});
