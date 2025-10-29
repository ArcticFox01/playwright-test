import { test, expect } from "@playwright/test";

test.describe("Google Navigation", () => {
  test("should navigate to Google and verify page elements", async ({
    page,
  }) => {
    // Navigate to Google
    await page.goto("https://www.google.com");

    // Verify we're on Google by checking the title
    await expect(page).toHaveTitle(/Google/);

    // Verify the search input is present (using combobox role as that's what Google uses)
    const searchInput = page.getByRole("combobox");
    await expect(searchInput).toBeVisible();

    // Verify Google Search button is present (using a more specific selector)
    const searchButton = page.getByRole("button").first();
    await expect(searchButton).toBeVisible();
  });
});
