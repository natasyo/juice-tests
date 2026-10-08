import { generateAddressData } from "@data/address.data";
import { test } from "./adress.fixture";
import { expect } from "@playwright/test";

test.describe("Address", () => {
  test("should create a new address", async ({ createAddressPage, savedAddressPage, page }) => {
    const address = generateAddressData();
    await createAddressPage.fillAddressForm(address);
    expect(createAddressPage.submitButton).toBeEnabled();
    await createAddressPage.submitButton.click();
    await expect(page).toHaveURL(savedAddressPage.url);

    // Находим добавленный адрес в таблице по имени
    const newAddressRow = savedAddressPage.addressRows.filter({
      hasText: address.fullName,
    });
    await expect(newAddressRow).toHaveCount(1);
    await expect(newAddressRow.locator(".cdk-column-Address")).toContainText(address.streetAddress);
    await expect(newAddressRow.locator(".cdk-column-Country")).toHaveText(address.country);
  });

  test.describe("@negative tests", () => {
    const tests = [
      {
        message: "should submitButton disabled when all fields are empty",
        data: generateAddressData({
          city: "",
          country: "",
          fullName: "",
          mobileNum: 0,
          state: "",
          streetAddress: "",
          zipCode: "",
        }),
      },
      {
        message: "should submitButton disabled when only country is empty",
        data: generateAddressData({ country: "" }),
      },
      {
        message: "should submitButton disabled when only name is empty",
        data: generateAddressData({ fullName: "" }),
      },
      {
        message: "should submitButton disabled when only phone is empty",
        data: generateAddressData({ mobileNum: 0 }),
      },
      {
        message: "should submitButton disabled when only zip code is empty",
        data: generateAddressData({ zipCode: "" }),
      },
      {
        message: "should submitButton disabled when only street address is empty",
        data: generateAddressData({ streetAddress: "" }),
      },
    ];
    for (const { message, data } of tests) {
      test(message, async ({ createAddressPage }) => {
        const address = generateAddressData(data);
        await createAddressPage.fillAddressForm(address);
        await expect(createAddressPage.submitButton).toBeDisabled();
      });
    }
  });
});
