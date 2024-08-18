import { test, expect } from "@playwright/test";

test("should navigate to the next page", async ({ page }) => {
  // Start from the index page
  await page.goto("/");

  // Page title loaded
  await expect(page).toHaveTitle("Engagement Tracker");

  // Find user engagement table
  await expect(page.getByText("User Engagement")).toBeVisible();

  // Click next page button
  await page.getByRole("button", { name: "Go to next page" }).click();

  // Table data is updated
  await expect(page.getByText("Page 2 of 100")).toBeVisible();

  // Url is updated
  await expect(page).toHaveURL("http://localhost:3000/?page=2&pageSize=10");
});
