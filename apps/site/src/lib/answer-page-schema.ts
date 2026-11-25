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
  /** Short "On this page" labels, keyed by heading anchor (and `faq`). */
  tocLabels: z.record(z.string(), z.string().min(1)).optional(),
  /** Optional decorative background for the header. */
  headerArt: z.enum(["ripple"]).optional(),
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
    /** Optional one-line shell command shown as a copyable pill next to the button. */
    command: z.string().min(1).optional(),
  }),
});
