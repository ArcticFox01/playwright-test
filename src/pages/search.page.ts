import { Page } from '@playwright/test';
import { BasePage } from './base';

export class SearchPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Selectors
    private searchBox = 'input[type="text"]';
    private submitSearch = 'button[type="submit"]';
    private productList = '.product_list';
    private productName = '.product-name';

    // Actions
    async searchForProduct(productName: string) {
        await this.page.fill(this.searchBox, productName);
        await this.page.click(this.submitSearch);
    }

    async getProductNames(): Promise<string[]> {
        const products = await this.page.locator(this.productName).allInnerTexts();
        return products.map(name => name.trim());
    }

    async isProductVisible(productName: string): Promise<boolean> {
        const products = await this.getProductNames();
        return products.some(name => name.includes(productName));
    }
}