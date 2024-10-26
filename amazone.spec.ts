import { test, expect } from "@playwright/test";

test("amazone search", async ({ page }) => {
  await page.goto("https://www.amazon.in/");

  const searchItem = "wireless headphones";

  await page.fill("#twotabsearchtextbox", searchItem);
  try {
    await page.waitForSelector("#nav-search-submit-button");
    await page.click("#nav-search-submit-button");
    await page.waitForSelector(`[data-component-type="s-search-result"]`);
  } catch (error) {
    throw new Error(`Failed to Search ${error}`);
  }
});


