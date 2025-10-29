import { Page } from "@playwright/test";
import { removeSlashUrl } from "../utils";

export class LoginPage {
  page: Page;
  baseURL: string = "https://www.saucedemo.com"; 
  inventoryUrl: string = "https://www.saucedemo.com/inventory.html/";
  locatorUserName: string = "input#user-name";
  locatorPass: string = "input#password";
  locatorBtnLogin = "input#login-button";
  locatorLabelError = ".error-message-container.error"
  /**
   * 
   * @param {Page} page
   */
  constructor(page: Page) {
    this.page = page;
  }
  
  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async fillUserPassword(user: string, pass: string) {
    await this.page.locator(this.locatorUserName).fill(user);
    await this.page.locator(this.locatorPass).fill(pass);
  }

  async clickLogin() {
    await this.page.locator(this.locatorBtnLogin).click();
  }

  isInventoryUrl(){
    const actualUrl = removeSlashUrl(this.page.url());
    const expectedUrl = removeSlashUrl(this.inventoryUrl);
    return actualUrl === expectedUrl;
  }
  isHomeUrl(){
    const actualUrl = removeSlashUrl(this.page.url());
    const expectedUrl = removeSlashUrl(this.baseURL);
    return actualUrl === expectedUrl;
  }

  async getErrorMessage(){
    return await this.page.locator(this.locatorLabelError).textContent() || "";
  }
}
