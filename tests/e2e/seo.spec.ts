import { expect, test, type Page } from "@playwright/test";

async function readJsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      const value = JSON.parse(node.textContent || "{}");
      return Array.isArray(value["@graph"]) ? value["@graph"] : [value];
    })
  );
}

test("homepage exposes share metadata and site structured data", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://yufeifan.cn/");
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
    "href",
    "https://yufeifan.cn/rss.xml"
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "zh_CN");
  await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute("content", "en_US");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index,follow,max-image-preview:large"
  );

  const jsonLd = await readJsonLd(page);
  expect(jsonLd).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ "@type": "Person", name: "余非凡", url: "https://yufeifan.cn/" }),
      expect.objectContaining({ "@type": "WebSite", name: "dd-y / 余非凡", url: "https://yufeifan.cn/" })
    ])
  );
});

test("article and case pages expose page-specific structured data", async ({ page }) => {
  await page.goto("/writing/agent-runtime-beyond-loop");
  const articleJsonLd = await readJsonLd(page);
  expect(articleJsonLd).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "@type": "BlogPosting",
        headline: "Agent Runtime 不只是循环调用模型",
        url: "https://yufeifan.cn/writing/agent-runtime-beyond-loop"
      })
    ])
  );

  await page.goto("/work/enterprise-oa-agent");
  const caseJsonLd = await readJsonLd(page);
  expect(caseJsonLd).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "@type": "CreativeWork",
        headline: "Enterprise OA Agent",
        url: "https://yufeifan.cn/work/enterprise-oa-agent"
      })
    ])
  );
});

test("404 page keeps the site language and indexing rules", async ({ page }) => {
  const response = await page.goto("/definitely-missing-page");
  expect(response?.status()).toBe(404);

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,nofollow");
  await expect(page.getByRole("heading", { name: "页面未找到" })).toBeVisible();
  await expect(page.getByRole("link", { name: /返回首页/ })).toBeVisible();

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();
  await expect(page.getByRole("link", { name: /BACK HOME/ })).toBeVisible();
});
