---
name: content-write-answer-page
description: Use when the operator wants a page that answers one specific developer question, such as a comparison ("Prisma vs X", "X vs Y"), an alternatives page ("X alternatives"), a roundup ("best X for Y"), a use-case guide ("Postgres for X", "where to host X"), or a troubleshooting fix; when they give a question from the content tracker or its tracker reference; or when they want to publish such a page so readers, search engines and agents can find it.
metadata:
  version: "2026.10.22"
---

# Write and publish a comparison, guide or troubleshooting page

This skill writes pages that answer one developer question with sourced, neutral comparisons and stated limits: "What are good Neon alternatives?", "Which Postgres works best for a small team?", "My Vercel functions get `Connection terminated unexpectedly` from Postgres. How do I fix it?". The approach is many focused pages, one per real question, each checked against the question it answers.

This skill covers the whole path: claim the question, learn how people phrase it, check what already exists, write, review, make the page discoverable, then record and measure. The publishing steps at the end are why this skill exists. They are the steps people forget, and a page that readers and crawlers never find does nothing.

Related skills in this repo:

- `content-seo-geo`: the page-quality and search rules. Step 5 runs it with the question as the primary query.
- `content-write-blog`: the writing-quality bar, the link rules, and the adversarial review used in Step 6.
- `docs-reader-review`: the prose checkers.

## Principles

The steps below apply these rules.

- **Use the reader's words.** People find a page through the words they search with. A page titled in those words is the one they find, so Step 2 collects them before anything is written.
- **Lead with the decision rule.** Readers skim the opening and quote it out of context. Keep every limit, but put it where the reader decides, not in the opening paragraph.
- **Self-promotion backfires.** "Our pick" labels, ties, and lists that rank their author first read as marketing and lose the reader's trust. Neutral rows ordered by a stated key read as a source a reader can trust.
- **A missing feature is a fact.** When the question hinges on something Prisma doesn't have, wording won't change the answer. Say so plainly. A fair page is still useful, and it still names Prisma for the cases where it fits.
- **Anything public gets read.** Old copies of a page, stale titles, and even pull request descriptions get read next to the page. Refresh the existing page instead of adding a near-copy, and keep pull request text public-safe.
- **Search indexes pick up changes at different speeds.** IndexNow tells Bing about a change as soon as it ships, and Bing often recrawls within a day or two. Google needs an indexing request, and its crawl can take a few days to a few weeks. Other indexes can lag by two weeks or more. None of these requests guarantees indexing or a timeline.

## Step 1: Claim the question

Every page answers one question from the team's **content tracker**, a Notion database under Developer Relations (ask in #developer-relations for the link), one row per question, with Owner and Status columns.

1. Find the row from the tracker reference or the question the operator gave. With a Notion MCP connected, search Notion for the content tracker and query the row. Without one, ask the operator to open the tracker and confirm the row.
2. If the Status shows the question already has a page, stop.
3. If Owner names someone other than the operator, stop and tell the operator, whatever the Status. Continue only after that person hands the row over, and then set Owner to the operator.
4. Set Status to "Writing", and set Owner to the operator if it was "Open". Do this before drafting, so two people don't write the same page.

If the operator has no tracker row, ask for the exact question the page should answer. Don't invent one.

## Step 2: Learn how people phrase the question

Look up the question and collect:

1. **The search queries** people use for it, from the team's query data (Google Search Console, Bing Webmaster Tools, or the team's query-research tool). Search Console and Bing Webmaster Tools only report queries that already show prisma.io, so also take wording from search suggestions and from the titles of the results in item 2. The most frequent wording becomes the page's title and H1.
2. **The pages that come up** when you search those queries in two or three search engines and the products they name first. These are the pages yours competes with. Read the top two or three.
3. **The criteria those pages use** to decide (price, a feature, a region, "minimal changes"). Each criterion becomes a row or a section on your page.

