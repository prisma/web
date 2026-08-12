import { test, expect } from "@playwright/test";

test("screenshot homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("homepage.png");
});
