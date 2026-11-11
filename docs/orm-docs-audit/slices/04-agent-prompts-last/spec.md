# Slice: agent prompts come after the human steps

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`; plan in `restructure-plan.md`. Item A3 of `changes.md`. Builds on slice 02, prisma/web#8350.)_

## At a glance

Today `/prisma-orm`, `/getting-started`, and the twelve framework and runtime guides put a copyable agent prompt ahead of the instructions a person follows: on the guides it is the section straight after Prerequisites, and on `/prisma-orm` it comes before the framework and fundamentals sections. This is the direct cause of the "the docs are written for AI" complaint. After this slice, every one of these pages reads as instructions for a person first, and the agent prompt is the last section before Next steps. No prompt text changes.

## Chosen design

All paths are under `apps/docs/content/docs/`. Do not touch `v6/` or `v7/` folders.

### The twelve guides

`guides/frameworks/astro.mdx`, `elysia.mdx`, `hono.mdx`, `nestjs.mdx`, `nextjs.mdx`, `nuxt.mdx`, `react-router-7.mdx`, `solid-start.mdx`, `sveltekit.mdx`, `tanstack-start.mdx`, `guides/runtimes/bun.mdx`, and `deno.mdx`.

On each guide, the `## Use with your agent` section (its lead sentence and its `<AgentPrompt>` block) moves from after Prerequisites to directly before `## Next steps`. Where the guide has a `## Prompt your coding agent` section near the end (Elysia, Hono, NestJS, Solid Start, React Router 7, Bun), the two become one `## Use with your agent` section in that position: first the lead sentence and the prompt block, then the sentence that points at `npx prisma@latest init` and the Prisma ORM skills, then the follow-up prompts. The `## Prompt your coding agent` heading is removed. The order of the other sections does not change, and no prompt text, follow-up prompt, or lead sentence is reworded.

### `/prisma-orm` (`(index)/prisma-orm/index.mdx`)

`## Use with your agent` moves from before "Add Prisma ORM to your framework" to after "Learn the concepts", so it is the last section on the page. Its text does not change.

### `/getting-started` (`(index)/getting-started.mdx`)

The two `<AgentPrompt>` blocks leave their sections ("Start a new project" and "Add to an existing project") and move into one new `## Use with your agent` section placed after "After setup", so it is the last section on the page. It opens with one sentence saying what the section is for, then the new-project prompt with a lead line naming it, then the existing-project prompt with a lead line naming it. Use `<AgentPrompt title="...">` if the component's `title` prop renders a heading that the `/llms.mdx` rendition also carries (`src/lib/llm-markdown.ts` emits a "Use with your agent" heading for titled prompts and only the content for untitled ones); otherwise use plain lead sentences. Check the rendition at `/docs/getting-started` and its `.md` twin.

### The guide rules (`guides/making-guides.mdx`)

"Guide structure" and the template change to match: the required sections become Introduction, Prerequisites, numbered steps, Common gotchas, Use with your agent (the prompt block, the skills pointer, and the follow-up prompts, in that order), Next steps. The `## Prompt your coding agent` section disappears from the list and the template.

### Links

`#use-with-your-agent` anchors keep working because the heading text does not change. Search the content tree for links to `#prompt-your-coding-agent` and repoint any hit to `#use-with-your-agent`. `lint:links` must pass.

## Coherence rationale

The complaint is about the first screen of a page. Moving one section on fourteen pages and updating the rule that produces new guides is one change; leaving the rule unchanged would recreate the problem with the next guide.

## Scope

**In:** the fourteen pages above, `guides/making-guides.mdx`, and any anchor repointing.

**Out:** prompt wording; the other guides that follow the same pattern (`guides/database/*`, `guides/deployment/*`, `guides/integrations/*`, `guides/switch-to-prisma-orm/*`, `composer/porting-an-app.mdx`, `(index)/full-stack-tutorial.mdx`), which get the same move in a follow-up once this pattern is confirmed; the agent prompts inside "Other setups" on the docs root page, which already sit below the human content.

## Pre-investigated edge cases

| Edge case | Disposition | Notes |
| --- | --- | --- |
| A guide has both "Use with your agent" and "Prompt your coding agent" | Merge into one section at the end | Six of the twelve guides; the order inside the merged section is prompt, skills pointer, follow-up prompts |
| `/getting-started` has two prompts in two sections | One closing section with both prompts, each named | The `AgentPrompt` component takes a `title` prop; confirm what the `.md` rendition emits before relying on it |
| Playwright tests read the page structure | Run `apps/docs` Playwright tests for the guides if any select by heading | `tests/` and `test/` under `apps/docs` |

## Slice-specific done conditions

- [ ] On each of the fourteen pages, the first agent prompt appears after the last numbered step and after Common gotchas where the page has it; `git diff --word-diff` on each guide shows moved lines only, no reworded prompt.
- [ ] `guides/making-guides.mdx` describes the new order and its template matches.
- [ ] The docs reader review scripts pass on the fourteen pages and `making-guides.mdx`; one cold reader round on `/getting-started` (the only page with new prose) and on one guide (Hono, which has the merged section), because the other pages gain no new sentences.
- [ ] `lint:links`, `lint:versions`, and `test` pass in `apps/docs`, and `/docs/getting-started`, `/docs/prisma-orm`, and `/docs/guides/frameworks/hono` render in the running docs app with the prompt at the end.

## Open questions

None.

## References

- Design: [`../../ia.md`](../../ia.md) ("human content first, agent prompt last")
- `changes.md` A3