Always run those searches for items 2 and 3: Search Console and Bing Webmaster Tools don't show other sites' pages or the criteria they use. Write the findings into the tracker row's Notes. They feed `content-seo-geo` Step 1 as the target queries.

## Step 3: Check what already exists

Two Prisma pages that answer the same question compete with each other.

1. Search the repo for pages that already answer the question: `apps/blog/content/blog/`, `apps/site/src/app/` (product pages, `/postgres/*`, `/compute/*`, `/compare/*`) and `apps/docs/content/docs/`. Search by the competitor, framework or error message and by the problem words, not only by title.
2. If an existing page answers most of the question, refresh that page instead of writing a new one. Keep its slug, follow the refresh rules in `content-seo-geo` (`updatedAt` plus an "Updated" callout), and put its URL in the tracker's "Existing page" column.
3. If two tracker rows ask the same question, one page can serve both. Put the same URL on both rows and say so in Notes.

## Step 4: Pick the page type and its URL

The question's shape decides the page type. New pages don't go under `/blog` unless the operator explicitly approves it (see "Where the files go").

| Question shape | Page type | URL |
|---|---|---|
| "Prisma Postgres vs Neon", "Neon vs Supabase" | Head-to-head comparison | `/compare/<competitor>` (for example `/compare/neon`), or `/compare/<a>-vs-<b>` when Prisma isn't one side |
| "Neon alternatives", "moving off Heroku Postgres" | Alternatives | `/compare/<competitor>-alternatives` |
| "best PostgreSQL hosting for developers" | Roundup | `/compare/<category>`, for example `/compare/postgres-hosting` |
| "Postgres for small teams", "where to host a Hono API" | Use-case guide | `/postgres/<topic>` or `/compute/<topic>` |
| "my app says too many connections" | Troubleshooting | `/postgres/<topic>`, `/compute/<topic>`, or `/orm/<topic>` |

Every page under `/compare` today is a Prisma product beside one competitor, and its registry (`apps/site/src/app/compare/comparisons.ts`) has one competitor per entry. Before writing a head-to-head where Prisma isn't one side, an alternatives page or a roundup, ask the content lead to confirm the slug and how the registry should hold it.

A question about the whole platform goes under the product that answers most of it. Slugs are lowercase and hyphenated, and they use the noun people search for (`neon-alternatives`, `postgres-for-small-teams`), with no year and no "best". A slug never changes after the page is published, because its links and search history point to it.

**One page per rival.** Alternatives and head-to-head pages work as a series: one page for each competitor that people search for, all built from the same template, so every competitor name has a page of its own.

**Template.** Conversion Factory designed two templates: a comparison page (for head-to-heads, alternatives and roundups) and an article page (for use-case guides and troubleshooting). The links are in #developer-relations. Use their layout and section order, which "Page outlines" below follows, and apply this skill's writing rules on top. Never copy their sample copy: it uses labels and claims this skill rules out, such as a "Recommended" column and database branching. The article template's header has an empty block above the title; leave it out.

**Where the files go.** Before writing, find how the target section is built: look for the route under `apps/site/src/app/` (for example `compare/`) and read how its newest page is authored (a TSX page with `_content.ts`, like `postgres/hipaa/`, or an MDX collection). Copy that pattern. A comparison page is a folder `apps/site/src/app/compare/<slug>/` with `page.tsx`, `_content.ts`, `_sections.tsx` and `facts.ts`, plus `apps/site/src/app/compare/<slug>.json/route.ts`, registered the way the "Comparison pages" section of `apps/site/CLAUDE.md` describes (`compare/comparisons.ts`, `lib/markdown/comparisons.tsx` and `next.config.mjs`). CLAUDE.md does not list every place: also add the slug to `AI_MARKDOWN` and `TOC` in `compare/article.tsx` (a missing `AI_MARKDOWN` entry still compiles, and the page just loses its `.md` link), give it its own prompt in `choosePrompt` in `compare/page-ai-actions.tsx` (otherwise it falls back to the Kysely prompt), add it to the `application/json` slug list in `lib/comparison-metadata.ts`, and add it to `PAGE_SOURCES` and `MIN_LITERAL_HEADINGS` in `lib/markdown/markdown-parity.test.ts` and to `lib/markdown/comparisons.test.tsx`. If the page belongs in the hand-picked "Compare Prisma" list, add it to `components/sections/compare-links-data.ts`. To catch anything new, run `git grep -n planetscale apps/site/src` and mirror every hit that belongs to the comparison. If the section doesn't exist yet, stop and tell the operator that it has to be built first, and ask the content lead who owns the URL structure. Use `/blog` only if the operator explicitly approves it.

