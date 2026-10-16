# Skills

Local skills for this repo. They help you write blog posts, create blog cover images, and write documentation in a consistent style.

## How skills work

- **With Claude Code:** every skill here loads automatically when you open the repo. Describe what you want ("write a blog post about X", "make a cover image for this post", "write a how-to for Y") and the matching skill activates.
- **Without Claude Code:** each skill is plain Markdown. Open its `SKILL.md` and follow the steps yourself. They are written to be read by people too.

A skill is a folder with a `SKILL.md` (the instructions) and sometimes `references/`, `scripts/`, and `assets/`.

## The skills

| Skill | Use it to | Trigger example |
|-------|-----------|-----------------|
| [`content-write-blog`](content-write-blog/SKILL.md) | Scaffold a new Prisma blog post (frontmatter + section stubs) | "Draft a blog post about connection pooling" |
| [`content-write-answer-page`](content-write-answer-page/SKILL.md) | Write one page that answers one tracked AI prompt (comparison, alternatives, roundup, use case, troubleshooting) in the wording engines search with, then make it discoverable: sitemap, series links, footer index, tracker and PromptWatch | "Write the answer page for PW123", "Write a Neon alternatives page" |
| [`content-create-hero-image`](content-create-hero-image/SKILL.md) | Generate a post's hero (SVG) and social/OG image (PNG) in the Eclipse house style | "Create a cover image for my Compute post" |
| [`docs-writer`](docs-writer/README.md) | Write or rewrite developer docs (how-to, concept, reference) | "Write a how-to for deploying to Prisma Compute" |
| [`docs-reader-review`](docs-reader-review/SKILL.md) | Check a written page reads for an ordinary user: banned-jargon, staccato, and AI-signs checks, then a fresh reviewer reads it cold and marks what it cannot follow | "Reader review this page" |
| [`docs-reader-review/scripts/check-ai-signs.sh`](docs-reader-review/scripts/check-ai-signs.sh) | Runs in CI (`docs-prose.yml`) on every hand-written docs page a pull request adds or changes (the generated ORM and CLI error-reference pages are skipped; their text is fixed upstream); its word list is dated in `references/ai-writing-signs.md` and needs re-checking against Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) about every six months | "Update the AI-signs word list" |
| [`docs-agent-ready`](docs-agent-ready/SKILL.md) | Hold the docs' agent-readiness invariants (llms.txt budgets, coverage, skill/MCP endpoints) when editing them | "Add a new docs section to llms.txt" |

---

## content-write-blog

Produces a blog-post **skeleton** (frontmatter, section headings, short stubs), grounded in Prisma positioning. It writes content only; you own the git workflow (branch, commit, push, open the PR).

**How to use:**

1. Give it your pitch: the angle, audience, and key takeaway. (Or point it at a rough draft.)
2. Point it at your local checkout of this repo so it can read current blog conventions.
3. Give it your author slug. If you're a first-time author, it scaffolds an author profile too.
4. Confirm the proposed slug, filename, date, and frontmatter.
5. It writes the skeleton, then adds contextual links: the first mention of Prisma Postgres, Prisma Compute, and Prisma 8 links to docs for SEO, and topic mentions cross-link to related posts (for example, a bloom-filter mention links to the bloom-index post).
6. It hands back a link inventory and a next-step reminder. You flesh out the prose and open a draft PR.

**Note:** the skill reads the positioning doc from the **prisma/ignite** repository at `docs/prisma/positioning.md` (fetched at draft time from `https://raw.githubusercontent.com/prisma/ignite/main/docs/prisma/positioning.md`). There is no local vendored copy in this repo.

## content-write-answer-page

Writes and publishes a page that answers one question people ask AI assistants, such as "What are good Neon alternatives?" or "Which Postgres works best for a small team?". Unlike `content-write-blog`, it produces the finished page and takes it through publishing.

**How to use:**

1. Give it the tracked prompt or its Prompt tracker reference (`PW123`). It claims the row so nobody else writes the same page, and stops if someone else owns it.
2. It reads how AI engines phrase the prompt (their search queries, the pages they cite, the criteria they decide on), so the page is titled in the engines' words.
3. It checks whether a prisma.io page already answers the prompt. If one does, it refreshes that page instead.
4. It picks the page type and URL (`/comparisons/...`, `/postgres/...`, `/compute/...`, `/orm/...`). `/blog` is used only if the operator explicitly approves it. It writes the page with `content-seo-geo` and runs the adversarial review from `content-write-blog`.
5. In the same pull request it adds what makes the page discoverable: the sitemap entry, links within the comparison series and from related pages, the section index linked from the footer, and `llms.txt`. IndexNow then runs by itself after the production deploy.
6. After the page is live, it marks the tracker row Published, adds a PromptWatch page tracker, and checks AI crawler logs about three days later.

## content-create-hero-image

Generates a `hero` (editable SVG) plus a pixel-exact `meta` (Open Graph PNG) for a blog post, in Prisma's Eclipse house style. It bundles the brand fonts, logos, design tokens, and a render pipeline, so the PNG matches the SVG exactly.

**How to use:**

1. Tell it the post the image is for (the topic, and the slug if the post exists).
2. It discovers your blog's current image conventions (directory, filenames, frontmatter fields) from recent posts.
3. It proposes a design direction (surface, accent, product, metaphor). Confirm or adjust.
4. It renders the SVG and PNG with `scripts/export-png.sh` and runs a built-in design-review pass.
5. It returns the saved `hero.svg` and `meta.png` paths (under `apps/blog/public/<slug>/imgs/`) and the design rationale.

For the render to use the real brand fonts, the bundled `assets/fonts/` is used automatically. See [`content-create-hero-image/README.md`](content-create-hero-image/README.md) for tooling details.

## docs-writer

Writes or rewrites developer-facing documentation a reader can follow without getting stuck. Covers how-to, concept, and reference pages.

**How to use:**

1. Tell it what to write and which page type ("write a how-to for X", "explain concept Y", "make this page clearer").
2. It answers four scoping questions (reader, the one task, prerequisites, success signal), then drafts using the page shape and step rhythm in its `SKILL.md`.
3. It runs a final-pass checklist and cuts filler.

See [`docs-writer/README.md`](docs-writer/README.md) for the one-minute writing style and [`docs-writer/references/how-to-use.md`](docs-writer/references/how-to-use.md) for a worked example of each page type.

---

## Adding or changing a skill

Edit the skill's `SKILL.md`. Keep the `description` in its frontmatter to "Use when..." trigger phrases only (that line is what routes a request to the skill). Put longer guidance in the body or in `references/`.
