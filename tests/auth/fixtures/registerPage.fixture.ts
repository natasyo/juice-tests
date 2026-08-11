import { test as base, expect } from "@playwright/test";
import { RegisterPage } from "../../../pages/register.page"

type RegisterFixtures={
    registerPage:RegisterPage;
}


export const test=base.extend<RegisterFixtures>({
    registerPage:async({page}, use)=>{
        const registerPage=new RegisterPage(page)
        await registerPage.open()
        await expect(page).toHaveURL(registerPage.url);
        await use(registerPage);
    }
})