---
name: content-write-blog
description: Use when the operator wants to write a blog post, draft a blog article, start a new post for the Prisma blog, or publish to prisma.io/blog.
metadata:
  version: "2026.7.9"
---

# Write Blog Post

Produce a _skeleton_ for a Prisma blog post — frontmatter, section headings, and short stubs — not a finished article. The human author writes the prose.

This skill produces content only. It does **not** check out, branch, commit, push, or open pull requests against the blog repository. The operator owns that workflow: they prepare the checkout, place the skeleton into it, and push and open the pull request following the repo's contribution process.

The blog is owned by DevRel but contributed to by everyone, so do not assume the operator is on the DevRel team or familiar with the blog repository. Treat first-time contributors as the default case.

## Assets

- `assets/positioning.md` — Prisma's internal positioning doc. It is **not committed to this public repo** (it's gitignored); obtain it from the internal positioning source and place it at `assets/positioning.md` before drafting. Read it before writing the lead and section stubs so the angle, framing, and product claims stay aligned with how Prisma describes itself. It is the source of truth for positioning, so do not contradict it. If it is absent, ask the operator for the current positioning before grounding the post.

## Asking the operator questions

For a decision with a small set of options (which author, whether a proposal looks right, where the checkout lives), prefer a structured-choice question where the environment supports one; fall back to a plain question for freeform answers (a pitch, a slug, a bio). Bias toward reasonable defaults from context; ask only when multiple valid paths exist.

## Step 1: Gather the pitch

The operator must provide direction for the post. Valid inputs:

- A pitch pasted into the conversation (a few sentences explaining the angle, audience, and key takeaway)
- A path to an existing draft markdown file
- Both — a pitch plus a reference draft

If nothing was provided, ask: _"What's the blog post about? Share a pitch (angle, audience, key takeaway), or a path to a draft if you have one."_

Do not proceed without input, and do not invent a pitch on the operator's behalf.

## Step 2: Ground in positioning

Read the positioning asset above. Note the product names, claims, and framing that the post must stay consistent with. If the pitch conflicts with positioning, surface the conflict to the operator before drafting — do not silently "correct" the pitch, and do not write copy that contradicts positioning.

## Step 3: Locate the blog repository checkout

The operator prepares and owns this checkout — this skill does not create it. Ask the operator for the path to their local checkout of the blog repository (the `prisma/web` repo, which contains the blog content).

- If the operator provides a path, confirm it is the expected repository by inspecting its contents (top-level layout, a blog content directory). If it looks like the wrong repository, halt and surface the mismatch — do not modify or relocate it.
- If the operator does not have a checkout ready, ask them to prepare one and provide the path. Without a checkout, you cannot discover conventions or place files; you may still draft the skeleton inline in the conversation for the operator to paste in, but flag that conventions are unverified.

Treat the checkout as read-and-write for content files only. Never perform repository-level operations (branching, committing, pushing, or opening pull requests) — those belong to the operator.

## Step 4: Survey blog conventions

Do not hardcode conventions in this skill — discover them from the operator's checkout each time by reading files:

