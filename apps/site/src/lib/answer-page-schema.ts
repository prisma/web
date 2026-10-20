import { z } from "zod";

export const answerPageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(160),
  summary: z.string().min(1),
  author: z.string().min(1),
  authorUrl: z.url(),
  date: z.iso.date(),
  updatedAt: z.iso.date(),
  readingTime: z.string().min(1),
  faq: z
    .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
    .min(3)
    .max(4),
  related: z.array(z.object({ title: z.string().min(1), href: z.string().min(1) })).min(2),
  cta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    label: z.string().min(1),
    href: z.string().min(1),
  }),
});
