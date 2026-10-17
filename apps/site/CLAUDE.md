@AGENTS.md

## Product answer pages

Focused product use-case and troubleshooting guides use the collections in
`content/answers/postgres/` and `content/answers/compute/`, rendered under their
matching product paths. Read
`content/answers/README.md` before adding one. The reusable article template is in
`src/components/answer-pages/answer-page.tsx`; discovery through the guides index,
sitemap, llms files and `.md` renditions is driven by the collection. Add inbound
links from at least two related pages in the same change.

## Comparison pages

Register new `/compare/<slug>` pages in `app/compare/comparisons.ts` using the
page's title, description, and FAQ constants. The shared `app/compare` layout
emits JSON-LD from that registry: CollectionPage and ItemList on `/compare`,
and Article, BreadcrumbList, and FAQPage on each head-to-head. Do not add
those script tags on the page.

Keep the comparison's JSX content in a pure `get<Name>PageContent` function,
with no hooks, and register it in `lib/markdown/comparisons.tsx`. HTML and
Markdown use that same tree. The build fails if a registered comparison has
no Markdown body. Negotiation follows `COMPARISON_PATHS`; do not add the path
to `next.config.mjs`. The shared Markdown pipeline supplies `.md`, `llms.txt`
and `llms-full.txt`.
