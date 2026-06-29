# Site Experience Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the site chrome without changing project or article content.

**Architecture:** Keep the current Astro layout and global language script. Add small semantic hooks in the header and layout, then style them in global CSS. Use Playwright e2e tests to protect navigation state, language initialization, keyboard access, and mobile overflow.

**Tech Stack:** Astro, TypeScript, CSS, Playwright.

---

### Task 1: Navigation State

**Files:**
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/styles/global.css`
- Test: `tests/e2e/home.spec.ts`

**Steps:**
1. Add failing e2e assertions for `aria-current="page"` on the active navigation item.
2. Run the target e2e test and verify it fails.
3. Compute current path in `SiteHeader.astro` and mark matching nav links.
4. Style current links with the existing lime rule language.
5. Re-run target e2e.

### Task 2: Language Initialization

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Test: `tests/e2e/home.spec.ts`

**Steps:**
1. Add a failing e2e test that seeds `localStorage` with `en` before navigation.
2. Run the test and verify the initial document language/data state is English.
3. Add a head preflight script that sets `html[data-language]` before body render.
4. Reuse the existing body script to apply text content and button state.
5. Re-run target e2e.

### Task 3: Keyboard Access

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Test: `tests/e2e/home.spec.ts`

**Steps:**
1. Add a failing e2e test for a focus-visible skip link.
2. Run the test and verify it fails.
3. Add a skip link to `#main-content` and give `<main>` that id.
4. Style the skip link so it is invisible until focused.
5. Re-run target e2e.

### Task 4: Mobile Header Stability

**Files:**
- Modify: `src/styles/global.css`
- Test: `tests/e2e/responsive.spec.ts`

**Steps:**
1. Extend the mobile e2e test to inspect header scroll width and language controls.
2. Run the test and verify current behavior.
3. Tighten mobile header sizing and nav scroll behavior without changing desktop layout.
4. Re-run full verification.
