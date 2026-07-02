---
name: prisma-docs-voice
description: Use when the operator wants Prisma docs, educational content, tutorials, guides, FAQs, or support-style responses reviewed, edited, or rewritten for accuracy, clarity, usefulness, calm tone, and product correctness without hype. Also use when writing or reviewing Prisma Next docs, where it fact-checks against the Prisma Next repo and follows the Prisma Next user-docs spec.
---

# Prisma Docs Voice

Use this skill for docs and educational writing, plus support-style communication that should sound clear and calm rather than promotional.

## Usage guide

Use this skill for prompts like:

- `Does this docs page talk about Accelerate correctly?`
- `Rewrite this guide intro so it is clearer and less hyped.`
- `Check this quickstart for vague claims and missing caveats.`
- `Turn this product note into a helpful support-style response.`
- `Review this docs PR for accuracy, tone, and usefulness.`
- `Write the Prisma Next data-modeling page.`
- `Review this Prisma Next docs PR for accuracy against the repo.`

## Foundation first

- If `prisma-product-messaging` is available, consult it first.
- Use that skill for product naming, messaging hierarchy, and uncertainty handling.
- Then read `references/docs-guidance.md`.
- For Prisma Next work (writing or reviewing anything under `/docs/orm/next` or `/docs/next`, or any page describing Prisma Next behavior), read `references/prisma-next.md` before writing. It is the branch that governs source of truth, information architecture, fact-checking, and redirect tracking.

## Workflow

1. Identify whether the draft is docs, educational content, FAQ, support-style communication, or Prisma Next docs.
2. Confirm the product references are accurate and specific.
3. Cut hype, vague value claims, and dramatic language.
4. Rewrite for usefulness first.
5. Add step-by-step structure when the reader needs to do something.

## Large docs review

When reviewing a docs PR or doc set, prioritize:

1. Overview and intro paragraphs.
2. Quickstart steps and prerequisites.
3. Command descriptions and examples.
4. Limitation and troubleshooting sections.
5. Any sentence that implies guarantees, defaults, or unsupported behavior.

## Docs and support rules

- Accuracy beats cleverness.
- Clarity beats persuasion.
- State limitations honestly.
- Do not use em dashes.
- If the source material is uncertain or incomplete, say so plainly and recommend verification.
