import { generateAddressData } from "@data/address.data";
import { test } from "./adress.fixture";
import { expect } from "@playwright/test";


test.describe("Address", () => {
    test("should create a new address", async ({ createAddressPage, savedAddressPage, page }) => {
        const address=generateAddressData()
        await createAddressPage.fillAddressForm(address)
        expect(createAddressPage.submitButton).toBeEnabled()
        await createAddressPage.submitButton.click()
        expect(page).toHaveURL(savedAddressPage.url)

        // Находим добавленный адрес в таблице по имени
        const newAddressRow = savedAddressPage.addressRows.filter({
            hasText: address.fullName,
        })
        await expect(newAddressRow).toHaveCount(1)
        await expect(newAddressRow.locator(".cdk-column-Address")).toContainText(address.streetAddress)
        await expect(newAddressRow.locator(".cdk-column-Country")).toHaveText(address.country)

    })

    test("should submitButton disabled ", async({page, savedAddressPage, createAddressPage})=>{

    })
});