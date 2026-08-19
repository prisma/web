# AGENTS.md — Prisma docs app

## Documentation taxonomy

Classify every docs page as one of three kinds before writing or moving content:

1. **Reference**: interface contracts. CLI commands, flags, REST API endpoints, parameters, config file fields, environment variables, API signatures.
2. **Concepts**: platform fundamentals. Projects, workspaces, branching, environment variables as a topic, how things work.
3. **Guides**: getting-started and structured step-by-step material.

## Placement rules

1. Reference material lives under `content/docs/cli/`, `content/docs/rest-api/`, or a section's `---Reference---` meta.json block. Never document flags, parameters, or endpoints in full inside a concept or guide page; link to the reference page instead.
2. A product section may keep a thin `cli-reference.mdx` pointer page that links into `cli/v8/*`. `content/docs/compute/cli-reference.mdx` is the canonical example. Full command references live in `cli/v8/`.
3. The section is named "REST API" (folder `rest-api`). Do not reintroduce "Management API" in titles, nav, prose, or new URLs. Code identifiers (`@prisma/management-api-sdk`, `createManagementApiClient`) keep their names.
4. Sidebar grouping (Build/Deploy/Manage/Reference) is UI config in `src/lib/sidebar-sections.ts`, not content structure. Do not add grouping separators to the root `content/docs/meta.json`.

## Moving or renaming pages

1. Add a redirect in the live region of `next.config.mjs` `redirects()` (near the `/llms/next.txt` entry). Do not add entries to the commented "Prisma 8 URL cutover" staging blocks unless working on that cutover. Run `pnpm audit:redirects:strict` after.
2. Re-run `npx tsx scripts/add-url-frontmatter.ts` after any file move; the required `url:` frontmatter goes stale silently and no linter catches it.
3. New top-level sections need an entry in `llmsSections` in `src/lib/llms.ts` (see `.claude/skills/docs-agent-ready`).
4. Do not rename the `orm/`, `cli/`, or `guides/` folders or their meta.json titles, and keep `cli/v8/meta.json` title exactly `"v8 (RC)"`: `src/lib/version.ts` path maps and `src/lib/versioned-sidebar-tree.ts` match on those strings and break the version switcher silently.

## Generated content

1. `content/docs/rest-api/endpoints/` and `public/prisma-rest-api.postman_collection.json` are generated. Never hand-edit; run `pnpm generate:rest-api-docs`.
2. The generator prepends redirects to `vercel.json` for endpoints that disappear from the OpenAPI spec; review them after each run.

## Validation

Run from `apps/docs`:

1. `pnpm lint:links` — internal links, anchors, `Card` hrefs. It does not check redirect destinations, `version.ts` path maps, `llms.ts` prefixes, or `url:` frontmatter.
2. `pnpm audit:redirects:strict` after adding redirects.
3. `pnpm lint:agent-ready` after touching sections, llms surfaces, or the OpenAPI explorer.
4. `pnpm types:check` and `pnpm build` for code changes.
