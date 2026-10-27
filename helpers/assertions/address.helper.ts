import { generateAddressData } from "@data/address.data";
import { expect, Page } from "@playwright/test";
import { AddressCreatePage } from "@pages/address/address-create.page";
import { AddressSavedPage } from "@pages/address/address-saved.page";
import { ADDRESS_SAVED_ENDPOINT } from "@helpers/endpoints";

export async function assertCreateNewAddress(
  createAddressPage: AddressCreatePage,
  savedAddressPage: AddressSavedPage,
  page: Page,
  redirectAddress = ADDRESS_SAVED_ENDPOINT,
) {
  const address = generateAddressData();
  await createAddressPage.fillAddressForm(address);
  await expect(createAddressPage.submitButton).toBeEnabled();
  await createAddressPage.submitButton.click();
  await expect(page).toHaveURL(redirectAddress);

  // Находим добавленный адрес в таблице по имени
  const newAddressRow = savedAddressPage.addressRows.filter({
    hasText: address.fullName,
  });
  await expect(newAddressRow).toHaveCount(1);
  await expect(newAddressRow.locator(".cdk-column-Address")).toContainText(address.streetAddress);
  await expect(newAddressRow.locator(".cdk-column-Country")).toHaveText(address.country);
}
