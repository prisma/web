---
name: content-write-answer-page
description: Use when the operator wants a page that answers one specific question people ask AI assistants, such as a comparison ("Prisma vs X", "X vs Y"), an alternatives page ("X alternatives"), a "best X" roundup, a use-case guide ("Postgres for X", "where to host X"), or a troubleshooting fix; when they give a tracked prompt or a Prompt tracker reference (PW123); or when they want to publish such a page so AI engines can find, crawl and cite it.
metadata:
  version: "2026.10.15"
---

# Write and publish an answer page

An answer page answers one question that people ask AI assistants and search engines: "What are good Neon alternatives?", "Which Postgres works best for a small team?", "My Vercel functions get `Connection terminated unexpectedly` from Postgres. How do I fix it?". The approach is many focused pages, one per real question, each measured against the prompt it targets.

This skill covers the whole path: claim the prompt, check what already exists, write, place the page, make it discoverable, then record and measure. Steps 6 and 7 are why this skill exists. They are the steps people forget, and a page that AI crawlers never find does nothing.

Related skills in this repo:

- `content-seo-geo`: the optimization rules. Step 4 runs it with the tracked prompt as the primary query.
- `content-write-blog`: the writing-quality bar, the link rules, and the Step 10 adversarial review used in Step 5.
- `docs-reader-review`: the prose checkers.

## Step 1: Claim the prompt

Every page targets one tracked prompt. The team tracks prompts in the **Prompt tracker** database in Notion (Developer Relations, Scratchpad, "AI content drive"), one row per PromptWatch prompt, with Owner and Status columns.

1. Find the row from the reference (`PW123`) or the prompt text the operator gave. With a Notion MCP connected, search Notion for "Prompt tracker" and query the row. Without one, ask the operator to open the tracker and confirm the row.
2. If the row belongs to someone else and its Status is not "To do", stop and tell the operator. Don't write a competing page.
3. If the Status is "Has page (WTP)", stop: that prompt already has a page.
4. Otherwise set Status to "Writing", and set Owner to the operator if it was "Open". Do this before drafting, so two people don't write the same page.

If the operator has no tracked prompt, ask for the exact question the page should answer. Don't invent one.

## Step 2: Check what already exists

Two Prisma pages that answer the same question compete with each other. Before writing:

1. Search the repo for pages that already answer the prompt: `apps/blog/content/blog/`, `apps/site/src/app/` (product pages, `/postgres/*`, `/compute/*`, comparisons) and `apps/docs/content/docs/`. Search by the competitor, framework or error message and by the problem words, not only by title.
2. If an existing page answers most of the prompt, refresh that page instead of writing a new one. Keep its slug, follow the refresh rules in `content-seo-geo` (`updatedAt` plus an "Updated" callout), and put its URL in the tracker's "Existing page" column.
3. If two tracker rows ask the same question, one page can serve both. Put the same URL on both rows and say so in Notes.

## Step 3: Pick the page type and its URL

The prompt's shape decides the page type. Nothing new goes under `/blog`.

| Prompt shape | Page type | URL |
|---|---|---|
| "Prisma Postgres vs Neon", "Neon vs Supabase" | Head-to-head comparison | `/comparisons/prisma-vs-<competitor>`, or `/comparisons/<a>-vs-<b>` when Prisma isn't one side |
| "Neon alternatives", "moving off Heroku Postgres" | Alternatives | `/comparisons/<competitor>-alternatives` |
| "best PostgreSQL hosting for developers" | Best-of roundup | `/comparisons/best-<category>` |
| "Postgres for small teams", "where to host a Hono API" | Use-case guide | `/postgres/<topic>` or `/compute/<topic>` |
| "my app says too many connections" | Troubleshooting | `/postgres/<topic>`, `/compute/<topic>`, or `/orm/<topic>` |

A prompt about the whole platform goes under the product that answers most of it. Slugs are lowercase and hyphenated, and they use the noun people search for (`neon-alternatives`, `postgres-for-small-teams`), with no year and no stop words. A slug never changes after the page is published, because its ranking history lives there.

**Template.** Use the Conversion Factory template for the page type when the operator has it. The templates live in Conversion Factory's Notion, so ask the operator to paste the template or point to it. Without one, use the matching outline in "Page outlines" below. Both follow the same rules.

**Where the files go.** Before writing, find how the target section is built: look for the route under `apps/site/src/app/` (for example `comparisons/`) and read how its newest page is authored (a TSX page with `_content.ts`, like `postgres/hipaa/`, or an MDX collection). Copy that pattern. If the section doesn't exist yet, stop and tell the operator that it has to be built first, and ask the content lead who owns the URL structure. Don't fall back to `/blog` without the operator's explicit OK.

## Step 4: Write the page

Follow `content-seo-geo` Steps 1 to 6, with the tracked prompt as the primary query. On top of that:

- **The title restates the prompt** in the reader's words. The first paragraph answers it: name the options or the fix, and say when Prisma is the right pick and when it isn't.
- **Organize the body as a decision**: the options, their trade-offs, a table wherever things are compared, and "pick X if..." lines.
- **State competitors' real strengths.** Many listicles that AI engines cite today are written by a competitor that ranks itself first. A page that concedes what other products do well is the differentiated one, and readers trust it.
- **Every competitor claim has a source and a date**: the vendor's own pricing or docs page, checked during this pass. Every Prisma claim matches the current pricing page and docs.
- **Product names** stay consistent (Prisma Postgres, Prisma Compute, Prisma ORM), and the first mention links to docs, per the `content-write-blog` link rules.
- **Writing quality** meets the bar in `content-write-blog` ("Writing quality"). Run `.claude/skills/docs-reader-review/scripts/check-ai-signs.sh <file>` on the page text and fix what it flags.

