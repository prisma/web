import { expect, test } from "@playwright/test";

// The banner stacks above the docs layout, so a drawer that starts at the top
// of the viewport has its close button covered by the banner's own.
for (const width of [375, 810]) {
  test(`the drawer closes from its own button under the banner at ${width} px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/docs/postgres");

    const banner = page.locator("#prisma-8-docs");
    const drawer = page.locator("#nd-sidebar-mobile");
    await expect(banner).toBeVisible();
    await expect(drawer).toBeAttached();

    await page.getByRole("button", { name: "Open Sidebar" }).click();
    await expect(drawer).toBeVisible();

    await drawer.getByRole("button", { name: "Open Sidebar" }).click();

    await expect(drawer).toBeHidden();
    await expect(banner).toBeVisible();
  });
}

test("the drawer starts at the top once the banner is dismissed", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/docs/postgres");

  const drawer = page.locator("#nd-sidebar-mobile");
  await expect(drawer).toBeAttached();

  await page.getByRole("button", { name: "Close Banner" }).click();
  await expect(page.locator("#prisma-8-docs")).toHaveCount(0);

  await page.getByRole("button", { name: "Open Sidebar" }).click();
  await expect(drawer).toBeVisible();
  expect((await drawer.boundingBox())?.y).toBe(0);
});
