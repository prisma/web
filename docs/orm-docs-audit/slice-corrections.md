# The corrections slice: what shipped, and the decisions behind it

Before any restructure, every factual error on the published Prisma ORM 8 pages was fixed in place. Three PRs to `prisma/web`, each reviewed independently against the rc.9 source, each commit citing the line it was verified against:

| PR | What | Size |
|---|---|---|
| #8236 | Names, flags, paths, codes, and printed output that no longer exist at rc.9, replaced by the form that does | 40 files, merged 2026-09-10 |
| #8237 | Pages whose explanations were wrong (the `db` ref, middleware, raw SQL, relations, aggregates, the existing-project pages) | 31 files, merged 2026-09-11 |
| #8238 | Facts on the getting-started pages and guides (Node floor, MongoDB replica set, create-prisma flags and scripts, the skills page, the tutorial, streaming, `npm create prisma@latest`) | 32 files, open as of 2026-09-11 |

Out of scope by design: the sixteen Prisma 7 guides under Prisma ORM 8 paths (A7, since landed as #8242), new content (C), the agent skill (D14), the monorepo docs (D17), and the "Prisma 8" to "Prisma ORM" rename.

## Four decisions taken along the way

1. **Agent files.** The scaffold pages carry one line saying Prisma writes skill files for coding agents and that `skills: { agents: [] }` in `prisma.config.ts` stops it. That is the only correct answer until create-prisma grows an opt-out flag (D3), at which point the line is replaced.
2. **Node floor.** The site says "Node.js 22.18 or newer (on the 24 line, 24.11 or newer); 24 recommended". Checked by running rc.9 end to end (`contract emit`, `db init`, ORM create and read, `for await`, SQL builder) under Node 22.12.0, 22.18.0, and 22.22.3: all pass. Node 22 is Maintenance LTS until 2027-04-30; 23 reached end of life 2025-06-01; 24 is Active LTS until 2028-04-30. The `prisma` CLI and create-prisma both declare `>=22.18.0`; only the `package.json` create-prisma writes into a project narrows to `^22.18.0 || >=24.11.0`, which is why the 24 sub-range is stated. The monorepo's `docs/Supported Versions.md` says 24 and is wrong about what runs.
3. **Streaming.** The reading-data page promised that `for await` streams rows with a flat memory footprint. It does not on `postgres()`: the facade creates its driver with `cursor: { disabled: true }`, so the whole result is fetched before iteration and only decoding is per row. Measured on a 400,006-row table under Node 22.18: `for await` that breaks after the first row took 186 ms and grew the heap by 64 MB (every row fetched), against 824 ms for `await ...all()` (fetch plus decode). The page now says what happens and points large-result readers at `limit()` or the serverless facade, which reads through a cursor in batches of 100. Whether `postgres()` should expose cursors is D8.
4. **The `--db` quirk.** `db init` and `db update` advance the `db` ref only when the URL comes from config; with `--db` they do not unless `--advance-ref db` is also passed. Documented as-is, with the flag shown on every dev-loop example that passes `--db`; deploy and CI examples are left without it on purpose. Whether the rule should change is D9.

## Two audit claims the source overruled

Left as the pages had them: `migration plan` can raise `MIGRATION.NO_TARGET` after a rollback cycle (the planner does resolve a leaf), and `min` / `max` over a `DateTime` column type-checks at rc.9 (there is no `pg/timestamptz@1` codec; `DateTime` is the temporal codec, which `min`/`max` accept).
