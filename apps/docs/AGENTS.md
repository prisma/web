# AGENTS.md — Prisma docs app

## Documentation taxonomy

Classify every docs page as one of three kinds before writing or moving content:

1. **Reference**: interface contracts. CLI commands, flags, REST API endpoints, parameters, config file fields, environment variables, API signatures.
2. **Concepts**: platform fundamentals. Projects, workspaces, branching, environment variables as a topic, how things work.
3. **Guides**: getting-started and structured step-by-step material.

## Placement rules

1. Reference material lives under `content/docs/cli/`, `content/docs/rest-api/`, or a section's `---Reference---` meta.json block. Never document flags, parameters, or endpoints in full inside a concept or guide page; link to the reference page instead.
2. A product section may keep a thin `cli-reference.mdx` pointer page that links into `cli/*`. `content/docs/compute/cli-reference.mdx` is the canonical example. Full command references live in `cli/`; the Prisma 7 CLI is under `cli/v7/`.
3. The section is named "REST API" (folder `rest-api`). Do not reintroduce "Management API" in titles, nav, prose, or new URLs. Code identifiers (`@prisma/management-api-sdk`, `createManagementApiClient`) keep their names.
4. Sidebar grouping (Build/Deploy/Manage/Reference) is UI config in `src/lib/sidebar-sections.ts`, not content structure. Do not add grouping separators to the root `content/docs/meta.json`.

## Moving or renaming pages

1. Add a redirect in the live region of `next.config.mjs` `redirects()` (near the `/llms/next.txt` entry). Run `pnpm audit:redirects:strict` after.
2. Re-run `npx tsx scripts/add-url-frontmatter.ts` after any file move; the required `url:` frontmatter goes stale silently and no linter catches it.
3. New top-level sections need an entry in `llmsSections` in `src/lib/llms.ts` (see `.claude/skills/docs-agent-ready`).
4. Do not rename the `orm/`, `cli/`, or `guides/` folders or their meta.json titles, and keep the `orm/v7`, `cli/v7`, `guides/v7`, and `(index)/v7` meta.json titles exactly `"v7"`: `src/lib/version.ts` path maps and `src/lib/versioned-sidebar-tree.ts` match on those strings and break the version switcher silently.

## A defect in a Prisma tool is never worked around in the docs

Will Madden, 2026-11-22: "There should be NO workarounds in the docs for our own tools, EVER", and "if an agent is given the task to write docs, it's NOT acceptable for it to work around issues in our tools. that makes it look like we don't know what we're doing".

What happened: agents writing and checking the Prisma ORM 8 docs ran every example. When a Prisma tool misbehaved, they wrote a sentence that steered the reader around it, such as "do not run the command this error suggests, run this one", "pass `--advance-ref db`, because `npm run migrate` does not update the ref", or "install the matching `@types/pg` version". The defect went into a plan nobody acted on. After two months the docs held dozens of these passages and the tools were still broken.

Why it matters: Prisma owns these tools: the `prisma` CLI, the `@prisma/orm-*` packages and extensions, `create-prisma` and its templates, Prisma Composer, Prisma Compute, Prisma Postgres, the skills, the editor extension. A page that explains how to step around our own bug tells every reader that we know the product is broken and chose to write about it. It also removes the reason to fix the bug, and the workaround stays on the page long after the cause is forgotten. The docs describe the product working as designed. A difference between that and what the tool does is a bug in the tool.

What follows when a tool does the wrong thing while you write or test a page:

1. Do not put the workaround, or a warning about the defect, on the page.
2. Reproduce the defect and get it fixed where it lives: fix it in the tool's repository yourself when you can, otherwise file an issue there with the reproduction. Tell the person you work for that you found a tool defect and what you did about it; do not report it as a docs decision.
3. Write the page for the fixed behaviour, and hold the affected passage or the whole pull request until a release contains the fix. If the page cannot wait, leave the affected path out and say so in the pull request description.

This does not cover three things, which the docs do explain: a limit of software Prisma does not own (PostgreSQL, a MySQL server setting, Node.js, Vercel), behaviour that is designed and intended, and a feature that does not exist yet ("X is not supported yet"). If you cannot tell a defect from intended behaviour, read the tool's source and design docs, then ask.

## Generated content

1. `content/docs/rest-api/endpoints/` and `public/prisma-rest-api.postman_collection.json` are generated. Never hand-edit; run `pnpm generate:rest-api-docs`.
2. The generator prepends redirects to `vercel.json` for endpoints that disappear from the OpenAPI spec; review them after each run.

## Validation

Run from `apps/docs`:

1. `pnpm lint:links` — internal links, anchors, `Card` hrefs. It does not check redirect destinations, `version.ts` path maps, `llms.ts` prefixes, or `url:` frontmatter.
2. `pnpm audit:redirects:strict` after adding redirects.
3. `pnpm lint:agent-ready` after touching sections, llms surfaces, or the OpenAPI explorer.
4. `pnpm types:check` and `pnpm build` for code changes.
5. `pnpm lint:versions` after pinning a Prisma package version. Every pin in the current docs must be the package's `latest` on npm, except `@prisma/cli-engine`, which must be the version that `prisma@latest` depends on; write "since `8.0.0-rc.10`" or use an "Added in" column for history.
