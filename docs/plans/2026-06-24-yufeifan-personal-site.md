# Yufeifan Personal Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `yufeifan.cn` as an elegant, job-search-oriented personal technical site for dd-y / 余非凡, combining portfolio, work experience, blog, resume, and a restrained systems-engineering visual identity.

**Architecture:** Use Astro as a mostly static content site with MDX and Content Collections for projects, articles, notes, and experience. Use React islands only for small interactive surfaces such as the System Trace and project hover preview, animated with `motion` and disabled under reduced-motion preferences. Deploy the static build to Cloudflare Pages with `dist` as the output directory.

**Tech Stack:** Astro, TypeScript, MDX, Astro Content Collections, React islands, Motion for React, CSS custom properties, Playwright, Cloudflare Pages, Wrangler.

---

## Product Direction

Build V1 around the approved visual direction: **Quiet Editorial Engineering**.

The site should feel mature, warm, restrained, and credible. It should support later job-search conversations by quickly showing:

- who 余非凡 is;
- what kind of AI systems work he does;
- which projects demonstrate judgment and engineering depth;
- what he has written and how he thinks;
- how to view or download the resume.

Avoid generic AI visuals: no blue-purple gradients, robots, glass cards, neural particles, fake dashboards, oversized SaaS cards, or ornamental 3D objects.

## Target Routes

```text
/
/work
/work/[slug]
/experience
/writing
/writing/[slug]
/notes
/about
/resume
/resume.pdf
```

## Visual System

```css
:root {
  --color-paper: #f5f1e8;
  --color-ink: #111111;
  --color-muted: #8b867c;
  --color-line: #d9d3c8;
  --color-lime: #c7f432;
  --font-display: "Geist", "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-body: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
}
```

Use typography, whitespace, and grid discipline as the main design tools. Lime accent must stay rare: active navigation, tiny dots, System Trace active node, one or two hover states.

---

### Task 1: Scaffold Astro Project and Quality Gates

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/env.d.ts`
- Create: `public/favicon.svg`

**Step 1: Create the package manifest**

Create `package.json`:

```json
{
  "name": "yufeifan-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "deploy:preview": "wrangler pages deploy dist --project-name yufeifan-site --branch preview",
    "deploy:prod": "wrangler pages deploy dist --project-name yufeifan-site --branch main"
  },
  "dependencies": {
    "@astrojs/mdx": "latest",
    "@astrojs/react": "latest",
    "astro": "latest",
    "motion": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@astrojs/check": "latest",
    "@playwright/test": "latest",
    "sharp": "latest",
    "typescript": "latest",
    "wrangler": "latest"
  }
}
```

**Step 2: Create Astro config**

Create `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://yufeifan.cn",
  integrations: [mdx(), react()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
```

**Step 3: Create TypeScript config**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Step 4: Create ignore file**

Create `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.wrangler/
.DS_Store
.env
```

**Step 5: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules` and `package-lock.json` are created.

**Step 6: Run the first check**

Run:

```bash
npm run check
```

Expected: Astro reports no pages yet or completes once base files exist.

**Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/env.d.ts public/favicon.svg
git commit -m "chore: scaffold astro site"
```

---

### Task 2: Define Content Collections and Seed Content

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/work/enterprise-oa-agent.mdx`
- Create: `src/content/work/ai-browser.mdx`
- Create: `src/content/work/intelligent-bidding-system.mdx`
- Create: `src/content/writing/rag-chunking-tables-code-images.mdx`
- Create: `src/content/writing/agent-runtime-beyond-loop.mdx`
- Create: `src/content/notes/model-to-system.md`
- Create: `src/data/profile.ts`
- Create: `src/data/navigation.ts`

**Step 1: Create content schemas**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";

const work = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.number(),
    order: z.number(),
    role: z.string(),
    status: z.string(),
    stack: z.array(z.string()),
    tags: z.array(z.string()),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string()
        })
      )
      .default([])
  })
});