## Step 5: Write the page

Follow `content-seo-geo` Steps 1 to 6, with the question as the primary query and the Step 2 search queries as the related queries. On top of that:

**Title and opening**

- The title restates the question in the words of its most frequent search query. The H1 and `metaTitle` use the same words: some search results show the HTML `<title>` as the link text and others show the H1.
- The first paragraph answers the question with a decision rule: which option fits which situation, and when to pick Prisma.
- Roundups and alternatives pages put the year and the number of options in the title ("Neon alternatives in 2026: 7 options compared"), and the year is updated with each refresh. "Best" stays out of the title, because the page compares options and doesn't crown one.
- Comparison pages disclose on the first screen that Prisma makes one of the products compared.

**Body**

- **Organize the body as a decision**: the criteria from Step 2, the options, a table wherever things are compared, and "choose X if..." lines.
- **Neutral rows.** Prisma appears in rows next to its competitors, ordered by a stated key (price, alphabetical, the criterion that matters most for the question). No "our pick" labels, no ties, and no ranking that puts Prisma first because Prisma wrote the page.
- **Limits go in Prisma's row and in a "When Prisma is the wrong choice" section**, never in the opening paragraph. State a missing feature as an absence ("No point-in-time recovery yet"). Don't write around it, and don't imply it is planned. The exception is a date the product owner has confirmed for publishing: give the month, as in "No point-in-time recovery yet (it is coming in November 2026)".
- **Every competitor claim has a source and a date**: the vendor's own pricing or docs page, checked during this pass. Say so near the top ("Every claim on this page links to its source, checked [Month YYYY]"), with the month and year of this pass filled in before publishing. Don't repeat cost multiples or other comparative claims from marketing copy.
- **Every Prisma claim matches the current pricing page, docs and the DevRel fact sheet** (Notion: "Listing edits: fact sheet and lint", under Developer Relations). When they disagree, the docs win and the fact sheet gets fixed.
- **FAQ** in the site's accordion format, three or four questions taken from the Step 2 queries the body doesn't already answer.
- Writing quality meets the bar in `content-write-blog` ("Writing quality"). Run `.claude/skills/docs-reader-review/scripts/check-ai-signs.sh <file>` on the page text and fix what it flags.

**Product names and claims**

