# Skills

Local skills for this repo. They help you write blog posts, create blog cover images, write documentation, and write the changelog in a consistent style.

## How skills work

- **With Claude Code:** every skill here loads automatically when you open the repo. Describe what you want ("write a blog post about X", "make a cover image for this post", "write a how-to for Y") and the matching skill activates.
- **Without Claude Code:** each skill is plain Markdown. Open its `SKILL.md` and follow the steps yourself. They are written to be read by people too.

A skill is a folder with a `SKILL.md` (the instructions) and sometimes `references/`, `scripts/`, and `assets/`.

## The skills

| Skill | Use it to | Trigger example |
|-------|-----------|-----------------|
| [`content-write-blog`](content-write-blog/SKILL.md) | Scaffold a new Prisma blog post (frontmatter + section stubs) | "Draft a blog post about connection pooling" |
| [`content-write-answer-page`](content-write-answer-page/SKILL.md) | Write one page that answers one developer question (comparison, alternatives, roundup, use case, troubleshooting) with sourced, neutral comparisons and stated limits, in the words people search with, then make it discoverable: sitemap, series links, footer index, `llms.txt`, tracker and monitoring | "Write a Neon alternatives page", "Write a troubleshooting page for 'too many connections'" |
| [`content-create-hero-image`](content-create-hero-image/SKILL.md) | Generate a post's hero (SVG) and social/OG image (PNG) in the Eclipse house style | "Create a cover image for my Compute post" |
| [`content-write-changelog`](content-write-changelog/SKILL.md) | Write the entry for prisma.io/changelog from everything that shipped since the last one, and open the pull request | "Write this month's changelog" |
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

Writes and publishes a page that answers one developer question with sourced, neutral comparisons and stated limits, such as "What are good Neon alternatives?" or "Which Postgres works best for a small team?". Unlike `content-write-blog`, it produces the finished page and takes it through publishing.

**How to use:**

1. Give it the question or its content tracker reference. It claims the row so nobody else writes the same page, and stops if someone else owns it.
2. It reads how people phrase the question (their search queries, the pages that come up, the criteria those pages decide on), so the page is titled in the reader's words.
3. It checks whether a prisma.io page already answers the question. If one does, it refreshes that page instead.
4. It picks the page type and URL (`/compare/...`, `/postgres/...`, `/compute/...`, `/orm/...`). `/blog` is used only if the operator explicitly approves it. It writes the page with `content-seo-geo` and runs the adversarial review from `content-write-blog`.
5. In the same pull request it adds what makes the page discoverable: the sitemap entry, links within the comparison series and from related pages, the section index linked from the footer, and `llms.txt`. IndexNow then runs by itself after the production deploy.
6. After the page is live, it marks the tracker row Published, adds the URL to the team's page monitoring, confirms the IndexNow run and asks for indexing in Google Search Console and Bing Webmaster Tools, and checks crawler logs about three days later (Step 8 of the skill).

## content-create-hero-image

Generates a `hero` (editable SVG) plus a pixel-exact `meta` (Open Graph PNG) for a blog post, in Prisma's Eclipse house style. It bundles the brand fonts, logos, design tokens, and a render pipeline, so the PNG matches the SVG exactly.

**How to use:**

1. Tell it the post the image is for (the topic, and the slug if the post exists).
2. It discovers your blog's current image conventions (directory, filenames, frontmatter fields) from recent posts.
3. It proposes a design direction (surface, accent, product, metaphor). Confirm or adjust.
4. It renders the SVG and PNG with `scripts/export-png.sh` and runs a built-in design-review pass.
5. It returns the saved `hero.svg` and `meta.png` paths (under `apps/blog/public/<slug>/imgs/`) and the design rationale.

For the render to use the real brand fonts, the bundled `assets/fonts/` is used automatically. See [`content-create-hero-image/README.md`](content-create-hero-image/README.md) for tooling details.

## content-write-changelog

Writes the entry for [prisma.io/changelog](https://www.prisma.io/changelog) and opens the pull request. It gathers what merged since the last entry, keeps only what a user can see and what is already released, and explains each change from the reader's side, with the most impactful change at the top.

**How to use:**

1. Ask for the changelog ("write this month's changelog"). The window starts at the newest entry in `apps/site/content/changelog/`.
2. It lists the merged pull requests across the Prisma repositories with the `gh` CLI, then reads the release notes and the docs for the candidates it keeps. You need access to the Prisma organization for the private repositories, or the entry covers the public ones only.
3. It writes `apps/site/content/changelog/{date}.mdx` and adds screenshots to `apps/site/public/changelog/`.
4. It runs `content-write-changelog/scripts/check-entry.mjs`, which checks the frontmatter, compiles the MDX, and checks every link and anchor against production.
5. It runs the `docs-reader-review` checks and has a fresh reviewer read the entry cold, so that the entry explains each change instead of listing it the way a spec would.
6. It opens a pull request whose body lists everything it held back or excluded, with a reason for each. You review, edit, and merge.

The skill reads the same positioning doc as `content-write-blog`, from the **prisma/ignite** repository. Its rules live in four short references: [gathering](content-write-changelog/references/gathering.md), [filtering](content-write-changelog/references/filtering.md), [voice](content-write-changelog/references/voice.md), and [structure](content-write-changelog/references/structure.md).

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
