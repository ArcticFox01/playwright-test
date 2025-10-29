import { expect } from "@playwright/test";
import { test } from "../pages/base";
test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test("Login to page success", async ({ loginPage }) => {
  await loginPage.fillUserPassword("standard_user", "secret_sauce");
  await loginPage.clickLogin();
  expect(loginPage.isInventoryUrl()).toBe(true);
});

test("Login to page unsuccess", async ({ loginPage }) => {
  await loginPage.fillUserPassword("standard_user", "");
  await loginPage.clickLogin();
  expect(loginPage.isHomeUrl()).toBe(true);
  expect(await loginPage.getErrorMessage()).toContain("is required");
});
