import { AddressCreatePage } from "@pages/address/address-create.page";
import { ADDRESS_SAVED_ENDPOINT } from "@helpers/endpoints";
import { test as base, expect } from "@playwright/test";

type AddressFixtures = {
  createAddressPage: AddressCreatePage;
}

export const test=base.extend<AddressFixtures>({
   createAddressPage: async ({ page }, use) => {
    const createAddressPage = new AddressCreatePage(page);
    // The app returns to the previous page after saving an address (location.back()),
    // so establish a real previous history entry first.
    await createAddressPage.goTo(ADDRESS_SAVED_ENDPOINT);
    await createAddressPage.open();
    await expect(page).toHaveURL(createAddressPage.url);
    await use(createAddressPage);
  }
});