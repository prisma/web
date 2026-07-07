---
name: docs-writer
description: Use when writing, rewriting, or improving technical docs (quickstarts, how-tos, tutorials, concept pages, or API references).
metadata:
  author: Prisma
  version: "2026.6.23"
---

# Docs Writer

Write documentation a developer can follow from start to finish without getting stuck or guessing. Every page answers three questions, in this order: what am I doing, why does it matter, and what do I do next.

If a rule here conflicts with house style, follow the house style and flag the conflict to the operator.

For a step-by-step example of writing each kind of page (how-to, concept, reference) and rewriting an existing one, see `references/how-to-use.md`.

For a Prisma Next docs page or section (anything under `content/docs/orm/next/` or `content/docs/(index)/next/`), also read `references/prisma-next.md`: page location, redirect handling (commented out until the URL cutover), tested-example requirements, tab and diagram conventions, and naming rules.

## Foundation

These come from Prisma's positioning. They shape how docs frame the product, without turning a page into marketing.

- **Prisma is one integrated platform, not three separate tools.** Prisma Next, Prisma Postgres, and Prisma Compute are built to work together for TypeScript teams. When a page spans more than one, show how they connect; the integration is the reason to use them together, so make it the spine of the page rather than a footnote.
- **Write for a TypeScript developer, often one building with an AI coding agent.** They want fewer moving parts and a working path, not a tour of features.
- **Be honest about maturity.** Don't claim general availability or production readiness for early-stage products (Prisma Compute is early-stage). Don't call a product best-in-class or claim feature parity across products. When the source material is unsure, use narrower wording and flag it.

## Before you write

Answer these four questions. If you can't, find the answer before drafting.

- **Who is the reader, and what do they already know?** A backend developer new to this product needs different framing than someone migrating from a competitor. Write for one reader.
- **What one task does this page complete?** One page, one task. If you're documenting two tasks, write two pages and link them.
- **What does the reader need set up before step 1?** List exact prerequisites: account, runtime version, installed CLI, env vars.
- **How will the reader know it worked?** Decide the success signal now. You'll end the page with it.

## Page shape

Use this structure for a how-to or quickstart. Drop any section that doesn't apply. Don't add sections for ceremony.

1. **Title**: name the task as a verb phrase. "Deploy a Prisma Compute app", not "Deployment".
2. **Intro (1-2 sentences)**: state what the reader will have done by the end, and the one reason it matters.
3. **Prerequisites**: a bulleted list with exact versions and links. The reader should clear this list in under a minute.
4. **Numbered steps**: see "Writing a step".
5. **Verify**: a command the reader can copy and run, with the exact expected output. "You should see your app respond" is not a verification; `curl https://your-app.url` returning `{"status":"ok"}` is.
6. **Next steps**: one to three links to the obvious follow-on tasks.

A numbered step must require the reader to do something: run a command, edit a file, click a button. If there's no action, it's a note, not a step. Put it inline as a short callout instead of numbering it.

## Other page types

A how-to gets the reader through a task. Two other types come up often. Same voice, same slop rules; different spine.

**Concept page** explains one idea so the reader can make decisions.

1. One-sentence definition of the concept in plain terms.
2. Why it matters: the problem it solves or the mistake it prevents.
3. How it works, at the level of detail the reader needs to act, and no deeper.
4. When to use it (and when not to).
5. A link to the how-to that applies it. A concept page should hand off to a task.

**Reference page** is for a reader who already knows what they want and needs exact details.

- Lead with the signature, syntax, or endpoint.
- List every parameter with type, whether it's required, and the default.
- Give one runnable example per entry.
- No narrative. The reader is scanning, not reading.

## Improving an existing page

When the input is a page that already exists, triage before you rewrite.

1. Name the page type and the one task or idea it serves. If it serves more than one, split it first.
2. Read it as the target reader and mark every place you'd get stuck: a missing prerequisite, a command with no context, an unexplained result, a claim you can't verify.
3. Fix in this order, because each unblocks the reader more than the next:
   1. Missing prerequisites or setup that make later steps fail.
   2. Steps with no context, wrong commands, or no way to confirm success.
   3. Hidden limitations and claims you can't verify.
   4. Slop and tone.
4. Change structure and wording freely. Don't change technical facts you can't confirm; flag them instead.

## Writing a step

Every step follows the same rhythm. Don't skip parts of it.

1. **One sentence of context before any code.** Say what the step does and why.
   - Good: "Install the Prisma CLI so you can run migrations from your terminal."
   - Weak: "Run the following command." (Why? What does it do?)
