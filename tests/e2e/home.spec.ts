import { expect, test } from "@playwright/test";

test("homepage presents identity and primary sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "从模型 到系统" })).toBeVisible();
  await expect(page.getByText("把模型能力，做成可上线、可评测、可维护的系统。")).toBeVisible();
  await expect(page.getByRole("link", { name: /阅读文章/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /获取简历/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByText("项目")).toBeVisible();
  await expect(page.getByText("写作线索", { exact: true })).toBeVisible();
  await expect(page.locator("#spaces").getByText("知识空间", { exact: true }).first()).toBeVisible();
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
  await expect(page.locator("[data-surface-well]")).toHaveCount(0);
  await expect(page.locator("[data-surface-contours]")).toBeVisible();
  await expect(page.locator("[data-cursor-instrument]")).toBeVisible();
  await expect(page.locator("[data-home-visual]")).toBeVisible();
  await expect(page.getByRole("img", { name: /首页图片槽位/ })).toBeVisible();

  await expect(page.getByRole("button", { name: "ZH" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "FROM MODELS TO SYSTEMS" })).toBeVisible();
  await expect(page.getByRole("link", { name: /READ WRITING/ })).toBeVisible();
  await expect(
    page.getByText("I care about one thing: turning model capability into reliable systems.")
  ).toBeVisible();

  await page.mouse.move(240, 320);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue("--cursor-x")))
    .toBe("240px");

  await page.mouse.wheel(0, 900);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue("--scroll-progress")))
    .not.toBe("0");
});
