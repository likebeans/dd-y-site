import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    summaryEn: z.string(),
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
      .default([]),
    sectionsEn: z
      .array(
        z.object({
          heading: z.string(),
          body: z.array(z.string())
        })
      )
      .default([])
  })
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    minutes: z.number(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    sectionsEn: z
      .array(
        z.object({
          heading: z.string(),
          body: z.array(z.string())
        })
      )
      .default([])
  })
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    bodyEn: z.string(),
    publishedAt: z.date(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { work, writing, notes };
