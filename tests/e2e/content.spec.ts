import { expect, test } from "@playwright/test";

test("work case study renders", async ({ page }) => {
  await page.goto("/work/enterprise-oa-agent");

  await expect(page.getByRole("heading", { name: "Enterprise OA Agent" })).toBeVisible();
});

test("work index exposes a scannable project system", async ({ page }) => {
  await page.goto("/work");

  await expect(page.getByRole("heading", { name: "项目" })).toBeVisible();
  await expect(page.getByText("精选项目", { exact: true })).toBeVisible();
  await expect(page.locator("[data-work-index]")).toBeVisible();
  await expect(page.locator("[data-work-row]").first()).toBeVisible();
  await expect(page.locator("[data-work-summary]").first()).toBeVisible();
  await expect(page.locator("[data-work-signals]").first()).toBeVisible();

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByRole("heading", { name: "WORK" })).toBeVisible();
  await expect(page.getByText("Selected Work", { exact: true })).toBeVisible();
});

test("case study layout exposes reusable evidence structure", async ({ page }) => {
  await page.goto("/work/enterprise-oa-agent");

  await expect(page.getByText("案例研究", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("系统快照", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "案例正文" })).toBeVisible();
  await expect(page.getByRole("link", { name: /所有项目/ })).toBeVisible();
  await expect(page.locator("[data-case-snapshot]")).toBeVisible();
  await expect(page.locator("[data-case-meta-rail]")).toBeVisible();
  await expect(page.locator("[data-case-nav]")).toBeVisible();
  await expect(page.locator("[data-case-content][data-language-only='zh']")).toBeVisible();
  await expect(page.locator("[data-case-content][data-language-only='en']")).toBeHidden();
  await expect(page.locator("[data-case-next]")).toBeVisible();

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByText("Case Study", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("System Snapshot", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Case Notes" })).toBeVisible();
  await expect(page.getByRole("link", { name: /ALL WORK/ })).toBeVisible();
  await expect(page.locator("[data-case-content][data-language-only='zh']")).toBeHidden();
  await expect(page.locator("[data-case-content][data-language-only='en']")).toBeVisible();
});

test("writing article renders", async ({ page }) => {
  await page.goto("/writing/rag-chunking-tables-code-images");

  await expect(page.getByRole("heading", { name: "RAG 分块中的表格、代码块与图片保护" })).toBeVisible();
});
