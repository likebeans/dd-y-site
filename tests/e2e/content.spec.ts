import { expect, test } from "@playwright/test";

test("work case study renders", async ({ page }) => {
  await page.goto("/work/enterprise-oa-agent");

  await expect(page.getByRole("heading", { name: "Enterprise OA Agent" })).toBeVisible();
});

test("writing article renders", async ({ page }) => {
  await page.goto("/writing/rag-chunking-tables-code-images");

  await expect(page.getByRole("heading", { name: "RAG 分块中的表格、代码块与图片保护" })).toBeVisible();
});
