# SEO And 404 Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add credible SEO/share metadata, structured data, and a branded 404 page without changing portfolio content.

**Architecture:** Extend `BaseLayout` with optional robots and JSON-LD support, then let article and case-study layouts pass page-specific structured data. Add a static Astro 404 page using the existing visual system and language switcher. Protect the behavior with Playwright e2e tests that parse metadata and verify the 404 experience.

**Tech Stack:** Astro, TypeScript, CSS, Playwright.

---

### Task 1: SEO Metadata Contract

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Test: `tests/e2e/seo.spec.ts`

**Steps:**
1. Write failing tests for canonical, robots, RSS alternate link, Open Graph locale, and JSON-LD script presence.
2. Run the SEO test and verify it fails.
3. Add optional `robots` and `structuredData` props to `BaseLayout`.
4. Add stable metadata tags and JSON-LD rendering.
5. Re-run the SEO test.

### Task 2: Page-Specific Structured Data

**Files:**
- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/layouts/CaseStudyLayout.astro`
- Test: `tests/e2e/seo.spec.ts`

**Steps:**
1. Extend the failing SEO test to expect `BlogPosting` on article pages and `CreativeWork` on case-study pages.
2. Add page-specific JSON-LD objects in each layout.
3. Re-run the SEO test.

### Task 3: Branded 404 Page

**Files:**
- Create: `src/pages/404.astro`
- Test: `tests/e2e/seo.spec.ts`

**Steps:**
1. Write failing tests for a missing route served by the 404 page, including noindex metadata and bilingual page controls.
2. Implement the 404 page with the existing paper/grid visual language, restrained actions, and page-local styles.
3. Re-run the SEO test.

### Task 4: Full Verification

**Files:**
- No new source files unless verification reveals an issue.

**Steps:**
1. Run `npm run check`.
2. Run `git diff --check`.
3. Run `npm run build`.
4. Run `npm run test:e2e`.
5. Preview visually with Playwright screenshots for `/404` and at least one article page.
