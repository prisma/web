import { expect, test } from "@playwright/test";

test("the desktop bar shows Sign up from lg, Login at every desktop width", async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 800 });
  await page.goto("/docs/postgres");

  const bar = page.locator("#nd-subnav");
  await expect(bar.getByRole("link", { name: "Login", exact: true })).toBeVisible();
  await expect(bar.getByRole("link", { name: "Sign up", exact: true })).toBeHidden();

  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(bar.getByRole("link", { name: "Login", exact: true })).toBeVisible();
  await expect(bar.getByRole("link", { name: "Sign up", exact: true })).toBeVisible();
});

test("the phone drawer lists Login and Sign up", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/docs/postgres");

  await page.getByRole("button", { name: "Open Sidebar" }).click();

  await expect(page.getByRole("link", { name: "Login", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up", exact: true })).toBeVisible();
});

test("a long section name clips before the logo squashes", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/docs/local-development");

  const logo = page.locator('#nd-subnav a[aria-label="Prisma home"] img:visible');
  await expect(logo).toHaveCount(1);
  expect((await logo.boundingBox())?.width).toBeGreaterThan(27);
});
