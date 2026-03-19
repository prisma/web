---
name: write-agent-first-docs
description: Write or rewrite Prisma developer docs in Markdown or MDX with crisp, opinionated, agent-first structure. Use when Codex needs to draft, tighten, split, merge, de-duplicate, or refactor quickstarts, task/how-to pages, decision pages, client integration pages, schema evolution or migration or import or export docs, operations or management pages, troubleshooting pages, reference pages, API or CLI or MCP or automation docs, or docs IA changes that turn long pages into clearer task-first content.
---

# Write Agent-First Docs

Use this skill to produce docs that are retrieval-friendly for agents, direct for humans, and grounded in the repo's actual docs patterns.

## Workflow

1. Inspect nearby docs in the same section and load [references/repo-conventions.md](references/repo-conventions.md).
2. Identify the page type with [references/page-types.md](references/page-types.md). Keep one primary job per page.
3. Find the canonical source-of-truth page for shared setup or concepts. Reuse it; do not restate it.
4. Draft the page answer-first. Put the main recommendation, outcome, or constraint in the opening paragraph.
5. Apply [references/style-rules.md](references/style-rules.md) while writing. Prefer literal headings, minimal runnable examples, and explicit verification.
6. Run `python3 scripts/check_doc_quality.py <file ...>` on every page you touched.
7. Revise until hard failures are gone and warnings are either fixed or consciously justified by the page type.

## Writing Rules

- Optimize for chunked retrieval. Assume the reader may only see the title, intro, one section, and one code block.
- Use exact nouns people search for: product names, features, commands, flags, env vars, ports, error strings, and method names.
- Prefer one default path. Add alternatives only when the tradeoff is real and selection criteria are explicit.
- Link out for depth instead of duplicating shared setup or theory.
- Treat screenshots, tabs, and callouts as support material, never as the only place a required step appears.
- Favor the calm, compact cadence in [references/style-rules.md](references/style-rules.md): short paragraphs, direct openings, and no filler transitions.

## Resources

- [references/style-rules.md](references/style-rules.md): house voice, anti-patterns, rewrite examples, and sentence-level rules.
- [references/page-types.md](references/page-types.md): exact skeletons for quickstarts, decision pages, integrations, deep dives, migrations, operations, troubleshooting, and reference docs.
- [references/repo-conventions.md](references/repo-conventions.md): non-obvious MDX, frontmatter, link, and navigation conventions in this repo.
- [scripts/check_doc_quality.py](scripts/check_doc_quality.py): deterministic checker for structural issues and common style smells.

## De-duplication Rules

- If a concept already has a canonical page, summarize the local delta in one sentence and link to that page.
- If a page has both task steps and deep explanation, split it unless the explanation is required to complete the task immediately.
- If you are rewriting an existing page, delete repeated setup, generic intros, and low-value option lists before adding new text.

## Verify

- Confirm the draft matches one page type from [references/page-types.md](references/page-types.md).
- Run `python3 scripts/check_doc_quality.py <file ...>` and clear hard failures before finishing.
