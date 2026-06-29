# Work Case Study System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the Work area into a reusable project system with a stronger index, structured case study layout, evidence rail, and clearer reading boundaries without changing project-specific claims.

**Architecture:** Keep project content in existing MDX files and use Astro layouts/components to provide structure. Reuse current paper/grid visual language, enrich existing components, and add only optional frontmatter fields so future projects can add signals without breaking existing content.

**Tech Stack:** Astro, MDX content collections, TypeScript, CSS, Playwright e2e.

---

### Task 1: Add Structural E2E Coverage

**Files:**
- Modify: `tests/e2e/content.spec.ts`

**Step 1: Write the failing tests**

Add assertions that verify structure, not project facts:

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/content.spec.ts`

Expected: FAIL because the new `data-*` structure does not exist yet.

**Step 3: Commit**

Do not commit yet. Keep the failing tests for Task 2.

---

### Task 2: Make Work Index a Scan Surface

**Files:**
- Modify: `src/components/work/WorkIndex.astro`
- Test: `tests/e2e/content.spec.ts`

**Step 1: Implement the index structure**

Add:

- root `data-work-index`
- row `data-work-row`
- summary `data-work-summary`
- signals/tags area `data-work-signals`
- table-like grid with title, role, summary, tags, stack preview, and year

Use existing fields only:

```astro
<div class="work-index" data-work-index>
  {works.map((work) => (
    <a class="work-index__row" href={`/work/${work.id}`} data-work-row>
      <span class="work-index__order">{String(work.data.order).padStart(2, "0")}</span>
      <div class="work-index__main">
        <strong>{work.data.title}</strong>
        <p data-work-summary>{work.data.summary}</p>
      </div>
      <div class="work-index__signals" data-work-signals>
        {[...work.data.tags, ...work.data.stack.slice(0, 3)].map((item) => <span>{item}</span>)}
      </div>
      <small>{work.data.role}</small>
      <em>{work.data.year}</em>
    </a>
  ))}
</div>
```

**Step 2: Run test to verify partial pass**

Run: `npm run test:e2e -- tests/e2e/content.spec.ts`

Expected: Work index test passes; case study structure test still fails.

**Step 3: Commit**

```bash
git add src/components/work/WorkIndex.astro tests/e2e/content.spec.ts
git commit -m "test: cover work case study structure"
git add src/components/work/WorkIndex.astro
git commit -m "polish: make work index scannable"
```

If the test commit feels too granular after implementation, combine only the test change with the first passing implementation commit.

---

### Task 3: Add Case Study Evidence Structure

**Files:**
- Modify: `src/layouts/CaseStudyLayout.astro`
- Modify: `src/components/work/ProjectMeta.astro`
- Modify: `src/components/work/MetricStrip.astro`
- Test: `tests/e2e/content.spec.ts`

**Step 1: Update layout regions**

Add clear structural regions:

- `data-case-snapshot` around metrics + architecture
- `data-case-meta-rail` on `ProjectMeta`
- `data-case-nav` on the section navigation
- `data-case-content` on MDX slot wrapper
- `data-case-next` for a bottom action area

Add a bottom action section with links to `/work`, `/writing`, and `/resume`. Keep labels generic.

**Step 2: Update `ProjectMeta`**

Make the side rail more useful without adding content:

- show `Year`, `Role`, `Status`
- show `Tags`
- show `Stack`
- preserve compact, table-like styling

**Step 3: Update `MetricStrip`**

Handle empty metrics gracefully:

```astro
{metrics.length > 0 ? (
  <dl class="metric-strip">...</dl>
) : (
  <div class="metric-strip metric-strip--empty">Evidence metrics can be added later.</div>
)}
```

This fallback should be visually quiet.

**Step 4: Run test to verify pass**

Run: `npm run test:e2e -- tests/e2e/content.spec.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/layouts/CaseStudyLayout.astro src/components/work/ProjectMeta.astro src/components/work/MetricStrip.astro tests/e2e/content.spec.ts
git commit -m "polish: structure case study evidence layout"
```

---

### Task 4: Refine System Snapshot Visuals

**Files:**
- Modify: `src/components/work/ArchitectureFigure.astro`
- Test: `tests/e2e/content.spec.ts`

**Step 1: Keep the figure generic**

Do not encode OA-specific facts. Improve the generic system diagram with:

- clearer canvas title
- stable min-height
- better mobile node spacing
- thin guide rails
- less card-like framing

**Step 2: Run targeted e2e**

Run: `npm run test:e2e -- tests/e2e/content.spec.ts`

Expected: PASS.

**Step 3: Commit**

```bash
git add src/components/work/ArchitectureFigure.astro
git commit -m "polish: refine generic system snapshot"
```

---

### Task 5: Full Verification and Deploy

**Files:**
- No new files unless screenshots are temporarily created under `output/playwright/`

**Step 1: Run checks**

Run:

```bash
npm run check
npm run build
npm run test:e2e
```

Expected:

- Astro check: 0 errors, 0 warnings
- Build completes
- Playwright: all tests pass

**Step 2: Visual QA**

Start preview:

```bash
npm run preview -- --host 127.0.0.1 --port 4322
```

Check:

- `/work` desktop and mobile
- `/work/enterprise-oa-agent` desktop and mobile

Verify:

- no horizontal overflow
- sections are visually distinct
- index rows scan quickly
- case study side rail does not crowd content
- no large decorative cards or heavy gradients

Stop preview and remove temporary screenshot folders:

```bash
rm -rf output .playwright-cli test-results
```

**Step 3: Push**

```bash
git push origin HEAD:main
```

Expected: GitHub updates `main`, then Cloudflare Pages deploys.
