import { generateAddressData } from "@data/address.data";
import { test } from "./adress.fixture";
import { expect } from "@playwright/test";
import { assertCreateNewAddress } from "@helpers/assertions/address.helper";

test.describe("Address", () => {
  test("should create a new address @regression", async ({
    createAddressPage,
    savedAddressPage,
    page,
  }) => {
    await assertCreateNewAddress(createAddressPage, savedAddressPage, page);
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
        message: "should submitButton disabled when only zip code is longer than 8 symbols",
        data: generateAddressData({ zipCode: "123456789" }),
      },
      {
        message: "should submitButton disabled when only street address is empty",
        data: generateAddressData({ streetAddress: "" }),
      },
      {
        message: "should submitButton disabled when mobile number is not valid (In short, 7)",
        data: generateAddressData({ mobileNum: 999999 }),
      },
      {
        message: "should submitButton disabled when mobile number is not valid (longer than 10)",
        data: generateAddressData({ mobileNum: 123456789011 }),
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
