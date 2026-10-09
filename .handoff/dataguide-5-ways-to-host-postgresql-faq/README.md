# Data Guide — 5 ways to host PostgreSQL — FAQ copy edits and FAQPage JSON-LD

This folder is a short-lived handoff. It ships the VP-approved copy
changes and the reusable FAQPage structured-data plumbing for
`https://www.prisma.io/dataguide/postgresql/5-ways-to-host-postgresql`,
packaged as applyable git patches, because the page's source MDX does
not live in `prisma/web`.

## Why this is in `prisma/web`

The task description says to update the page "in `prisma/web`", but the
Data Guide is a separate Gatsby app in
[`prisma/dataguide`](https://github.com/prisma/dataguide) and
`prisma/web` only rewrites `/dataguide/:any*` to `dataguide.vercel.app`
(see `apps/site/next.config.mjs`). The source MDX for this page is
`content/04-postgresql/03-5-ways-to-host-postgresql.mdx` in
`prisma/dataguide`.

The current Cloud Agent runs against `prisma/web` and does not have
write access to `prisma/dataguide` (verified: `git push` returns
`Permission to prisma/dataguide.git denied to cursor[bot]`), so the
PR for this work has to be opened by a human against the correct
repo. All three commits are already prepared and tested; a reviewer
only needs to apply them and open a `prisma/dataguide` PR.

## What's in the patches

Three git-format patches. Apply them in order on top of
`prisma/dataguide` `main`:

```bash
git clone git@github.com:prisma/dataguide.git
cd dataguide
git checkout -b dataguide/5-ways-to-host-postgresql-faq-updates
git am < .../0001-Refresh-5-ways-to-host-postgresql-FAQ-copy-and-retir.patch
git am < .../0002-Add-reusable-FAQPage-structured-data-for-Data-Guide-.patch
git am < .../0003-Enable-FAQPage-JSON-LD-on-5-ways-to-host-postgresql.patch
git push -u origin dataguide/5-ways-to-host-postgresql-faq-updates
```

Then open a PR in `prisma/dataguide` (ready for review, do not merge).

### 0001 — Content copy edits (approved by the VP, applied word for word)

Touches only `content/04-postgresql/03-5-ways-to-host-postgresql.mdx`:

1. The "Is there a free way to host PostgreSQL?" answer becomes:

   > Yes. For development, a local install or Docker container is free
   > aside from your own machine's resources. For a hosted database,
   > several managed providers offer a free tier. Prisma Postgres gives
   > you a [free Postgres database](https://www.prisma.io/postgres) in
   > seconds with `npx create-db`, no credit card needed, and you move
   > to a paid plan when you outgrow it.

   The old console "start on" link is gone. "free Postgres database"
   links to the absolute `https://www.prisma.io/postgres`, and
   `npx create-db` renders as inline code.

2. The "How are backups handled?" answer becomes:

   > With self-managed PostgreSQL, backups are your responsibility to
   > schedule, store, and test. Most managed services automate backups
   > on paid plans. With Prisma Postgres, backups come with paid plans;
   > the Free plan doesn't include them. Confirm retention and restore
   > options match your needs.

3. The "When to choose Prisma Postgres" backups bullet becomes
   (keeping the bold lead-in style):

   > **You want backups handled for you on paid plans,** rather than
   > scripting and testing your own.

4. The third-party providers list drops Compose and ElephantSQL (both
   shut down), and the sentence _"An example of third party PostgreSQL
   providers is ElephantSQL, which currently can manage instances in
   four different clouds."_ is removed from the preceding paragraph.

### 0002 — Reusable FAQPage structured data for Data Guide articles

Adds opt-in FAQPage schema.org JSON-LD, generated at build time from
the page's own FAQ section. Opt-in is via `faq: true` in frontmatter.

- `src/utils/extractFaq.ts` — tolerant Markdown parser that handles
  both the H3-pair FAQ shape used on this page and the
  `<details>/<summary>` shape used on ~22 other Data Guide pages, with
  a `toPlainText` helper that strips Markdown links and inline code so
  answers match the visible page copy word for word (what Google's
  FAQPage schema wants).
- `src/utils/structuredData.ts` — new `faqStructuredDataNode` helper,
  and an optional `faqs` argument on `articleStructuredData` that
  appends the FAQPage node to the article `@graph` only when entries
  are present.
- `gatsby-node.ts` — reads the raw MDX for pages with `faq: true`,
  extracts the Q/A pairs, and passes them through page context. Panics
  on build if a page opts in but has no FAQ section, so the flag can't
  silently rot.
- `src/components/seo.tsx`, `src/templates/docs.tsx`,
  `src/interfaces/Layout.interface.ts` — thread `faqs` from page
  context into the existing `<script type="application/ld+json">`
  tag's `@graph`, next to the article and breadcrumb nodes.
- `src/utils/extractFaq.test.ts`, `src/utils/structuredData.test.ts` —
  cover the plain-text transform, both FAQ shapes, the empty-page
  fallback, the article-graph append, and the real 5-ways-to-host MDX.
- `scripts/check-faq-jsonld.mjs` — utility to print the FAQPage
  JSON-LD this page will emit, for eyeball review against the visible
  page text.

### 0003 — Enable FAQPage JSON-LD on 5-ways-to-host-postgresql

Flips `faq: true` in the frontmatter of
`content/04-postgresql/03-5-ways-to-host-postgresql.mdx`. Only this
page opts in in this change.

## Expected JSON-LD on the live page

Saved as `faq-jsonld-expected.json` in this folder — the exact object
the SEO component will emit inside the article `@graph` once 0003
ships. Every `acceptedAnswer.text` matches the visible page text with
Markdown link markup and inline code stripped to their words. The
object validates against Google's FAQPage schema (seven `Question`
entries, each with an `acceptedAnswer` of type `Answer`).

## Verification

Run the Data Guide's own test suite after applying the patches:

```bash
cd dataguide
npm install
npm run test        # node --test; 12 tests pass, including coverage of
                    # the real 5-ways-to-host MDX
npm run typecheck
npm run prettify
```

The author also ran `node ... scripts/check-faq-jsonld.mjs` end to end
to confirm the JSON-LD matches the visible answers word for word.

## Rolling the FAQPage JSON-LD out to the rest of the Data Guide

A grep across `content/` found 23 articles with a visible FAQ section:

- 1 page uses `## Frequently asked questions` with `### Question?`
  bodies (this page).
- 22 pages use `## FAQ` with `<details><summary>Question</summary>
  Answer</details>` bodies, spanning the intro, data modeling, types,
  PostgreSQL, MySQL, SQLite, MS SQL Server, MongoDB, and serverless
  sections.

The parser in `src/utils/extractFaq.ts` already handles both shapes, so
rollout is a one-line change per file: add `faq: true` to the
frontmatter. The `gatsby-node.ts` build will panic if a page opts in
but its FAQ section is malformed, so bad opt-ins can't ship silently.

A reasonable rollout order is:

1. Merge this PR (one page, so it's easy to review the resulting JSON-LD
   with the Rich Results Test or
   [schema.org validator](https://validator.schema.org/)).
2. Flip the flag on the remaining 22 articles in a follow-up PR, after
   skimming each FAQ section for anything the parser's plain-text
   transform might mangle (mostly: nested components or unusual link
   shapes — the current parser copes with everything in the Data Guide
   today).
3. Optionally, promote the opt-in to on-by-default and have the build
   warn (not panic) for pages without a FAQ, letting authors remove
   the flag over time.
