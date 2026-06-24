import { defineCollection } from "astro:content";
import { z } from "astro/zod";

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
