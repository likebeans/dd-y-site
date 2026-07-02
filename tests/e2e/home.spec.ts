import { expect, test } from "@playwright/test";

test("homepage presents identity and primary sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "从模型能力 到系统能力" })).toBeVisible();
  await expect(page.getByText("把模型能力，做成可上线、可评测、可维护的系统。")).toBeVisible();
  await expect(page.getByRole("link", { name: /阅读文章/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /获取简历/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByText("项目")).toBeVisible();
  await expect(page.getByText("写作线索", { exact: true })).toBeVisible();
  await expect(page.getByText("当前思考", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /01 企业级大模型与智能应用平台建设/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Agent Runtime 不只是循环调用模型/ })).toBeVisible();
});

test("homepage avoids an oversized empty band above the hero content", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".hero__meta")).toHaveCount(0);

  const topGap = await page.evaluate(() => {
    const header = document.querySelector(".site-header");
    const grid = document.querySelector(".hero__grid");
    if (!header || !grid) return Number.POSITIVE_INFINITY;

    const headerBox = header.getBoundingClientRect();
    const gridBox = grid.getBoundingClientRect();
    return gridBox.top - headerBox.bottom;
  });

  const maxGap = page.viewportSize() && page.viewportSize()!.width <= 720 ? 40 : 64;
  expect(topGap).toBeLessThanOrEqual(maxGap);
});

test("homepage right rail explains the agent runtime harness", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The hero right rail is hidden on compact screens.");

  await page.goto("/");

  const harness = page.locator("[data-runtime-harness]");
  const copyBox = await page.locator(".hero__copy").boundingBox();
  const harnessBox = await harness.boundingBox();
  expect(copyBox).not.toBeNull();
  expect(harnessBox).not.toBeNull();
  expect(harnessBox!.width / copyBox!.width).toBeGreaterThanOrEqual(0.9);

  await expect(harness).toBeVisible();
  await expect(harness.getByText("Agent Runtime Harness")).toBeVisible();
  await expect(harness.getByText("Loop Engineering")).toBeVisible();
  await expect(harness.getByText("Runtime Core")).toBeVisible();

  for (const label of ["Plan", "Act", "Observe", "Evaluate", "State", "Tools", "Memory", "Policy"]) {
    await expect(harness.getByText(label, { exact: true })).toBeVisible();
  }

  await expect(harness.getByText("Tool Boundary")).toBeVisible();
  await expect(harness.getByText("Human Gate")).toBeVisible();
  await expect(harness.locator(".runtime-guards").getByText("Retry Path", { exact: true })).toBeVisible();
  await expect(harness.getByText("Traceable")).toBeVisible();
  await expect(harness.getByText("Recoverable")).toBeVisible();
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

  const languageSwitch = page.getByRole("group", { name: "语言 / Language" });
  await expect(languageSwitch).toHaveAttribute("data-language-switch", "");
  await expect(languageSwitch.getByRole("button", { name: "中文" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "English" }).click();
  await expect(languageSwitch.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
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

test("homepage English hero keeps the headline clear of the runtime diagram", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The runtime diagram is hidden on compact screens.");

  await page.goto("/");
  await page.getByRole("button", { name: "English" }).click();

  const overlap = await page.evaluate(() => {
    const diagram = document.querySelector("[data-runtime-harness]");
    const lines = Array.from(document.querySelectorAll(".hero__headline-line"));
    if (!diagram || lines.length === 0) return Number.POSITIVE_INFINITY;

    const textRight = lines.reduce((right, line) => {
      const range = document.createRange();
      range.selectNodeContents(line);
      const box = range.getBoundingClientRect();
      return Math.max(right, box.right);
    }, 0);

    return textRight - diagram.getBoundingClientRect().left;
  });

  expect(overlap).toBeLessThanOrEqual(-16);
});

test("homepage current thinking surfaces latest published writing", async ({ page }) => {
  await page.goto("/");

  const thinking = page.locator("[data-section-marker='Current Thinking']");
  const rows = thinking.locator(".writing-row");

  await expect(thinking.getByText("最新文章", { exact: true })).toBeVisible();
  await expect(thinking.getByText("精选文章", { exact: true })).toHaveCount(0);
  await expect(rows.first()).toHaveAttribute("href", "/writing/agent-runtime-beyond-loop");
  await expect(rows.nth(1)).toHaveAttribute("href", "/writing/rag-chunking-tables-code-images");
  await expect(thinking.getByText("一个生产级 Agent Runtime 还需要状态、审批、工具、事件与可观测性。")).toBeVisible();

  await page.getByRole("button", { name: "English" }).click();
  await expect(thinking.getByText("Latest writing", { exact: true })).toBeVisible();
  await expect(thinking.getByText("A production-grade Agent Runtime also needs state, approval, tools, events, and observability.")).toBeVisible();
});

test("homepage omits the entry matrix and keeps navigation focused", async ({ page }) => {
  await page.goto("/");

  const navigation = page.getByRole("navigation", { name: "Primary navigation" });

  await expect(page.locator("#spaces")).toHaveCount(0);
  await expect(page.getByText("入口矩阵", { exact: true })).toHaveCount(0);
  await expect(navigation.getByRole("link", { name: "空间" })).toHaveCount(0);
  await expect(navigation.getByRole("link", { name: "笔记" })).toHaveAttribute(
    "href",
    "https://likebeans.github.io/notes-on-llms/"
  );

  await page.getByRole("button", { name: "English" }).click();
  await expect(navigation.getByRole("link", { name: "SPACES" })).toHaveCount(0);
});

test("site chrome exposes mature navigation and language state", async ({ page }) => {
  await page.goto("/work");

  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(navigation.getByRole("link", { name: "项目" })).toHaveAttribute("aria-current", "page");
  await expect(navigation.getByRole("link", { name: "文章" })).not.toHaveAttribute("aria-current", "page");

  await expect(page.locator("script[data-language-preflight]")).toHaveCount(1);

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "跳过导航" });
  await expect(skipLink).toBeVisible();
  await expect(skipLink).toHaveAttribute("href", "#main-content");
});

test("stored English preference is available before interaction", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("dd-y-language", "en");
  });

  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("data-language", "en");
  await expect(page.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "FROM MODELS TO SYSTEMS" })).toBeVisible();
});
