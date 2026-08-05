# Prisma 8 docs conventions

Follow these when writing or reviewing a Prisma 8 docs section in `apps/docs` (the Fundamentals, Middleware, Extensions, Reference, and Guides trees). They encode decisions from DR-8681/DR-8687/DR-8688 and PR #8011 review rounds so parallel section PRs stay consistent.

## Where pages live

- Concept and task docs go in the ORM "Next" version tree: `content/docs/orm/v8/<section>/` served at `/docs/orm/v8/<section>/<slug>`. The version dropdown keys off the `/orm/v8/*` path.
- Getting-started funnel pages stay under `content/docs/(index)/next/`.
- Frontmatter `url` must mirror the file path. Register the section in `content/docs/orm/v8/meta.json`.

## Redirects: commented out until the cutover

Do not add live Prisma 7 → Prisma 8 redirects yet. They retire live URLs, and they ship together when the `/orm/v8` tree becomes `/orm` (DR-8687).

Instead, append your section's redirect map to the commented block in `apps/docs/v8.config.mjs` (search for "Prisma 8 URL cutover"). Keep the entries commented, one per line, `permanent: false`, with your DR reference. Pages with no Prisma 8 equivalent stay live on the Prisma 7 tree; list them in the same comment block for the SEO owner.

## Accuracy: test before you write

Every code sample must be executed against the published `@prisma/orm-*` packages before it lands, or clearly marked as conceptual. Scaffold throwaway apps with `create-prisma@next` non-interactive flags; use `bunx create-db` for PostgreSQL and `mongodb-memory-server` (replica set) for MongoDB. Key tested facts that older internal docs get wrong:

- PostgreSQL model access is namespace-qualified: `db.orm.public.User`, `db.sql.public.user`. MongoDB uses flat lowercase plural roots (`db.orm.users`) and documents keep `_id`.
- `.update()` / `.delete()` affect one record; `updateAll` / `deleteAll` / `*Count` are the bulk forms. No `.count()` terminal; use `.aggregate(...)`.
- No `data` wrapper on `.create(...)`. SQL-builder inserts take an array of rows.
- MongoDB: no `db.transaction(...)`, no ORM `.aggregate(...)`, `@default(now())` not applied at create time.
- Raw SQL exists only as `fns.raw` fragments inside the SQL query builder, not as standalone statements.

## Page shape

- Task-first sections: what the user does, which API, simplest example, what it returns, caveats last. Result shapes go in ` ```js no-copy ` blocks after the query.
- Database variants use adjacent code fences with `tab="PostgreSQL"` / `tab="MongoDB"` (PostgreSQL first). Never use the `<Tabs items=...>` JSX in mdx pages; it renders broken.
- Open with a section-linked intro; add an expandable `<details>` example schema when the page's examples depend on one.
- Prisma 7 migration notes are ` ```diff ` blocks, framed as help, never required context.
- Diagrams: add a `FlowScene` to `apps/docs/src/components/concept-animation/flow-presets.ts` and render with `<ConceptAnimation name="..." />`. Design as Mermaid first in the PR description.
- End each page with a "Prompt your coding agent" section: copyable prompts per section referencing the scaffolded skills (`prisma-next-queries`, `prisma-next-contract`, ...), then "Next" links.

## Naming and claims

- The product is "Prisma 8", not "Prisma 8 ORM". The high-level query lane is "the ORM API"; the low-level lanes are "the SQL query builder" and "the pipeline builder".
- No em dashes. Be honest about Release Candidate status; state limitations in user-facing language ("X is not supported yet. For now, do Y") and show the tested workaround.
- Validate with `pnpm --filter docs types:check`, `pnpm lint:links`, `pnpm exec cspell --no-progress "content/docs/orm/v8/**/*.mdx"` (use placeholder ids in result blocks; random cuid fragments fail cspell), and a dev-server smoke test.
