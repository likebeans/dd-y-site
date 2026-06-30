# OpenResume Content Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate public, evidence-rich resume and project facts from the legacy OpenResume site into the current yufeifan.cn portfolio without adopting the legacy visual system.

**Architecture:** Treat `likebeans/OpenResume` as a content source. Add richer work case studies in `src/content/work`, update existing case-study facts, and refresh `src/data/resume.ts`, `src/data/experience.ts`, and `src/data/profile.ts` so the current Astro site becomes the canonical resume/portfolio surface.

**Tech Stack:** Astro content collections, MDX, TypeScript data modules, Playwright e2e tests.

---

### Task 1: Capture Migration Expectations

**Files:**
- Modify: `tests/e2e/content.spec.ts`
- Modify: `tests/e2e/home.spec.ts`

**Steps:**
1. Add a failing e2e test that `/work` includes `企业级大模型与智能应用平台建设` and `企业级 RAG 检索与知识服务平台`.
2. Add failing assertions that the new case pages expose key evidence: `10x`, `95%+`, `Security Trimming`, and `OpenAI 兼容接口`.
3. Add failing assertions that `/resume` includes `湖南九典制药股份有限公司`, `A股上市（300705）`, and the public GitHub identity `github.com/likebeans`.
4. Update homepage expectations if selected work ordering changes.
5. Run the targeted e2e tests and verify they fail for missing migrated content.

### Task 2: Add Canonical Work Case Studies

**Files:**
- Create: `src/content/work/enterprise-ai-platform.mdx`
- Create: `src/content/work/enterprise-rag-platform.mdx`
- Modify: `src/content/work/enterprise-oa-agent.mdx`
- Modify: `src/content/work/ai-browser.mdx`
- Modify: `src/content/work/intelligent-bidding-system.mdx`

**Steps:**
1. Add the enterprise AI platform case study from legacy OpenResume facts.
2. Add the enterprise RAG platform case study from legacy OpenResume facts.
3. Reorder existing work entries so the current strongest work appears first.
4. Add stronger metrics and specific implementation facts to OA and AI Browser.
5. Keep bilingual `sectionsEn` in sync with Chinese case bodies.

### Task 3: Refresh Resume And Experience Data

**Files:**
- Modify: `src/data/profile.ts`
- Modify: `src/data/resume.ts`
- Modify: `src/data/experience.ts`

**Steps:**
1. Update GitHub and email to the public identities from OpenResume.
2. Add public company and role details to experience.
3. Add migrated project names, skills, metrics, and writing/community proof to resume data.
4. Keep the copy aligned with the site's current restrained tone.

### Task 4: Verification

**Files:**
- No new source files unless verification reveals an issue.

**Steps:**
1. Run `npm run test:e2e -- tests/e2e/content.spec.ts tests/e2e/home.spec.ts`.
2. Run `npm run check`.
3. Run `git diff --check`.
4. Run `npm run build`.
5. Run `npm run test:e2e`.
6. Preview `/work`, the new case pages, and `/resume` locally.
