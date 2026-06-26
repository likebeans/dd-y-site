import { expect, test } from "@playwright/test";

test("homepage presents identity and primary sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "FROM MODELS TO SYSTEMS" })).toBeVisible();
  await expect(page.getByRole("link", { name: /READ WRITING/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /GET RESUME/ })).toBeVisible();
  await expect(page.getByText("Writing Tracks", { exact: true })).toBeVisible();
  await expect(page.locator("#spaces").getByText("Knowledge System", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Notes on LLMs/ })).toHaveAttribute(
    "href",
    "https://likebeans.github.io/notes-on-llms/"
  );
  await expect(page.getByRole("link", { name: /Resume Lab/ })).toHaveAttribute(
    "href",
    "https://likebeans.github.io/OpenResume/"
  );
  await expect(page.getByRole("link", { name: /01 Enterprise OA Agent/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Agent Runtime 不只是循环调用模型/ })).toBeVisible();
});

test("homepage exposes refined interaction and language controls", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("[data-home-section='02']")).toHaveCount(0);
  await expect(page.locator("[data-section-marker='Writing Tracks']")).toBeVisible();
  await expect(page.locator("[data-section-marker='Current Thinking']")).toBeVisible();
  await expect(page.locator("[data-surface-field]")).toBeVisible();
  await expect(page.locator("[data-surface-contours]")).toBeVisible();
  await expect(page.locator("[data-cursor-lens]")).toBeVisible();
  await expect(page.locator("[data-home-visual]")).toBeVisible();
  await expect(page.getByRole("img", { name: /homepage image slot/i })).toBeVisible();

  await expect(page.getByRole("button", { name: "ZH" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("I focus on one question: how model capability enters real systems.")).toBeVisible();

  await page.mouse.move(240, 320);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue("--cursor-x")))
    .toBe("240px");

  await page.mouse.wheel(0, 900);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue("--scroll-progress")))
    .not.toBe("0");
});