## Step 5: Review before the pull request

Run `content-write-blog` Step 10 (adversarial review) with at least the fact refuter and the reader skeptic. Add the positioning refuter for head-to-heads and roundups, and the code refuter when the page has runnable code. Fix the findings and re-review until a round returns zero confirmed findings.

## Step 6: Make the page discoverable

Do all of this in the same pull request as the page.

1. **Sitemap.** The site sitemap (`apps/site/src/lib/sitemap.ts`) picks up static `page.tsx` routes automatically, but it **skips dynamic segments** such as `[slug]`. If the section renders its pages from a content collection through a dynamic route, add those pages to `getSiteSitemapEntries`, the way changelog and extensions entries are added. Then serve the site and confirm `/sitemap-site.xml` lists the URL. Blog and docs pages are in their own sitemaps automatically.
2. **llms.txt.** Blog posts appear in `/blog/llms.txt` automatically. Site pages don't: `/llms.txt` is built in `apps/site/src/app/llms-content.ts` from `markdownPageList` plus `additionalPages`. Add the page there (or the section's index page, once the section has one), and confirm it with `curl -s localhost:<port>/llms.txt | grep <path>`.
3. **Section index and footer.** Add the page to its section's index page (for example `/comparisons`). The index page must be linked from the footer (`packages/ui/src/data/footer.ts`). If it isn't yet, add that footer link once.
4. **Inbound links.** Link to the new page from at least two related pages: the product or docs page it extends, and a related blog post or answer page. Use the question or the topic as anchor text. A page that nothing links to is crawled late or not at all.
5. **Markdown rendition.** AI agents prefer Markdown. Blog and docs pages get a `.md` rendition automatically. For a site page, check whether its section supports one (`apps/site/src/lib/agent-markdown.ts`), and register the page if it does.
6. **IndexNow runs by itself.** `.github/workflows/indexnow.yml` submits changed sitemap URLs to IndexNow after every production deploy of the site, docs and blog apps. There is nothing to submit by hand, but it only sees URLs that item 1 put in the sitemap. After the deploy, confirm the run succeeded with `gh run list -R prisma/web --workflow indexnow.yml --limit 3`.
7. **Check the served page.** Serve it and run `content-seo-geo` Step 7 against the rendered HTML, not the source file.

## Step 7: Record and measure

Once the page is live on www.prisma.io:

1. **Tracker.** Set Status to "Published" and fill in Article URL and the Published date. Put the same URL on every row the page serves.
2. **PromptWatch.** With the PromptWatch MCP connected, add a page tracker for the URL in the Prisma project. Without it, send the URL to the PromptWatch owner in #developer-relations so they can add it.
3. **Crawl check after about three days.** Look the URL up in PromptWatch's crawler logs (or Ora) to see whether AI crawlers fetched it, and note the result in the row's Notes. If nothing has crawled it after a week, recheck Step 6: the sitemap entry and the inbound links are the usual causes.
4. **Citations come later.** Compare the prompt's PromptWatch answers before and after publishing, model by model. A monitor's average hides which model moved.

## Page outlines

Use these when there is no Conversion Factory template. Each one opens with the answer and ends with an FAQ in the site's accordion format (`content-seo-geo` Step 3). The numbers give the order of the sections.

### Head-to-head (`/comparisons/prisma-vs-<x>`)

1. H1 in the form "<Prisma product> vs <X>: <the decision in a few words>"
2. An answer paragraph that says who should pick which
3. A comparison table covering pricing model, free plan, limits, regions, app and database hosting, agent and MCP support, and migration path, with a source and date behind each competitor cell
4. "Choose <X> if..." and "Choose Prisma if..."
5. How to migrate in either direction
6. FAQ

### Alternatives (`/comparisons/<x>-alternatives`)

1. H1 in the form "<X> alternatives for <use case>"
2. An answer paragraph that names the top picks and the reasons people move off X
3. One section per alternative, covering what it is best for, its strengths, its limits and its price, with Prisma included but not placed first by default
4. A comparison table of the alternatives
5. How to move off X
6. FAQ

### Best-of roundup (`/comparisons/best-<category>`)

1. H1 in the form "Best <category> for <audience>"
2. An answer paragraph with the short list
3. The criteria the options were judged on
4. One section per option
5. A comparison table and a "pick X if..." summary
6. FAQ

### Use-case guide (`/postgres/<topic>`, `/compute/<topic>`)

1. H1 that restates the question
2. An answer paragraph
3. What this use case needs from a database or host
4. The options, compared briefly
5. How to set it up with Prisma, as numbered steps with runnable commands
6. The limits, and when to choose something else
7. FAQ

### Troubleshooting

1. H1 that states the symptom in the reader's words, with the error message verbatim when there is one
2. An answer paragraph with the cause and the fix
3. Why it happens
4. The fix, as numbered steps
5. How to prevent it, and the cases where the fix doesn't apply
6. FAQ

## Anti-patterns

- **Writing without claiming.** Two people writing the same page wastes a day and splits citations between two URLs.
- **A second page for a covered prompt.** Refresh the existing page instead (Step 2).
- **Publishing under `/blog` because the section isn't built yet**, without asking the operator.
- **Pages that only praise Prisma**, or competitor facts with no source and date.
- **Dynamic-route pages missing from the sitemap.** They never reach IndexNow, and crawlers find them late.
- **Changing a published slug.**
- **Near-duplicate pages with swapped keywords.** Each page answers a different question, or it doesn't ship.
