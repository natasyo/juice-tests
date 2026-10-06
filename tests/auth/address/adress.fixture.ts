import { AddressCreatePage } from "@pages/address/address-create.page";
import { ADDRESS_SAVED_ENDPOINT } from "@helpers/endpoints";
import { test as base, expect } from "@playwright/test";
import { AddressSavedPage } from "@pages/address/address-saved.page";

type AddressFixtures = {
  createAddressPage: AddressCreatePage;
  savedAddressPage:AddressSavedPage
}

export const test=base.extend<AddressFixtures>({
   createAddressPage: async ({ page }, use) => {
    const createAddressPage = new AddressCreatePage(page);

    // После сохранения адреса приложение возвращается на предыдущую страницу
    // (location.back()), поэтому сначала кладём /#/address/saved в историю.
    await createAddressPage.goTo(ADDRESS_SAVED_ENDPOINT);
    await createAddressPage.open();
    await expect(page).toHaveURL(createAddressPage.url);
    await use(createAddressPage);
  }, 
  savedAddressPage:async({page}, use)=>{
    const savedAddressPage=new AddressSavedPage(page)
    await use(savedAddressPage)
  }
});