const writing = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    minutes: z.number(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false)
  })
});

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: z.date(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { work, writing, notes };
```

**Step 2: Create profile data**

Create `src/data/profile.ts`:

```ts
export const profile = {
  name: "余非凡",
  handle: "dd-y",
  domain: "yufeifan.cn",
  location: "Beijing, China",
  timezone: "GMT+8",
  role: "大模型算法工程师 / AI Systems Engineer",
  headline: "FROM MODELS\nTO SYSTEMS",
  thesis: "不只调用模型，而是把模型能力变成系统能力。",
  intro:
    "关注 RAG、Agent、工具调用、评测与可上线的 AI 应用系统。",
  availability: "AVAILABLE FOR GOOD WORK",
  email: "hi@yufeifan.cn",
  github: "https://github.com/dd-y"
};
```

**Step 3: Create navigation data**

Create `src/data/navigation.ts`:

```ts
export const navItems = [
  { label: "WORK", href: "/work" },
  { label: "EXPERIENCE", href: "/experience" },
  { label: "WRITING", href: "/writing" },
  { label: "ABOUT", href: "/about" },
  { label: "RESUME", href: "/resume" }
] as const;
```

**Step 4: Seed three project entries**

Create each `src/content/work/*.mdx` with frontmatter:

```mdx
---
title: "Enterprise OA Agent"
summary: "把企业流程中的自然语言请求转化为可审批、可追踪、可回滚的系统动作。"
year: 2025
order: 1
role: "Agent / MCP / Workflow"
status: "Case Study"
stack: ["Python", "FastAPI", "LangGraph", "PostgreSQL", "Redis", "MCP"]
tags: ["Agent", "Workflow", "Tool Calling"]
metrics:
  - label: "Intent coverage"
    value: "80%"
  - label: "Tool success"
    value: "95%+"
---

## Problem

企业 OA 系统中的流程入口分散，用户需要理解多个系统页面、审批规则和字段约束。

## Constraints

- 工具调用必须可审计。
- 敏感操作需要审批。
- Agent 不能绕过原有权限系统。

## System Design

Use an architecture figure here.

## Key Decisions

Explain the engineering judgment behind the system.

## Impact

Use desensitized metrics.

## Reflection

Describe what changed after production use.
```

Repeat with adjusted metadata for:

- `ai-browser.mdx`
- `intelligent-bidding-system.mdx`

**Step 5: Seed two writing entries**

Create `src/content/writing/rag-chunking-tables-code-images.mdx`:

```mdx
---
title: "RAG 分块中的表格、代码块与图片保护"
description: "在复杂文档处理中保护语义结构，而不是简单按长度切分。"
publishedAt: 2026-06-15
updatedAt: 2026-06-16
minutes: 12
tags: ["RAG", "Document Parsing", "Chunking"]
featured: true
---

复杂文档分块的问题，不是把文本切得更平均，而是尽量保护原始语义结构。

## 背景与问题

Write the first real article draft here.
```

Create `src/content/writing/agent-runtime-beyond-loop.mdx`:

```mdx
---
title: "Agent Runtime 不只是循环调用模型"
description: "一个生产级 Agent Runtime 还需要状态、审批、工具、事件与可观测性。"
publishedAt: 2026-06-20
minutes: 16
tags: ["Agent", "System Design", "Runtime"]
featured: true
---

Agent 的难点不在于让模型多调用一次工具，而在于让执行过程可控、可评测、可恢复。
```

**Step 6: Run content type check**

Run:

```bash
npm run check
```

Expected: PASS. If frontmatter fails schema validation, fix the exact field named by Astro.

**Step 7: Commit**

```bash
git add src/content.config.ts src/content src/data
git commit -m "feat: add content model and seed entries"
```

---

### Task 3: Build Global Layout, Tokens, and Editorial Shell

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/styles/global.css`
- Create: `src/styles/tokens.css`
- Modify: `astro.config.mjs`

**Step 1: Import global CSS**

Modify `src/layouts/BaseLayout.astro` later to import:

```astro
---
import "@/styles/tokens.css";
import "@/styles/global.css";
import SiteHeader from "@/components/SiteHeader.astro";
import SiteFooter from "@/components/SiteFooter.astro";

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "dd-y / 余非凡",
  description = "大模型算法工程师，关注 RAG、Agent、工具调用、评测与可上线的 AI 应用系统。"
} = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <SiteHeader />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </body>
</html>
```

**Step 2: Create design tokens**

Create `src/styles/tokens.css`:

```css
:root {
  color-scheme: light;
  --color-paper: #f5f1e8;
  --color-ink: #111111;
  --color-muted: #8b867c;
  --color-soft: #ece6dc;
  --color-line: #d9d3c8;
  --color-lime: #c7f432;
  --space-page: clamp(1.25rem, 5vw, 4rem);
  --max-page: 1440px;
  --radius-small: 4px;
  --font-display: "Geist", "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-body: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
}
```

**Step 3: Create global CSS**

Create `src/styles/global.css` with:

```css
* {
  box-sizing: border-box;
}

html {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  text-rendering: geometricPrecision;
}

body {
  margin: 0;
  min-width: 320px;
  background:
    linear-gradient(to right, rgba(17, 17, 17, 0.045) 1px, transparent 1px) 0 0 /
      calc((100vw - 2 * var(--space-page)) / 12) 100%,
    var(--color-paper);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

::selection {
  background: var(--color-lime);
  color: var(--color-ink);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

**Step 4: Create header**

Create `src/components/SiteHeader.astro` using `navItems` and `profile`. Keep it one line on desktop, collapse to two rows on mobile.

**Step 5: Create footer**

Create `src/components/SiteFooter.astro` with copyright, GitHub, email, and resume link.

**Step 6: Run check**

Run:

```bash
npm run check
```

Expected: PASS.

**Step 7: Commit**

```bash
git add src/layouts src/components src/styles astro.config.mjs
git commit -m "feat: add editorial site shell"
```

---

### Task 4: Implement Homepage Static Sections

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/home/Hero.astro`
- Create: `src/components/home/SelectedWork.astro`
- Create: `src/components/home/FeaturedWriting.astro`
- Create: `src/components/home/ExperiencePreview.astro`
- Create: `src/components/home/TechnicalFocus.astro`
- Create: `src/components/SectionLabel.astro`
- Create: `src/components/ArrowLink.astro`

**Step 1: Build `index.astro`**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Hero from "@/components/home/Hero.astro";
import SelectedWork from "@/components/home/SelectedWork.astro";
import FeaturedWriting from "@/components/home/FeaturedWriting.astro";
import ExperiencePreview from "@/components/home/ExperiencePreview.astro";
import TechnicalFocus from "@/components/home/TechnicalFocus.astro";
---

<BaseLayout
  title="dd-y / 余非凡 - AI Systems Engineer"
  description="FROM MODELS TO SYSTEMS. 大模型算法工程师，关注 RAG、Agent、工具调用、评测与可上线的 AI 应用系统。"
>
  <Hero />
  <SelectedWork />
  <ExperiencePreview />
  <TechnicalFocus />
  <FeaturedWriting />
</BaseLayout>
```

**Step 2: Build `Hero.astro`**

Hero must include:

- `dd-y / 余非凡` already in nav;
- `FROM MODELS` and `TO SYSTEMS`;
- Chinese thesis;
- role and intro;
- two CTAs: `SELECTED WORK`, `READ WRITING`;
- right-side small status and abstract system diagram placeholder;
- bottom System Trace island placeholder.

**Step 3: Build selected work section**

Use Content Collections:

```ts
const works = (await getCollection("work")).sort(
  (a, b) => a.data.order - b.data.order
);
```

Render as list rows, not cards.

**Step 4: Build featured writing**

Use Content Collections:

```ts
const posts = (await getCollection("writing"))
  .filter((post) => post.data.featured)
  .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
```

Render with editorial teaser layout.

**Step 5: Run build**

Run:

```bash
npm run build
```

Expected: PASS and `dist/` is created.

**Step 6: Commit**

```bash
git add src/pages/index.astro src/components/home src/components/SectionLabel.astro src/components/ArrowLink.astro
git commit -m "feat: build homepage editorial sections"
```

---

### Task 5: Add System Trace React Island with Motion

**Files:**
- Create: `src/components/islands/SystemTrace.tsx`
- Create: `src/components/islands/ProjectPreview.tsx`
- Modify: `src/components/home/Hero.astro`
- Modify: `src/components/home/SelectedWork.astro`

**Step 1: Implement SystemTrace**

Create `src/components/islands/SystemTrace.tsx`:

```tsx
import { motion, useReducedMotion } from "motion/react";

const nodes = [
  { label: "MODEL", text: "Understand capability" },
  { label: "CONTEXT", text: "Organize information" },
  { label: "RETRIEVAL", text: "Find relevant knowledge" },
  { label: "TOOLS", text: "Call reliable functions" },
  { label: "WORKFLOW", text: "Orchestrate process" },
  { label: "PRODUCT", text: "Deliver value to users" }
];

export function SystemTrace() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="system-trace" aria-label="System trace">
      <div className="system-trace__line" aria-hidden="true">
        {!reduceMotion && (
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </div>
      {nodes.map((node) => (
        <a className="system-trace__node" href={`/writing?topic=${node.label.toLowerCase()}`} key={node.label}>
          <span className="system-trace__dot" />
          <strong>{node.label}</strong>
          <small>{node.text}</small>
        </a>
      ))}
    </div>
  );
}
```

**Step 2: Hydrate in Hero**

Modify `Hero.astro`:

```astro
---
import { SystemTrace } from "@/components/islands/SystemTrace";
---

<SystemTrace client:visible />
```

**Step 3: Style trace**

Add trace styles to `src/styles/global.css` or a scoped Hero style. Ensure:

- stable height;
- no layout shift after hydration;
- static fallback remains acceptable before JS loads;
- line uses `transform-origin: left`.

**Step 4: Add ProjectPreview island only if needed**

Keep this small. It should update a diagram preview on hover/focus, not animate the whole page.

**Step 5: Test reduced motion**

Run local dev:

```bash
npm run dev
```

Open the page and enable reduced motion in browser dev tools. Expected: trace remains visible but does not animate.

**Step 6: Run build**

```bash
npm run build
```

Expected: PASS.

**Step 7: Commit**

```bash
git add src/components/islands src/components/home src/styles
git commit -m "feat: add restrained system trace interaction"
```

---

### Task 6: Build Work Index and Case Study Pages

**Files:**
- Create: `src/pages/work/index.astro`
- Create: `src/pages/work/[slug].astro`
- Create: `src/layouts/CaseStudyLayout.astro`
- Create: `src/components/work/WorkIndex.astro`
- Create: `src/components/work/ArchitectureFigure.astro`
- Create: `src/components/work/MetricStrip.astro`
- Create: `src/components/work/ProjectMeta.astro`

**Step 1: Build `/work`**

Render all project entries as a full-width numbered index:

```text
01 Enterprise OA Agent         Agent / MCP / Workflow        2025
02 AI Browser                  RAG / Search / VLLM           2024
03 Intelligent Bidding System  Crawler / Agent / RAG         2026
```

Rows must be clickable. Avoid per-row buttons.

**Step 2: Build dynamic case study routes**

Create `src/pages/work/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import CaseStudyLayout from "@/layouts/CaseStudyLayout.astro";

export async function getStaticPaths() {
  const works = await getCollection("work");
  return works.map((work) => ({
    params: { slug: work.id.replace(/\.mdx$/, "") },
    props: { work }
  }));
}

const { work } = Astro.props;
const { Content } = await render(work);
---

<CaseStudyLayout entry={work}>
  <Content />
</CaseStudyLayout>
```

**Step 3: Build CaseStudyLayout**

Layout sections:

- overview;
- problem;
- constraints;
- system design;
- key decisions;
- impact;
- reflection.

Use a left rail for section labels on desktop and normal flow on mobile.

**Step 4: Add architecture figure**

Implement `ArchitectureFigure.astro` as deterministic HTML/SVG-like layout, not raster image. Use thin borders, small labels, and one lime active node.

**Step 5: Build and manually inspect**

Run:

```bash
npm run build
npm run preview
```

Expected:

- `/work` renders all seeded projects.
- `/work/enterprise-oa-agent` renders frontmatter and MDX content.
- No horizontal overflow at 390px width.

**Step 6: Commit**

```bash
git add src/pages/work src/layouts/CaseStudyLayout.astro src/components/work
git commit -m "feat: add work index and case study pages"
```

---

### Task 7: Build Writing, Notes, and MDX Components

**Files:**
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[slug].astro`
- Create: `src/pages/notes/index.astro`
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/components/mdx/CodeBlock.astro`
- Create: `src/components/mdx/Figure.astro`
- Create: `src/components/mdx/Callout.astro`
- Create: `src/components/mdx/DataTable.astro`
- Create: `src/components/mdx/ArticleToc.astro`

**Step 1: Build writing index**

Render featured writing first, then all articles by date. Keep the article list editorial and quiet, not card-heavy.

**Step 2: Build dynamic article routes**

Create `src/pages/writing/[slug].astro` using `getStaticPaths`, `getCollection("writing")`, and `render(entry)`.

**Step 3: Build ArticleLayout**

Desktop layout:

```text
left rail: article meta
center: readable article body, 760-820px
right rail: table of contents
```

Mobile:

```text
article title
metadata
body
toc collapsed or omitted
```

**Step 4: Add MDX components**

Implement:

- `CodeBlock` for filename, language, copy button placeholder, and code wrapper;
- `Figure` for image, caption, width variants;
- `Callout` for notes and warnings;
- `DataTable` for horizontally scrollable tables;
- `ArticleToc` generated from headings if feasible in V1, otherwise render a static heading list.

**Step 5: Add MDX component mapping**

Create `src/components/mdx/index.ts` if needed:

```ts
export { default as Callout } from "./Callout.astro";
export { default as Figure } from "./Figure.astro";
export { default as DataTable } from "./DataTable.astro";
```

Use these components directly inside `.mdx` content.

**Step 6: Build notes index**

Render notes as short dated entries. No detail pages needed in V1 unless content grows.

**Step 7: Run checks**

```bash
npm run check
npm run build
```

Expected: PASS.

**Step 8: Commit**

```bash
git add src/pages/writing src/pages/notes src/layouts/ArticleLayout.astro src/components/mdx
git commit -m "feat: add writing and mdx article system"
```

---

### Task 8: Build Experience, About, and Resume Pages

**Files:**
- Create: `src/pages/experience.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/resume.astro`
- Create: `public/resume-yufeifan.pdf`
- Create: `src/components/resume/ResumeSection.astro`
- Create: `src/components/resume/ExperienceTimeline.astro`
- Create: `src/data/experience.ts`
- Create: `src/data/resume.ts`

**Step 1: Create experience data**

Create `src/data/experience.ts`:

```ts
export const experience = [
  {
    period: "2025 - Now",
    title: "Large Language Model Algorithm Engineer",
    organization: "Current / Confidential",
    summary:
      "负责企业 AI 应用中的 RAG、Agent、工具调用、流程编排与评测体系建设。",
    highlights: [
      "把自然语言入口连接到可审批、可观测的业务流程。",
      "建设面向复杂文档的解析、检索、重排与评测链路。"
    ]
  }
];
```

**Step 2: Create resume data**

Create `src/data/resume.ts` with sections:

- summary;
- skills;
- work experience;
- selected projects;
- writing;
- education;
- links.

**Step 3: Build `/experience`**

Focus on career path and judgment, not just timeline. Include a short paragraph:

```text
我的工作重心从模型能力本身，逐渐转向模型如何进入真实业务系统。
```

**Step 4: Build `/about`**

Tell the professional story:

- from model/application work;
- into RAG and Agent systems;
- current focus on production AI systems;
- writing and open-source interests.

**Step 5: Build `/resume`**

Requirements:

- clean printable layout;
- link to `/resume-yufeifan.pdf`;
- Chinese by default;
- room to add English toggle later;
- no heavy animation.

**Step 6: Add placeholder PDF**

Place a current resume PDF at:

```text
public/resume-yufeifan.pdf
```

If final PDF is not ready, add a temporary text file note in the plan execution and replace before launch.

**Step 7: Run print check**

Open `/resume`, use browser print preview. Expected: no clipped sections, black text on white/paper background, links visible.

**Step 8: Commit**

```bash
git add src/pages/experience.astro src/pages/about.astro src/pages/resume.astro src/components/resume src/data/experience.ts src/data/resume.ts public/resume-yufeifan.pdf
git commit -m "feat: add experience about and resume pages"
```

---

### Task 9: Add SEO, Sitemap, RSS, and Social Metadata

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Create: `src/pages/robots.txt.ts`
- Create: `src/pages/sitemap.xml.ts`
- Create: `src/pages/rss.xml.ts`
- Create: `public/og-home.png`

**Step 1: Extend BaseLayout props**

Add:

```ts
interface Props {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
}
```

Render:

- canonical URL;
- Open Graph title/description/image;
- Twitter card metadata;
- `theme-color`.

**Step 2: Add robots**

Create `src/pages/robots.txt.ts`:

```ts
export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://yufeifan.cn/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
```

**Step 3: Add sitemap**

Create static route entries for:

- homepage;
- work index and work entries;
- writing index and writing entries;
- notes;
- experience;
- about;
- resume.

**Step 4: Add RSS**

RSS should include writing entries only. Keep notes out of RSS for V1 unless requested.

**Step 5: Add OG image**

Create `public/og-home.png` from the approved visual direction later, or use a static browser-shot crop after the homepage is implemented.

**Step 6: Validate metadata**

Run:

```bash
npm run build
```

Expected:

- `/robots.txt` exists in `dist`.
- `/sitemap.xml` exists in `dist`.
- `/rss.xml` exists in `dist`.

**Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/robots.txt.ts src/pages/sitemap.xml.ts src/pages/rss.xml.ts public/og-home.png
git commit -m "feat: add seo metadata and feeds"
```

---

### Task 10: Add Playwright Smoke and Visual Checks

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/content.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`

**Step 1: Create Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry"
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"] } }
  ]
});
```

**Step 2: Add homepage smoke test**

Create `tests/e2e/home.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("homepage presents identity and primary sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("FROM MODELS")).toBeVisible();
  await expect(page.getByText("TO SYSTEMS")).toBeVisible();
  await expect(page.getByText("SELECTED WORK")).toBeVisible();
  await expect(page.getByText("FEATURED WRITING")).toBeVisible();
});
```

**Step 3: Add content route smoke tests**

Create `tests/e2e/content.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("work case study renders", async ({ page }) => {
  await page.goto("/work/enterprise-oa-agent");
  await expect(page.getByRole("heading", { name: "Enterprise OA Agent" })).toBeVisible();
});

test("writing article renders", async ({ page }) => {
  await page.goto("/writing/rag-chunking-tables-code-images");
  await expect(page.getByRole("heading", { name: "RAG 分块中的表格、代码块与图片保护" })).toBeVisible();
});
```

**Step 4: Add responsive overflow test**

Create `tests/e2e/responsive.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
```

**Step 5: Install browser binaries**

Run:

```bash
npx playwright install chromium
```

**Step 6: Run tests**

Run:

```bash
npm run test:e2e
```

Expected: all tests pass in desktop and mobile projects.

**Step 7: Commit**

```bash
git add playwright.config.ts tests/e2e
git commit -m "test: add portfolio smoke checks"
```

---

### Task 11: Responsive Polish, Accessibility, and Performance Pass

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/home/Hero.astro`
- Modify: `src/components/islands/SystemTrace.tsx`
- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/layouts/CaseStudyLayout.astro`

**Step 1: Check desktop screenshot**

Run:

```bash
npm run dev
```

Open `http://localhost:4321` at `1440x1000`.

Expected:

- hero looks elegant and spacious;
- headline does not collide with header;
- trace does not dominate the page;
- next section is slightly visible below first viewport.

**Step 2: Check mobile screenshot**

Open at `390x844`.

Expected:

- headline wraps intentionally;
- nav remains usable;
- trace becomes vertical or simplified;
- project rows do not overflow;
- article pages remain readable.

**Step 3: Check keyboard navigation**

Use Tab from the top of the page.

Expected:

- focus states are visible;
- nav, CTA, trace nodes, project rows, and article links are reachable;
- focus state uses ink/lime without glowing effects.

**Step 4: Check reduced motion**

In browser settings or dev tools, emulate reduced motion.

Expected:

- System Trace animation stops;
- layout remains identical;
- no content depends on animation to appear.

**Step 5: Check Lighthouse basics**

Use browser Lighthouse or equivalent.

Target:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

**Step 6: Run automated checks**

```bash
npm run check
npm run build
npm run test:e2e
```

Expected: all pass.

**Step 7: Commit**

```bash
git add src
git commit -m "polish: refine responsive accessibility and motion"
```

---

### Task 12: Cloudflare Pages Deployment Setup

**Files:**
- Create: `wrangler.toml`
- Create: `docs/deployment.md`
- Modify: `package.json`

**Step 1: Create Wrangler config**

Create `wrangler.toml`:

```toml
name = "yufeifan-site"
compatibility_date = "2026-06-24"
pages_build_output_dir = "dist"
```

**Step 2: Create deployment docs**

Create `docs/deployment.md`:

```md
# Deployment

## Local Build

```bash
npm run build
```

## Cloudflare Auth

```bash
npx wrangler whoami
```

If not authenticated:

```bash
npx wrangler login
```

## Preview Deploy

```bash
npm run build
npm run deploy:preview
```

## Production Deploy

```bash
npm run build
npm run deploy:prod
```

## Cloudflare Pages Dashboard

Build command:

```bash
npm run build
```

Build output directory:

```text
dist
```

Production domain:

```text
yufeifan.cn
```

Recommended redirect:

```text
www.yufeifan.cn -> yufeifan.cn
```
```

**Step 3: Verify Cloudflare auth**

Run:

```bash
npx wrangler whoami
```

Expected:

- If authenticated: shows account.
- If not authenticated: run `npx wrangler login` before deployment.

**Step 4: Create preview deploy**

Run:

```bash
npm run build
npm run deploy:preview
```

Expected: Cloudflare Pages returns a preview deployment URL.

**Step 5: Attach domain in Cloudflare Dashboard**

In Cloudflare:

1. Open Workers & Pages.
2. Select `yufeifan-site`.
3. Add custom domain `yufeifan.cn`.
4. Add `www.yufeifan.cn` and redirect it to root if desired.
5. Enable Cloudflare Web Analytics.

**Step 6: Commit**

```bash
git add wrangler.toml docs/deployment.md package.json
git commit -m "chore: add cloudflare pages deployment setup"
```

---

### Task 13: Launch Review and Content Replacement

**Files:**
- Modify: `src/content/work/*.mdx`
- Modify: `src/content/writing/*.mdx`
- Modify: `src/data/experience.ts`
- Modify: `src/data/resume.ts`
- Replace: `public/resume-yufeifan.pdf`
- Modify: `public/og-home.png`

**Step 1: Replace placeholder project content**

For each project, fill in:

- business context;
- problem;
- constraints;
- system design;
- key decisions;
- measurable impact;
- reflection.

Do not expose confidential data. Use desensitized metrics and architecture.

**Step 2: Replace placeholder articles**

Ensure at least two articles are real enough to publish:

- one RAG/document-processing article;
- one Agent/runtime/system-design article.

**Step 3: Replace resume PDF**

Place final PDF at:

```text
public/resume-yufeifan.pdf
```

**Step 4: Capture final OG image**

Run the site locally and capture a clean homepage screenshot. Crop to `1200x630` and save:

```text
public/og-home.png
```

**Step 5: Final verification**

Run:

```bash
npm run check
npm run build
npm run test:e2e
```

Expected: all pass.

**Step 6: Production deploy**

Run:

```bash
npm run deploy:prod
```

Expected: production deployment succeeds.

**Step 7: Final live checks**

Check:

- `https://yufeifan.cn`
- `https://yufeifan.cn/work`
- `https://yufeifan.cn/writing`
- `https://yufeifan.cn/resume`
- `https://yufeifan.cn/robots.txt`
- `https://yufeifan.cn/sitemap.xml`
- `https://yufeifan.cn/rss.xml`

**Step 8: Commit**

```bash
git add src/content src/data public/resume-yufeifan.pdf public/og-home.png
git commit -m "content: prepare site for launch"
```

---

## Implementation Order Summary

1. Scaffold Astro and install dependencies.
2. Define content collections and seed project/blog data.
3. Build global editorial shell and design tokens.
4. Build homepage static sections.
5. Add System Trace and project hover interaction.
6. Build work index and project case studies.
7. Build writing, notes, and MDX article components.
8. Build experience, about, and resume pages.
9. Add SEO, sitemap, RSS, and OG metadata.
10. Add Playwright smoke tests.
11. Polish responsive, accessibility, and performance.
12. Set up Cloudflare Pages deployment.
13. Replace placeholder content and launch.

## Important Design Constraints During Execution

- Do not introduce a component library or generic UI theme.
- Do not turn every section into rounded cards.
- Do not use gradients, bokeh, decorative blobs, glassmorphism, or AI stock imagery.
- Keep motion rare and meaningful.
- Keep article pages quieter than the homepage.
- Keep resume printable.
- Keep content editable as MDX/data files.
- Keep V1 static; do not add a database or CMS yet.

## Reference Docs

- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Astro MDX integration: https://docs.astro.build/en/guides/integrations-guide/mdx/
- Astro React integration: https://docs.astro.build/en/guides/integrations-guide/react/
- Astro Cloudflare deployment: https://docs.astro.build/en/guides/deploy/cloudflare/
- Motion for React: https://motion.dev/docs/react
- Cloudflare Pages: https://developers.cloudflare.com/pages/
