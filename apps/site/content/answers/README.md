# Product answer pages

Use this collection for focused use-case and troubleshooting guides under product URLs. It uses Conversion Factory's article structure, the site's Sora/Inter typography, brand tokens and shared navigation. It omits the reference's empty hero image. Comparisons need their own comparison template.

## Add a Postgres guide

1. Add `postgres/<topic>.mdx` beside the existing guide. The filename becomes `/postgres/<topic>`. Keep published filenames stable. `guides` and `hipaa` are reserved static routes.
2. Copy the frontmatter shape from the existing guide. `answer-page-schema.ts` validates metadata, ISO dates, author profile, FAQ, related links and CTA at build time. Keep `title` phrased as the reader's question; it supplies both the H1 and HTML title. `summary` is the first visible paragraph and must answer it.
3. Write Markdown with H2/H3 headings. The compiled MDX supplies heading anchors and the template's desktop contents automatically. Put 3–4 FAQ entries in frontmatter; the template renders the site's accordion and matching FAQ structured data from the same strings. Inline links and code in FAQ answers use the site's FAQ markup.
4. Use the decision structure: requirements, options and trade-offs, setup, limits, FAQ and CTA. Source competitor claims and record the check date. Follow `.claude/skills/content-write-answer-page/SKILL.md` for claim rules and review.
5. Link to the guide from at least two related pages. The collection automatically supplies `/postgres/guides`, the site sitemap, `/llms.txt`, `/llms-full.txt` and the guide's `.md` rendition. The footer already links the guide index.
6. Run the site checks and inspect the served HTML and mobile layout. Confirm the sitemap, Markdown, related links and FAQ bodies before release.

The MDX body uses the site's existing Fumadocs pipeline. Prefer standard Markdown so the raw `.md` rendition has the same content. Register custom visual components in `components/answer-pages/answer-page.tsx` and give them a text equivalent in `renderAnswerMarkdown`. `<EnvironmentDiagram />` already has one.

`/postgres/[slug]` is the first route adapter. To add another product, add its directory and route adapter, update the lightweight content discovery in `answer-page-content.ts`, and parameterize the template breadcrumb, index and OG kicker for that product. Do not put a page under an unimplemented product route.
