# Product answer pages

Use this collection for focused use-case and troubleshooting guides under product URLs. It uses Conversion Factory's article structure, the site's Sora/Inter typography, brand tokens and shared navigation. It omits the reference's empty hero image. Comparisons need their own comparison template.

## Add a product guide

1. Add `postgres/<topic>.mdx` or `compute/<topic>.mdx` beside the existing guides. The filename becomes `/<product>/<topic>`. Keep published filenames stable. `guides` is reserved in both products; `hipaa` is also reserved in Postgres.
2. Copy the frontmatter shape from the existing guide. `answer-page-schema.ts` validates metadata, ISO dates, author profile, FAQ, related links and CTA at build time. Keep `title` phrased as the reader's question; it supplies both the H1 and HTML title. `summary` is the first visible paragraph and must answer it.
3. Write Markdown with H2/H3 headings. The compiled MDX supplies heading anchors and the template's desktop contents automatically. Put 3–4 FAQ entries in frontmatter; the template renders the site's accordion and matching FAQ structured data from the same strings. Inline links and code in FAQ answers use the site's FAQ markup.
4. Use the decision structure: requirements, options and trade-offs, setup, limits, FAQ and CTA. Source competitor claims and record the check date. Follow `.claude/skills/content-write-answer-page/SKILL.md` for claim rules and review.
5. Link to the guide from at least two related pages. The collection automatically supplies the matching `/postgres/guides` or `/compute/guides` index, the site sitemap, `/llms.txt`, `/llms-full.txt` and the guide's `.md` rendition, which the guide URL also serves to agent user agents and to `Accept: text/markdown` requests, with a Markdown `Link` header and `<link rel="alternate">`. A new static route under `/postgres` or `/compute` must be added to `ANSWER_PAGE_RESERVED_SEGMENTS` in `src/lib/agent-markdown.ts` and to `ANSWER_PAGE_HEADER_SOURCES` in `next.config.mjs`; `src/lib/answer-page-markdown.test.ts` fails until it is. The footer links both guide indexes.
6. Run the site checks and inspect the served HTML and mobile layout. Confirm the sitemap, Markdown, related links and FAQ bodies before release.

The MDX body uses the site's existing Fumadocs pipeline. Prefer standard Markdown so the raw `.md` rendition has the same content. Register custom visual components in `components/answer-pages/answer-page.tsx` and give them a text equivalent in `renderAnswerMarkdown`. `<EnvironmentDiagram />` already has one.

`/postgres/[slug]` and `/compute/[slug]` are thin route adapters over the shared template. To add another product, register its name, paths and appearance in `answer-products.ts`, then add its content directory, dynamic route adapter and guide index. Link the new index from the footer. Raw discovery, breadcrumbs, index metadata and article OG context use the registry. Do not put a page under an unimplemented product route.
