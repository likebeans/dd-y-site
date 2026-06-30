import { expect, test } from "@playwright/test";

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);

  await expect(page.locator(".site-header")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "中文" })).toBeVisible();

  const headerFits = await page.evaluate(() => {
    const header = document.querySelector(".site-header");
    if (!header) return false;
    return header.scrollWidth <= window.innerWidth;
  });
  expect(headerFits).toBe(true);
});