- Name products in full: Prisma Postgres, Prisma Compute, Prisma ORM. Never bare "Prisma" for a hosted product, and never "Prisma Cloud" (another company's product) or "Prisma Data Platform".
- Next to each product mention that a reader could misread as ORM-only, add that Prisma ORM is optional ("works with any Postgres client").
- Never write these, even when a competitor page says them about Prisma: "zero cold starts" or "no cold starts", "one plan" or "one bill" for app and database (say "in one project"), database branching, query caching or "Accelerate built in", "requires Prisma ORM", a beta or preview label for Prisma Compute, any status label for Prisma Composer, "the only", "the first", "the best".
- First mentions link to docs, per the `content-write-blog` link rules.

## Step 6: Review before the pull request

1. If DevRel's never-claim lint is available to you, run it on the page text (ask in #developer-relations).
2. Run `content-write-blog` Step 10 (adversarial review) with at least the fact refuter and the reader skeptic. Add the positioning refuter for comparisons, alternatives and roundups, and the code refuter when the page has runnable code. Give the fact refuter the product-claims list from Step 5.
3. Fix the findings and re-review until a round returns zero confirmed findings.

## Step 7: Make the page discoverable

Do all of this in the same pull request as the page.

1. **Sitemap.** The site sitemap (`apps/site/src/lib/sitemap.ts`) picks up static `page.tsx` routes automatically, but it **skips dynamic segments** such as `[slug]`. If the section renders its pages from a content collection through a dynamic route, add those pages to `getSiteSitemapEntries`, the way changelog and extensions entries are added. Then serve the site and confirm `/sitemap-site.xml` lists the URL. Blog and docs pages are in their own sitemaps automatically.
2. **Links within the series.** A roundup links to each head-to-head and alternatives page it covers. Each head-to-head links back to the roundup and to the alternatives page for that competitor. Use the question or the topic as anchor text.
3. **Links from the rest of the site.** Link to the new page from at least two related pages: the product or docs page it extends, and a related blog post. A page that nothing links to is crawled late or not at all.
4. **Section index and footer.** Add the page to its section's index page (for example `/compare`, which lists the entries in `apps/site/src/app/compare/comparisons.ts`). The index page must be linked from the site footer (`siteConfig.footer` in `apps/site/src/lib/config.ts`, rendered by `apps/site/src/components/footer.tsx`). If it isn't yet, add that footer link once. (`/compare` is already in `footer.resources`. `packages/ui/src/data/footer.ts` is the blog's footer, not the site's.)
5. **llms.txt and Markdown.** These give agents and other tools a plain-text copy of the page, and they cost little. Blog posts appear in `/blog/llms.txt` automatically. Site pages don't: `/llms.txt` is built in `apps/site/src/app/llms-content.ts` from `markdownPageList` plus `additionalPages`, so add the page there or add its section index once the section has one. For the `.md` rendition, check whether the section supports one (`apps/site/src/lib/agent-markdown.ts`) and register the page if it does. Comparison pages under `/compare` are the exception: once registered as in "Where the files go", the shared Markdown pipeline supplies their `.md`, `/llms.txt` and `/llms-full.txt` entries, so don't add them by hand.
6. **IndexNow runs by itself.** `.github/workflows/indexnow.yml` submits changed sitemap URLs to IndexNow after every production deploy of the site, docs and blog apps. There is nothing to submit by hand, but it only sees URLs that item 1 put in the sitemap.
7. **Check the served page.** Serve it and run `content-seo-geo` Step 7 against the rendered HTML, not the source file. Confirm the `<title>` and the H1 match.
8. **Keep the pull request public-safe.** prisma/web is public, and its pull request descriptions get read next to the page. Describe what the page is, what changed and the sources checked. Leave out internal tracking data, competitor strategy and internal names.

## Step 8: Record and measure

Once the page is live on www.prisma.io:

1. **Tracker.** Set Status to "Published" and fill in Article URL and the Published date. Put the same URL on every row the page serves.
2. **Monitoring.** With the team's page-monitoring tool connected, add the URL to it. Without it, send the URL to the tool's owner in #developer-relations.
3. **Indexing.** After the deploy, confirm the IndexNow run succeeded (`gh run list -R prisma/web --workflow indexnow.yml --limit 3`). Ask whoever has access to Google Search Console and Bing Webmaster Tools to request indexing for the URL and check where it appears for the Step 2 queries.
4. **Crawl check after about three days.** Look the URL up in the team's crawler logs to see whether crawlers fetched it, and note the result in the row's Notes. If nothing has crawled it after a week, recheck Step 7: the sitemap entry and the inbound links are the usual causes.
5. **Read the results themselves.** Search the Step 2 queries and read what comes back: whether the page is there, and whether what it says about Prisma Postgres or Prisma Compute reads correctly out of context. Compare them per search engine, before and after, and expect Bing to move first and other indexes weeks later.

## Page outlines

The comparison outlines follow Conversion Factory's comparison template, and the use-case and troubleshooting outlines follow its article template, with the additions this skill requires (disclosure, sources and dates, a "wrong choice" section, migration, FAQ). Each page ends with an FAQ in the site's accordion format (`content-seo-geo` Step 3). The numbers give the order of the sections.

### Head-to-head (`/compare/<x>`)

1. Hero: H1 in the form "<Prisma product> vs <X>: <the decision in a few words>", a decision paragraph that says who should pick which, the disclosure that Prisma makes one of the two, and the call to action
2. "Choose <Prisma product> if..." and "Choose <X> if...", side by side
3. A feature table with the columns Feature, <X>, <Prisma product>, built from the Step 2 criteria (pricing model, free plan, limits, regions, app and database hosting, agent and MCP support, migration path), with no "Recommended" label and a source and date behind each competitor cell
4. "Where <X> works well" and "Where <Prisma product> fits better", both with real points
5. What sets <Prisma product> apart: three or four short sections, each one claim that matches the docs
6. Pricing for both, each figure with its source and date
7. When <Prisma product> is the wrong choice
8. How to migrate in either direction
9. Proof: customer quotes only from those currently on prisma.io, and none if there isn't a relevant one
10. FAQ, then the closing call to action

### Alternatives (`/compare/<x>-alternatives`)

1. Hero: H1 in the form "<X> alternatives in <year>: <n> options compared", a decision paragraph naming the reasons people look beyond X and which option fits each reason, and the disclosure
2. What X does well, so the reader knows what they would give up
3. One section per alternative with "Best for", strengths, trade-offs and price, Prisma included in the stated order
4. A comparison table of the alternatives, sourced and dated
5. How to move off X
6. FAQ, then the closing call to action

### Roundup (`/compare/<category>`)

1. Hero: H1 in the form "<Category> in <year>: <n> options compared", a decision paragraph with the short list and the situation each option fits, and the disclosure
2. The criteria, as a checklist, before any option
3. One section per option with "Best for", features, pricing and trade-offs, ordered by a stated key, each linking to its head-to-head page where one exists
4. A comparison table, sourced and dated
5. "Which one fits you": decision questions that send each reader to an option
6. FAQ, then the closing call to action

### Use-case guide (`/postgres/<topic>`, `/compute/<topic>`)

1. H1 that restates the question, a one-sentence dek that answers it, the byline, date and reading time
2. A decision paragraph
3. What this use case needs from a database or host
4. The options, compared briefly
5. How to set it up with Prisma, as numbered steps with runnable commands and their real output
6. When Prisma is the wrong choice for this use case
7. FAQ, a short recap, the call to action and related pages

### Troubleshooting

1. H1 that states the symptom in the reader's words, with the error message verbatim when there is one, a one-sentence dek with the cause and the fix, the byline and date
2. Why it happens
3. The fix, as numbered steps with runnable commands
4. How to prevent it, and the cases where the fix doesn't apply
5. FAQ, the call to action and related pages

## Anti-patterns

- **Writing without claiming.** Two people writing the same page wastes a day and splits readers and links between two URLs.
- **Writing before reading the queries.** A page titled in our words instead of the reader's words doesn't get found.
- **A second page for a covered question.** Refresh the existing page instead (Step 3).
- **Opening with concessions.** The opening is for the decision rule, and readers quote it out of context. Limits belong in Prisma's row and the "wrong choice" section.
- **Self-ranking.** "Our pick", ties, "best" in the title, or Prisma placed first by default.
- **Writing around a missing feature.** State it as an absence.
- **Competitor facts with no source and date.**
- **Publishing under `/blog` because the section isn't built yet**, without the operator's explicit approval.
- **Dynamic-route pages missing from the sitemap.** They never reach IndexNow, and crawlers find them late.
- **Internal analysis in the pull request description.**
- **Changing a published slug.**
- **Near-duplicate pages with swapped keywords.** Each page answers a different question, or it doesn't ship.