1. Locate the blog posts directory by inspecting the repo layout (look for `content/blog/`, `posts/`, `src/content/blog/`, or similar).
2. Read 2–3 of the most recent posts. Extract: frontmatter fields used, filename / slug convention, where the date lives (filename vs. frontmatter), title casing, lead-paragraph style.
3. Read the authors directory (commonly `authors/`, `content/authors/`, or referenced from a recent post's frontmatter). Note the author profile file shape and required fields.
4. Read any contributing guide, README, or blog-specific contributor doc in the repo. Note required steps, formatting expectations, and review expectations — the operator will need these when they push.
5. Note the repository's formatting / lint step if its package configuration declares one, so you can apply it to the files you write.

Briefly summarise to the operator what you found (one or two sentences) before continuing.

## Step 5: Resolve the author

Ask the operator for their author slug (e.g. `jane-doe`).

- If a profile already exists in the authors directory under that slug, use it as-is.
- If no profile exists, this is a first-time contributor step. Ask for the fields required by the discovered author file shape (typically name, bio, role, social handles, avatar path). Scaffold the profile file alongside the post. Flag this to the operator so they know to verify the bio reads correctly and to include it when they push.

If the operator is unsure which slug is theirs, list the existing author slugs and ask them to pick or confirm a new one.

## Step 6: Propose slug, filename, date, and frontmatter

Based on the pitch and the conventions from Step 4:

- **Slug**: lowercase, hyphenated, derived from the working title. Keep it short and searchable.
- **Filename**: match the repo's convention (e.g. `YYYY-MM-DD-slug.md`, `slug/index.mdx`, `slug.md`).
- **Date**: today's date, in the format used by recent posts.
- **Frontmatter**: populated with title, slug, date, author slug, and any other fields recent posts use (tags, description, etc.). Where a field needs human judgement (description, tags), pre-fill a reasonable guess and clearly flag it as a placeholder.

Present the proposal as a single block and confirm before writing any files. Do not proceed without confirmation.

## Step 7: Write the skeleton article

Write the post file at the location decided in Step 6, inside the operator's checkout. The file contents:

1. **Title** — H1 (or per repo convention; some setups derive the title from frontmatter only — match what recent posts do).
2. **Lead** — 1–2 sentences drafted from the pitch and grounded in positioning. Intentionally short; the human will rewrite.
3. **Section headings** — 3–5 `##` headings inferred from the pitch, each followed by a one-line italic stub: _"Write about X here — touch on Y and Z."_
4. **Closing** — a brief CTA stub (a single placeholder sentence, e.g. _"Wrap up with the takeaway and a clear next step for the reader."_).

If you also scaffolded an author profile in Step 5, write that file too.

After writing, apply the repository's formatting / lint step (discovered in Step 4, if any) to the new files and fix violations, so the operator inherits clean files.

## Step 8: Add contextual links

After the skeleton is written, enhance it with relevant links before handing it back to the operator. Add only links that genuinely help the reader — never pad the post with low-value or tangential references.

### Internal Prisma links

Scan the skeleton for opportunities to link to Prisma's own content. Only add a link when the post introduces a topic and the linked page lets the reader go meaningfully deeper:

- **Prisma product names (link the first mention to docs).** The first time the post names **Prisma Postgres**, **Prisma Compute**, or **Prisma 8**, link it inline to that product's documentation. These internal doc links build SEO and point the reader to the authoritative reference. Link the first mention only; do not re-link later occurrences. Use the canonical docs page, or a more specific docs page when one fits the sentence better:
  - Prisma Postgres → `https://www.prisma.io/docs/postgres`
  - Prisma Compute → `https://www.prisma.io/docs/compute`
  - Prisma 8 → `https://www.prisma.io/docs/orm` (Prisma 8 is the next-generation Prisma ORM)
- **Related blog posts (cross-link by topic).** When the skeleton mentions a topic an existing post covers in depth, link to that post. Search the blog content directory by topic and tag, not just by exact title, so you catch matches the wording doesn't make obvious. For example, a mention of a Postgres bloom filter or bloom index should link to the bloom-index post (`postgres-bloom-index-the-overlooked-postgres-feature`); a mention of `LISTEN`/`NOTIFY` should link to the post that covers it. These cross-links keep readers on the blog and strengthen internal SEO.
- **Documentation** — link to relevant docs pages on `prisma.io/docs` when the skeleton mentions a feature, concept, or workflow beyond the three products above that the docs explain authoritatively.
- **Product pages** — for a high-level, positioning-level mention of a product, the marketing page (`prisma.io/postgres`, `prisma.io/compute`, `prisma.io/orm`) can fit better than docs. Prefer docs for technical mentions; use the product page only for whole-product framing.

Discover available internal links from the blog repository checkout (Step 3). Inspect existing blog posts in the content directory for relevant earlier articles, matching on topic and tags. If the checkout includes docs or the operator can point to a docs checkout, inspect its structure for matching pages. For product pages, use Prisma's known site structure.

### External links

Scan the skeleton for mentions of external products, frameworks, libraries, languages, or standards. Add a link only when:

- The mention is substantive — the post depends on the reader knowing what the thing is, or the linked resource directly extends the point being made. A passing mention is not a link opportunity.
- The link points to the project's official site or canonical documentation — never to a third-party tutorial, Wikipedia, or unofficial resource.
- The URL is stable and permanent — avoid links to specific blog posts that may age, versioned docs that will rot, or redirect/affiliate URLs.

### Return a link inventory

After adding links, compile a numbered list of every link added, split into two sections. Present this inventory to the operator so they can review and remove any links they consider unnecessary. Do not remove links unilaterally after presenting — the operator decides.

Format:

```
**Internal links added:**

1. [anchor text](url) — placed in "Section Heading", context: why this link is relevant
2. …

**External links added:**

1. [anchor text](url) — placed in "Section Heading", context: why this link is relevant
2. …
```

### Quality bar

If fewer than three meaningful link opportunities exist, do not force links. A sparse but relevant link set is better than a dense one that reads like a link farm. Zero links is acceptable when the skeleton does not naturally invite any.

## Step 9: Hand-off summary

End by giving the operator, in a short block:

- The path to the post file (within their checkout).
- The author profile path, if one was scaffolded.
- A reminder that the repository workflow is theirs: create a feature branch, commit the skeleton (and author profile), push, and open the pull request following the blog repo's contribution process. The pull request should be opened as a **draft** until the post is fleshed out.
- A clear next-step instruction: _"Edit the post to flesh out each section, keep it consistent with positioning and free of AI slop (see Writing quality), run the `content-seo-geo` skill in this repo to optimize the finished draft for search engines and AI answer engines, then complete Step 10 before opening any PR."_

Do not claim the post is "done" or "ready" — it is a skeleton handed back to the operator.

## Step 10: Adversarial review

The final step of the process, and the gate to a pull request: once the skeleton has been fleshed into a finished draft and the `content-seo-geo` pass is done, the draft is reviewed by agents that did not write it, in separate context windows. The author (human or agent) wants the post to ship; a reviewer with a fresh context and a refutation mission does not share that bias. A blog post is a set of falsifiable claims — prices, version numbers, benchmark figures, API behaviors, links — and the reviewers' job is to falsify them.

### How to run it

Spawn one reviewer agent per applicable lens, every lens that applies, regardless of post length. The fact, reader, and positioning lenses apply to every post; the code lens applies whenever the post contains runnable code. Whether the reviewers run as plain subagents or as an orchestrated review workflow is an implementation choice, not a review-depth choice: a workflow's vote-counting and automated re-review loops pay off when findings are numerous, but the lenses and rules are identical either way. Rules that make the isolation real:

1. **Reviewers receive only the draft file path and their mission.** Never include the writing conversation, the pitch, the outline, or any statement of what the post intends or why it is correct. A prompt that says "review this post, which correctly explains X" has already contaminated the reviewer.
2. **Each reviewer gets a refutation mission, and skepticism is the default.** "Find reasons this is wrong" outperforms "check whether this is right."
3. **Distinct lenses, one per reviewer** — diversity catches what redundancy misses. The lenses:
   - **Fact refuter**: attack every number, price, version, date, and named behavior. Verify each against the live primary source (vendor pricing page, official docs), not from memory. Report any claim whose source does not say what the post says.
   - **Code refuter** (posts with code): run every sample fresh against the stated versions. Report anything that does not compile, run, or produce the shown output.
   - **Reader skeptic**: where does the post confuse, overclaim, contradict itself, or read like marketing? Where would a knowledgeable reader stop trusting it?
   - **Positioning refuter**: report claims that contradict the positioning doc or overstate product status (GA claims, superlatives, unverified benchmarks).
4. **The implementer fixes; reviewers re-review.** Findings come back to the authoring session, which applies fixes. Re-run the reviewers on the fixed draft. Repeat until a round produces no confirmed findings. The implementer never marks its own finding as resolved without a reviewer pass confirming it.

### Completion criterion

The draft is ready for the operator's PR when the most recent review round returned zero confirmed findings, and the operator has been given the final round's summary (findings found and fixed per round) so they can judge the review's depth, not just its verdict.

## Writing quality

The lead you draft, and the prose the author later writes over your stubs, ship to prisma.io/blog as public content. Draft the lead to this bar, and name the same bar in the hand-off so the author holds it:

- **Open with the point.** Skip "Here's the thing", "It turns out", "In today's world". The first sentence says what the post is about.
- **Name the actor.** A person or a product does the thing. Write "the team shipped the fix that week", not "the fix happened".
- **Be specific.** Replace "this changes everything" or "the implications are significant" with the concrete change. Drop "every", "always", and "never" where a real number fits better.
- **Cut filler.** No "really", "simply", "just", and no marketing verbs like "leverage", "unlock", "seamless", "powerful".
- **Say it straight.** "Not X, but Y" and "X isn't the problem, Y is" telegraph the reversal. State Y.
- **Vary sentence length**, and use a comma, colon, or period in place of em dashes.

## Anti-patterns

- **Writing finished prose.** This skill produces a skeleton. Long generated paragraphs defeat the point and dilute the author's voice. Stubs and section headings only.
- **Performing the repository workflow.** This skill does not branch, commit, push, or open pull requests. Producing those is the operator's job — stop at writing content into their checkout and handing off.
- **Hardcoding blog conventions.** The repo evolves. Always discover frontmatter shape, slug rules, blog directory, author shape, and the formatting step from the operator's checkout in Step 4.
- **Contradicting positioning.** Read the positioning asset first. Do not write claims or framing that conflict with how Prisma describes itself; surface conflicts instead of papering over them.
- **Skipping the author profile step for first-time contributors.** The missing profile is a common trip-wire. Surface it and scaffold it alongside the post.
- **Inventing the pitch.** If the operator gave no direction, ask. Do not generate a topic from imagination.
- **Over-linking.** Adding links to every proper noun, tangential reference, or vaguely related page produces a link farm, not a useful post. Link only when the reader genuinely benefits. If in doubt, leave it out — the operator can always add links later. The one exception is the first mention of Prisma Postgres, Prisma Compute, and Prisma 8: always link those to docs for SEO.
- **Linking to non-canonical sources.** External links must point to official sites and canonical docs. Wikipedia, Medium, third-party tutorials, and versioned URLs are not acceptable link targets.
- **Modifying or relocating the operator's checkout.** If the checkout is the wrong repo or has unexpected state, surface it and ask — do not clean up, move, or reset it unilaterally.
