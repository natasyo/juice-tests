import { AddressCreatePage } from "@pages/address/address-create.page";
import { test as base, expect } from "@playwright/test";

type AddressFixtures = {
  createAddressPage: AddressCreatePage;
}

export const test=base.extend<AddressFixtures>({
   createAddressPage: async ({ page }, use) => {
    const createAddressPage = new AddressCreatePage(page);
    await createAddressPage.open();
    await expect(page).toHaveURL(createAddressPage.url);
    await use(createAddressPage);
  }
});