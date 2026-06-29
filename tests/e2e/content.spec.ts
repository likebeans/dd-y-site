import { expect, test } from "@playwright/test";

test("work case study renders", async ({ page }) => {
  await page.goto("/work/enterprise-oa-agent");

  await expect(page.getByRole("heading", { name: "Enterprise OA Agent" })).toBeVisible();
});

test("work index exposes a scannable project system", async ({ page }) => {
  await page.goto("/work");

  await expect(page.locator("[data-work-index]")).toBeVisible();
  await expect(page.locator("[data-work-row]").first()).toBeVisible();
  await expect(page.locator("[data-work-summary]").first()).toBeVisible();
  await expect(page.locator("[data-work-signals]").first()).toBeVisible();
});

test("case study layout exposes reusable evidence structure", async ({ page }) => {
  await page.goto("/work/enterprise-oa-agent");

  await expect(page.locator("[data-case-snapshot]")).toBeVisible();
  await expect(page.locator("[data-case-meta-rail]")).toBeVisible();
  await expect(page.locator("[data-case-nav]")).toBeVisible();
  await expect(page.locator("[data-case-content]")).toBeVisible();
  await expect(page.locator("[data-case-next]")).toBeVisible();
});

test("writing article renders", async ({ page }) => {
  await page.goto("/writing/rag-chunking-tables-code-images");

  await expect(page.getByRole("heading", { name: "RAG 分块中的表格、代码块与图片保护" })).toBeVisible();
});
