import { test as base, Page } from "@playwright/test";
import { LoginPage } from "./login.page";

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

type basicFixtures = {
    loginPage: LoginPage,
}

export const test = base.extend<basicFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    }
})
