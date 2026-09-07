import {  Page } from "@playwright/test";

import { BasketBasePage } from "../../../helpers/page/basketBasePage";
export class BasketAuthPage extends BasketBasePage {
  constructor(page: Page) {
    super(page);
  }
}
