import { expect, test } from "@playwright/test";

test("homepage presents identity and primary sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "从模型能力 到系统能力" })).toBeVisible();
  await expect(page.getByText("把模型能力，做成可上线、可评测、可维护的系统。")).toBeVisible();
  await expect(page.getByRole("link", { name: /阅读文章/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /获取简历/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByText("项目")).toBeVisible();
  await expect(page.getByText("写作线索", { exact: true })).toBeVisible();
  await expect(page.locator("#spaces").getByText("入口矩阵", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /大模型笔记/ })).toHaveAttribute(
    "href",
    "https://likebeans.github.io/notes-on-llms/"
  );
  await expect(page.getByRole("link", { name: /交互简历/ })).toHaveAttribute(
    "href",
    "https://likebeans.github.io/OpenResume/"
  );
  await expect(page.getByRole("link", { name: /01 企业级大模型与智能应用平台建设/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Agent Runtime 不只是循环调用模型/ })).toBeVisible();
});

test("homepage avoids an oversized empty band above the hero content", async ({ page }) => {
  await page.goto("/");

  const topGap = await page.evaluate(() => {
    const header = document.querySelector(".site-header");
    const meta = document.querySelector(".hero__meta");
    if (!header || !meta) return Number.POSITIVE_INFINITY;

    const headerBox = header.getBoundingClientRect();
    const metaBox = meta.getBoundingClientRect();
    return metaBox.top - headerBox.bottom;
  });

  const maxGap = page.viewportSize() && page.viewportSize()!.width <= 720 ? 40 : 64;
  expect(topGap).toBeLessThanOrEqual(maxGap);
});

test("homepage right rail explains the agent runtime harness", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The hero right rail is hidden on compact screens.");

  await page.goto("/");

  const harness = page.locator("[data-runtime-harness]");
  await expect(harness).toBeVisible();
  await expect(harness.getByText("Agent Runtime Harness")).toBeVisible();
  await expect(harness.getByText("Loop Engineering")).toBeVisible();

  for (const label of ["Plan", "Act", "Observe", "Evaluate", "State", "Tools", "Memory", "Policy"]) {
    await expect(harness.getByText(label, { exact: true })).toBeVisible();
  }

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

test("homepage frames main site and external spaces as a directory", async ({ page }) => {
  await page.goto("/");

  const spaces = page.locator("#spaces");

  await expect(spaces.getByRole("link", { name: /项目案例/ })).toHaveAttribute("href", "/work");
  await expect(spaces.getByRole("link", { name: /技术文章/ })).toHaveAttribute("href", "/writing");
  await expect(spaces.getByRole("link", { name: /简历档案/ })).toHaveAttribute("href", "/resume");
  await expect(spaces.getByRole("link", { name: /大模型笔记/ })).toHaveAttribute(
    "href",
    "https://likebeans.github.io/notes-on-llms/"
  );
  await expect(spaces.getByRole("link", { name: /交互简历/ })).toHaveAttribute(
    "href",
    "https://likebeans.github.io/OpenResume/"
  );
  await expect(spaces.getByRole("link", { name: /开源记录/ })).toHaveAttribute(
    "href",
    "https://github.com/likebeans"
  );

  await expect(spaces.getByText("主站内容", { exact: true }).first()).toBeVisible();
  await expect(spaces.getByText("待接入子域名", { exact: true }).first()).toBeVisible();
  await expect(spaces.locator(".space-row__index")).toHaveCount(0);

  await page.getByRole("button", { name: "English" }).click();
  await expect(spaces.getByText("Site Directory", { exact: true }).first()).toBeVisible();
  await expect(spaces.getByRole("link", { name: /Work Cases/ })).toHaveAttribute("href", "/work");
  await expect(spaces.getByRole("link", { name: /Notes on LLMs/ })).toHaveAttribute(
    "href",
    "https://likebeans.github.io/notes-on-llms/"
  );
  await expect(spaces.getByText("Subdomain Pending", { exact: true }).first()).toBeVisible();
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
