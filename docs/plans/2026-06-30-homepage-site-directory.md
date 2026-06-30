# Homepage Site Directory Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the homepage open-spaces area into a clear site directory for main-site content, external knowledge spaces, resume surfaces, and open-source records.

**Architecture:** Keep the existing `OpenSpaces` component and `spaces` data source, but expand the data model from three external links into a structured directory of internal and external destinations. Replace numbered rows with type/status/domain signals so the section stays consistent with the user's preference against ordinal labels.

**Tech Stack:** Astro, TypeScript data modules, CSS, Playwright.

---

### Task 1: Capture Directory Behavior

**Files:**
- Modify: `tests/e2e/home.spec.ts`

**Steps:**
1. Add a failing e2e assertion that the homepage exposes internal entries for work, writing, and resume.
2. Add assertions for the external Notes, Resume Lab, and GitHub entries.
3. Add an assertion that numbered space-row indexes are no longer rendered.
4. Run `npm run test:e2e -- tests/e2e/home.spec.ts` and verify the new test fails against the current implementation.

### Task 2: Expand Space Data Model

**Files:**
- Modify: `src/data/spaces.ts`

**Steps:**
1. Replace the three-item external-only model with a directory model.
2. Add `title`, `titleEn`, `label`, `labelEn`, `href`, `domain`, `domainEn`, `status`, `statusEn`, `summary`, and `summaryEn`.
3. Keep current external GitHub Pages URLs until the subdomains are configured.

### Task 3: Redesign OpenSpaces Rows

**Files:**
- Modify: `src/components/home/OpenSpaces.astro`

**Steps:**
1. Remove numbered row indexes.
2. Add a restrained marker, status chip, domain line, summary, and arrow affordance.
3. Preserve bilingual copy through existing `data-i18n-*` attributes.
4. Keep the section responsive without nested cards.

### Task 4: Verification

**Files:**
- No new source files unless verification reveals an issue.

**Steps:**
1. Run `npm run test:e2e -- tests/e2e/home.spec.ts`.
2. Run `npm run check`.
3. Run `git diff --check`.
4. Run `npm run build`.
5. Run `npm run test:e2e`.
6. Visually inspect the homepage section on desktop and mobile.
