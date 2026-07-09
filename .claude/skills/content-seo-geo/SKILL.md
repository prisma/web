---
name: content-seo-geo
description: Optimize a prisma.io page for search engines and AI answer engines. Use when writing or reviewing blog posts, docs pages, or landing pages for SEO, GEO, AEO, AI citations, AI Overviews, ChatGPT/Perplexity visibility, featured snippets, metadata, or FAQ sections; when refreshing an existing page for freshness or rankings; or when asked why a page isn't ranking or being cited.
metadata:
  version: "2026.7.8"
---

# SEO + GEO Optimization

Optimize one page at a time so that AI engines cite it and search engines rank it. **Being cited by AI engines is the primary goal and ranks above search engine rankings**: an AI assistant that quotes and recommends Prisma reaches developers (and their coding agents) before a search results page ever loads. Search ranking is the supporting mechanism, since ranked pages get retrieved and cited more often. When a trade-off appears, choose what makes the page more quotable by AI engines.

Both goals are earned by the same underlying property: a page that answers a specific question with verifiable, extractable claims. Work through the steps in order; the page is done when every completion criterion checks.

This skill is used in conjunction with the `content-write-blog` skill in this repo: `content-write-blog` produces and drafts the post (author, frontmatter shape, link rules, writing quality), and this skill optimizes the result for search and AI engines. `content-write-blog` stays the source of truth for drafting conventions; this skill does not restate them.

## Step 1: Name the target queries

Write down the questions this page should be the answer to: one primary query and the 5–10 related queries an AI engine fans out to (synonyms, "how to", "X vs Y", "best X for Y" variants). Every later step is judged against this list.

For new pages, let the query pick the format: comparisons, definitive guides, and original data are the formats AI engines cite most, so frame the page as one of those where the topic allows, rather than a generic post on the same subject.

**Done when:** the primary query is one sentence, and each fan-out query is either answered on this page or deliberately assigned to another page.

## Step 2: Answer first

The first paragraph answers the primary query directly: what the thing is, what the reader will achieve, and the exact mechanism, with the product and category named. A reader (or model) who sees only this paragraph should correctly classify the page and be able to quote a correct answer from it.

Series or context position is stated explicitly ("This is the second part of a five-part series on...") — models can't infer position from URL structure.

The lead carries the canonical internal links, so agents know from the first paragraph where the related information lives: the first product mention linked to its docs page (per `content-write-blog` link rules) and, where one exists, the predecessor or parent page (previous series part, overview page). Only those; "related reading" clusters dilute the answer and stay out of the lead.

**Done when:** the primary query is answered within the first 100 words, with no throat-clearing ("Welcome to", "In today's world", "Here's the thing"), and the lead links to the canonical docs page and predecessor page where they exist.

## Step 3: Structure for extraction

AI engines extract passages, not pages. Match block type to query type:

| Query shape | Block |
|---|---|
| "What is X?" | Definition paragraph, 40–60 words, standalone |
| "How to X" | Numbered steps |
| "X vs Y" | Comparison table |
| "Is X better / should I X" | Pros/cons list |
| Recurring questions | FAQ section (markup below) |

Rules:

- Headings phrased the way people ask ("Does `whitelist: true` reject unknown fields?"), where that reads naturally.
- Every section leads with its answer; explanation follows.
- One idea per paragraph.
- Structure serves people first. The same clear page satisfies Google and AI engines; chunking content into fragments "for AI" or writing per-engine variants triggers spam policies and reads worse.
- No inline table of contents — the site layout renders its own `InlineTOC` from headings.
- FAQ sections use the site's accordion components. Bodies are server-rendered, so collapsed answers remain fully readable to crawlers and models:

```mdx
## Frequently asked questions

<Accordions type="single">
  <Accordion title="Question phrased the way people ask it?">
Answer as a standalone, quotable claim. State the fact first, qualification second.
  </Accordion>
</Accordions>
```

3–4 questions per page. Each answer must stand alone with zero surrounding context.

**Done when:** each target query from Step 1 maps to a block on the page, and every FAQ answer reads as a complete fact on its own.

## Step 4: Make claims citable

Models cite pages that contain facts they can lift and defend. Convert vague statements into specific ones:

- Concrete nouns and named products over pronouns and "our platform".
- Numbers with dates and sources ("55.3M downloads/month, npm, July 2026"), never round marketing claims. Sourced statistics are the single strongest citation driver (roughly +40% in the Princeton GEO study).
- A quotation from a named person (maintainer, engineer, customer) where one genuinely exists; quoted experts lift citation rates, manufactured quotes destroy trust.
- Keywords used where a reader needs them and nowhere else; repeating terms to game engines measurably reduces AI visibility.
- Behavior stated exactly ("fails with HTTP 409 and the message `Unique constraint failed`"), quoted from real output.
- Every claim verified before publication: code samples run on the current release, numbers pulled from the live source, links resolving. A page that teaches models one wrong fact does more damage than a page that ranks nowhere.

**Done when:** every factual claim on the page would survive being quoted out of context, and each has been verified this pass (not assumed from a previous version).

## Step 5: Entity and freshness signals

- Same product names everywhere on the page; state the category near the top ("Prisma ORM, a TypeScript ORM...").
- Named author with a real profile; keep the original author on refreshes.
- `updatedAt` frontmatter bumped honestly per touch, plus an "**Updated (Month Year):**" callout stating what changed and which versions everything was verified against.
- Internal links to the canonical docs, product, and related blog pages per `content-write-blog` link rules.

**Done when:** the page names its category, carries a current `updatedAt` + callout, and links to at least the canonical docs page for each product it covers.

## Step 6: Metadata

- `metaTitle`: leads with the primary query's answer or subject, under ~60 characters, current version names included where they earn clicks ("Input Validation in a REST API with NestJS and Prisma 7").
- `metaDescription`: one or two sentences answering the primary query, naming the stack and the outcome, under ~160 characters.
- Slug: never changed on refreshes — ranking history lives there.

**Done when:** title and description each answer the primary query on their own, and the slug is untouched.

## Step 7: Verify the page as served

Build or serve the page and check the rendered HTML, not the source file: FAQ bodies present in HTML, headings generating TOC entries, no broken components, links returning 200. Content checks against the source file pass on stale builds and lie.

**Done when:** every check in this list was run against the served page:

- [ ] Primary query answered in first 100 words
- [ ] Each Step 1 query mapped to a block
- [ ] FAQ accordion bodies present in served HTML
- [ ] All claims verified this pass; all links 200
- [ ] `updatedAt` + Updated callout present (refreshes)
- [ ] metaTitle / metaDescription answer the primary query
- [ ] No inline TOC

