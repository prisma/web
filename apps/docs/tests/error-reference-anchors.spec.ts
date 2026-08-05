import { expect, test } from "@playwright/test";

// Every Prisma 8 error carries a docsUrl like
// https://docs.prisma.io/docs/orm/v8/reference/error-reference#CONTRACT.IDENTIFIER_INVALID
// The fragment is the raw code — uppercase, with the dot — so the heading ids
// must be the raw code text, not a slugified form.
test("error-reference anchors use raw error codes", async ({ page }) => {
  await page.goto("/docs/orm/v8/reference/error-reference#CONTRACT.IDENTIFIER_INVALID");

  const heading = page.locator('h3[id="CONTRACT.IDENTIFIER_INVALID"]');
  await expect(heading).toHaveText("CONTRACT.IDENTIFIER_INVALID");
  await expect(heading).toBeInViewport();

  expect(await page.locator('h3[id*="."]').count()).toBeGreaterThan(200);
});
