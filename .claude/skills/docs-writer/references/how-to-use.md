# How to use docs-writer

The skill handles four jobs. Each starts the same way: say what you want and which page type, then follow the steps. Every job ends with the "Final pass" checklist in `SKILL.md`.

The examples below lean on the products you'll usually document: an app on **Prisma Compute** that queries **Prisma Postgres** through **Prisma Next**.

| You want to...                          | Page type | Jump to                        |
| --------------------------------------- | --------- | ------------------------------ |
| Get a reader through a task             | How-to    | [Write a how-to](#write-a-how-to) |
| Explain an idea so a reader can decide  | Concept   | [Write a concept page](#write-a-concept-page) |
| Give exact details for a known API      | Reference | [Write a reference page](#write-a-reference-page) |
| Fix a page that already exists          | Any       | [Improve an existing page](#improve-an-existing-page) |

---

## Write a how-to

**Prompt:** "Write a how-to for deploying a TypeScript API to Prisma Compute that reads from Prisma Postgres with Prisma Next."

1. Answer the four "Before you write" questions: who the reader is, the one task, the prerequisites, the success signal.
2. Lay out the page shape: title, intro, prerequisites, numbered steps, verify, next steps.
3. Write each step in order: a context sentence, the exact command, the expected output, and the likely failure with its fix.
4. Make the product connection the spine: the Prisma Next client connects to Prisma Postgres, and the app runs on Prisma Compute. Show that, don't just mention it.
5. End with a Verify section the reader can copy and run, like a `curl` against the deployed URL.
6. Run the Final pass checklist; cut everything in "Cut the slop".

Result: a page a reader can follow start to finish, confirm it worked, and know what to do next.

---

## Write a concept page

**Prompt:** "Explain connection pooling in Prisma Postgres."

1. Open with a one-sentence definition in plain terms.
2. Say why it matters: the problem it solves or the mistake it prevents (for example, an app on Prisma Compute exhausting database connections under load).
3. Explain how it works, only as deep as the reader needs to make a decision.
4. State when to use it and when not to: the pooled connection string for app queries, the direct one for migrations.
5. Link to the how-to that applies the idea, so the page hands off to a task.

Result: a reader who can decide whether and when the concept applies to them.

---

## Write a reference page

**Prompt:** "Document the `cacheStrategy` option on a Prisma Next query."

1. Lead with the signature or syntax.
2. List every parameter: type, required or optional, and the default.
3. Give one runnable example per entry.
4. Cut the narrative. The reader is scanning, not reading.

Result: a page a reader can scan to find the exact detail they came for.

---

## Improve an existing page

**Prompt:** "Make this Prisma Postgres caching guide clearer and more practical."

1. Name the page type and the one task or idea it serves. If it serves more than one, split it first.
2. Read it as the target reader and mark every place you'd get stuck.
3. Fix in priority order: broken setup first, then broken steps, then hidden limitations, then slop and tone.
4. Keep technical facts you can't confirm; flag them instead of changing them.

Result: the same content, reordered and trimmed so a reader stops getting stuck.
