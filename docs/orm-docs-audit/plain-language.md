# Plain language: the rule for every page

The reader is an ordinary developer who has used Prisma ORM before and has never seen the Prisma ORM 8 source code. Every sentence must be one they could restate in their own words on first reading. This is the largest complaint about the current docs and it overrides any other style preference.

## The rule

1. Say what the reader does and what happens. Not what the system is.
2. One idea per sentence. If a sentence needs a parenthetical, split it.
3. Use the reader's words for things: "the command-line tool", "the library your app imports", "your schema file", "the call that runs the query", "an error with a code".
4. A term from the source code may appear on a page only if the docs glossary already defines it for readers, or the sentence that first uses it says what it means in plain words. Otherwise use the plain words and drop the term.
5. Explain a mechanism only when the reader needs it to act. If they do not, cut it.
6. No sentence is finished if the reader has to guess what a word refers to.

## Banned words and their replacements

These come from `packages/` and the release notes and mean nothing to readers. Do not use them in prose; the replacement is the meaning.

| Do not write | Write |
| --- | --- |
| terminal, terminal call, terminal method | the call that runs the query (`.all()`, `.first()`, `.create(...)`) |
| codec | how the value is stored and read; or just name the type |
| envelope, structured envelope, structured error | an error with a code (`RUNTIME.NO_ROWS`) |
| type position, "in type position" | written as the type (`VarChar(255)` instead of `@db.VarChar(255)`) |
| runtime (as a noun for the library) | the library your app imports; or `db` |
| release line, release cycle, runs ahead | released separately, on its own schedule |
| lane (SQL lane, raw lane) | the raw SQL API; the query builder |
| facade | the client; `postgres(...)` |
| junction model, join model | the model for the join table |
| plan, query plan | the query, before it runs; or the built query |
| emit, emitted artifacts (unexplained) | `prisma contract emit` writes `contract.json` and `contract.d.ts` |
| signature, marker (unexplained) | the record in the database of which contract it matches |
| ref (unexplained) | a named pointer to a migration state; explain on first use |
| capability | which database features the contract needs |
| buffers, buffered, materializes | loads every row into memory first |
| surface, API surface | the methods; the commands |
| lowered, lowering | turned into SQL |
| namespace-qualified, namespace coordinate | `db.orm.public.User` (`public` is the PostgreSQL schema) |
| reducer, refinement callback | a way to count or sum related records; a way to filter related records |
| dotted codes | a code such as `RUNTIME.NO_ROWS` |
| envelope config, CLI envelope | the config file |
| dev loop | while you are iterating |
| brownfield, greenfield | an existing database; a new project |
| deterministic | the same input always produces the same output |
| idempotent | safe to run more than once |
| topology, graph (for migrations, unexplained) | the chain of migrations |

Also banned: "unblocks", "surfaces", "carries", "wires up", "sits", "lives at" (say "is at"), "spells", "hands back", "rides on", "routes on", "keys on", "the shape", "story" (as in "the `DATABASE_URL` story").

## Sentence shapes to avoid

- A noun with three or more modifiers: "per-request cursor-enabled serverless facade".
- "X, so Y, which Z": three claims chained; split.
- A caveat in parentheses mid-sentence; make it its own sentence or cut it.
- Passive voice for what the reader does: "the version is pinned" becomes "lock the version".
- Starting with the mechanism: "Because emit is deterministic, hashing..." becomes what the reader sees.

## Process

1. Write the page from the facts.
2. Fact review against the source (as today).
3. Reader review: an agent with the persona above and only this file reads the page and marks every sentence it cannot restate and every word it had to guess. Fix every mark. Repeat until clean.
4. Run `check-plain.sh` on the changed files before pushing.
5. Will does the final pass.
