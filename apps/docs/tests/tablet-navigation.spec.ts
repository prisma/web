import { expect, test } from "@playwright/test";

// The menu button and the sidebar swap at `md`, which is 874 px in this app
// (packages/ui/src/styles/globals.css) rather than Tailwind's default 768 px.
for (const width of [768, 810, 873]) {
  test(`the menu opens the page tree at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/docs/postgres");

    // The drawer mounts after hydration, so waiting for it keeps the click from
    // landing before the menu button is live.
    const drawer = page.locator("#nd-sidebar-mobile");
    await expect(drawer).toBeAttached();

    await page.getByRole("button", { name: "Open Sidebar" }).click();

    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Login", exact: true })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Troubleshooting", exact: true })).toBeVisible();
  });
}

test("the sidebar replaces the menu at 874 px", async ({ page }) => {
  await page.setViewportSize({ width: 874, height: 800 });
  await page.goto("/docs/postgres");

  await expect(page.locator("#nd-sidebar")).toBeVisible();
  await expect(page.getByRole("button", { name: "Open Sidebar" })).toBeHidden();
  await expect(page.locator("#nd-sidebar-mobile")).toHaveCount(0);
});
