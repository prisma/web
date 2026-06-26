# docs-writer

How to write Prisma documentation a developer can follow without getting stuck. Read this before you write or edit a page in `apps/docs` or `apps/blog`.

## Writing style in one minute

You don't have to read the whole guide to contribute. Follow these and your page is already most of the way there:

1. **One page, one task.** Pick a single thing the reader will accomplish. Split anything bigger.
2. **Say what, then why, then how.** Before every command, one sentence on what it does and why it matters.
3. **Show one real example,** not a list of every option. Use real code that runs as written.
4. **Give a way to verify.** End with a command the reader runs to confirm it worked, and the output they should see.
5. **Name the products precisely.** Prisma Postgres, Prisma Compute, Prisma Next. Show how they connect, don't describe each in isolation.
6. **Cut the hype.** No "powerful", "seamless", "unlock". The reader already chose Prisma; they want it to work.

That's the whole philosophy. `SKILL.md` is the detailed version.

## The products you're documenting

- **Prisma Postgres**: managed PostgreSQL in the Prisma platform.
- **Prisma Compute**: serverless TypeScript hosting that runs next to Prisma Postgres.
- **Prisma Next**: the TypeScript-native Prisma ORM (schema, client, migrations).

They're designed to work together: an app on Prisma Compute queries Prisma Postgres through Prisma Next. Make that connection the spine of a page, not a footnote.

## Using it

- **With Claude Code:** the guide loads as a skill automatically. Ask it to "write a how-to for X" or "make this page clearer."
- **Without Claude Code:** read [`SKILL.md`](SKILL.md) as a checklist while you write, and [`references/how-to-use.md`](references/how-to-use.md) for a worked example of each page type.
