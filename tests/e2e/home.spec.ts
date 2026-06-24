import { expect, test } from "@playwright/test";

test("homepage presents identity and primary sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "FROM MODELS TO SYSTEMS" })).toBeVisible();
  await expect(page.getByRole("link", { name: /01 Enterprise OA Agent/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Agent Runtime 不只是循环调用模型/ })).toBeVisible();
});
