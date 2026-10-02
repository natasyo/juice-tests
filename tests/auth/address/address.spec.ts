import { generateAddressData } from "@data/address.data";
import { test } from "./adress.fixture";
import { expect } from "@playwright/test";


test.describe("Address", () => {
    test("should create a new address", async ({ createAddressPage, page }) => {
        const address=generateAddressData()
        await createAddressPage.fillAddressForm(address)
        expect(createAddressPage.submitButton).toBeEnabled()
        await createAddressPage.submitButton.click()
        await expect(createAddressPage.successToast).toBeVisible()
        expect(page).toHaveURL(/saved/i)
    })
});