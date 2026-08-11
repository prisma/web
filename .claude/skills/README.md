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
| [`content-create-hero-image`](content-create-hero-image/SKILL.md) | Generate a post's hero (SVG) and social/OG image (PNG) in the Eclipse house style | "Create a cover image for my Compute post" |
| [`docs-writer`](docs-writer/README.md) | Write or rewrite developer docs (how-to, concept, reference) | "Write a how-to for deploying to Prisma Compute" |
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

**Note:** the skill reads `content-write-blog/assets/positioning.md`, Prisma's internal positioning doc. It is **not committed to this public repo** (it's gitignored). Place it locally before drafting, or the skill will ask for it.

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
