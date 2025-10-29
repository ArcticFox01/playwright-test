import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/search.page';

test.describe('Product Search', () => {
    test('should be able to search for T-shirts', async ({ page }) => {
        const searchPage = new SearchPage(page);

        // Navigate to the website
        await page.goto('http://www.automationpractice.pl/index.php');

        // Search for T-shirts
        await searchPage.searchForProduct('T-shirts');

        // Verify the product is visible in the list
        const isProductVisible = await searchPage.isProductVisible('Faded Short Sleeve T-shirts');
        expect(isProductVisible).toBeTruthy();
    });
});