2. **The exact command or code.** It must run as written. Label code blocks with the file path when the reader edits a file.
3. **What the reader should see.** Show real output, a created file, or a screen. Readers use this to confirm they're on track.
4. **A short explanation of the result**, only when it isn't obvious from the output.
5. **The likely failure and its fix**, when a step commonly breaks. One line: "If you see `EADDRINUSE`, another process is using the port; stop it or set `PORT`." This is what makes a doc feel hand-held instead of hopeful.

### Example: a weak step rewritten

Weak:

> **Initialize Prisma**
> Run `npx prisma init`.

Better:

> **Initialize Prisma**
> Set up Prisma in your project. This creates a `prisma/` directory with your schema file and a `.env` file for your database connection string.
>
> ```terminal
> npx prisma init
> ```
>
> You now have `prisma/schema.prisma` and a `.env` file. Open `.env` and confirm `DATABASE_URL` is present.

## Concrete rules

- Address the reader as "you". Use the imperative for actions: "Run", "Open", "Add".
- Put the requirement or context before the command, never after.
- Every code block must run or compile as written. No pseudo-code in step-by-step instructions.
- Label code blocks with the target file path when the reader edits or creates a file.
- Prefer one complete, real example over an abstract description of options. Show the common case; link to the reference for the rest.
- State a limitation where the reader will hit it, inline with the relevant step, not in a footnote.
- Link the first mention of a concept the reader may not know. Don't re-link it every time.
- Use exact product names: Prisma Postgres, Prisma Compute, Prisma Next. Don't shorten "Prisma Postgres" to "the database" or "Prisma Next" to "the ORM" once a page covers more than one product.
- When you tell the reader something is automatic, show the trigger that makes it happen and how to confirm it did. "Compute injects `DATABASE_URL` automatically" needs a follow-up: "Run `prisma compute env` to confirm it's set."

## Teach in plain language

Open every concept with the plain-words version a newcomer can repeat, then a concrete everyday example, and only then the precise terms. Jargon may appear after the reader has the idea, never as the introduction to it.

Weak (jargon-first):

> Data modeling is the step where you describe the shape of your application's data: the entities it works with, the fields each entity carries, and how those entities connect. You author that description as a schema, and it compiles into a versioned contract that your code, migrations, and tooling all read from.

Better (idea first, example second, terms last):

> Data modeling is the process of describing the data your application needs and how that data is connected.
>
> For example, a blog has users, posts, and comments. A user has fields like an email and a name. These models also relate to each other: a user can write many posts, and a post can have many comments.
>
> In Prisma Next, you define this structure in a `contract.prisma` file. This file becomes the shared contract between your application code, database migrations, and developer tools.

The same rule applies inside sections: when a paragraph packs several decisions together, split it into short subsections, one decision each, and show a code block for every option you name. Guidance that lives only in inline code (`Int @id @default(autoincrement())` mid-sentence) belongs in a fenced block with a sentence of its own.

Never lean on internal vocabulary ("runtime family", "lowering", "execution stack") without a one-line plain definition at first use.

For hands-on guides (anything that builds something), follow the house guide style used by /docs/guides/runtimes/bun and the middleware authoring guide: an Introduction stating what the reader builds, Prerequisites, short numbered step headings ("## 1. Create the middleware"), one action per step with the exact file path on every code block, the real expected output after the step that produces it, a likely-failure line where a step commonly breaks, and options or reference material only after the working result.

## Cut the slop

Delete these on sight. They add length, not clarity.

- **Throat-clearing openers**: "Here's the thing", "It turns out", "The truth is", "Let me walk you through". State the content directly.
- **Meta-commentary**: "In this section, we'll…", "As we'll see…", "Now, let's…". Just write the section.
- **Filler adverbs**: really, just, simply, actually, basically, of course. ("Simply run" insults a stuck reader.)
- **Business jargon**: leverage, unlock, seamless, robust, powerful, deep dive, game-changer. Replace with the plain verb or cut.
- **Vague value claims**: "a powerful experience", "the future of X", "everything you need". Replace with a specific capability or remove.
- **Em dashes**. Use a comma, colon, or period instead.
- **Hype**: don't sell inside docs. The reader already chose the product; they want it to work.

## Voice

- Calm and direct. The reader is mid-task, not browsing a landing page.
- Accuracy over persuasion. If behavior is uncertain or version-dependent, say so and say how to check.
- Name limitations honestly and early. Hiding them costs the reader more later.

## Final pass

Before you finish, check:

- [ ] Could a reader with only the listed prerequisites complete every step?
- [ ] Does every command run as written, with no missing setup?
- [ ] Does each step say what it does before showing the command?
- [ ] Is there a way to verify success at the end?
- [ ] Did you cut every phrase from "Cut the slop"?
- [ ] Are product names and limitations accurate?
