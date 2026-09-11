# Jobs users come to the docs to do, and how the docs serve them today

Each job has: who, where they land, what "done" looks like, the path through the current site, and a verdict. Paths were traced in the `prisma/web` source at `wip/web/apps/docs/content/docs/` and checked against the live site on 2026-09-10. Verdicts: **green** works, **amber** works with friction, **red** fails or is missing.

## J1. Add Prisma 8 to an app I already started, with an empty database

Who: Newcomer, sometimes Upgrader. The Bun user in Discord is this job.

Done: models defined, tables created, one query returns rows, from inside the app they already have.

Path today:

- Search "prisma bun" lands on the Bun guide. It starts with `create-prisma`, so it scaffolds a new app instead of joining theirs.
- `/getting-started` offers "Add to an existing project", which goes to the existing-project PostgreSQL page. That page assumes the database already has tables: step 4 is `contract infer`. There is no branch for "empty database".
- The right three commands (`orm init`, `contract emit`, `db init`) exist only as a snippet on the CLI reference overview, under "Start in an existing project".
- Whichever page they use, the query example is wrong: the existing-project page uses `db.orm.User` (must be `db.orm.public.User` on Postgres) and `.take(2)` (removed in rc.7).
- `orm init` writes `src/prisma/db.ts`, but no getting-started page shows the file, so `import { db } from "./prisma/db"` is unexplained.
- The quickstart says scripts read `DATABASE_URL` from the environment, not `.env`; the existing-project page uses `.env` with `dotenv/config`. The two pages disagree and neither says why.
- The existing-project script calls both `db.connect()` and `db.runtime()`. The difference is explained only deep in the transactions-and-runtime reference.
- Skill files land in the repo with no mention of how to stop that.

Verdict: **red**. No page is written for this job, and the nearest page has two copy-paste errors.

## J2. Bring an existing database with data under Prisma 8, then make the next schema change

Who: Upgrader mostly, some Newcomers with a legacy database.

Done: contract matches the database, database is signed, first query works, and `migration plan` for the next change produces one small migration rather than a full recreate.

Path today: the existing-project PostgreSQL page, steps 2 to 9.

- Steps 2 to 7 are in the right order: init, connection, infer, review, emit, sign, query.
- Step 4 says "review the inferred contract" but not what to expect. Users hit `@db.*` attributes (removed in 0.17), non-`public` schemas, and a `Decimal` default that fails to emit, with no guidance.
- Step 6 signs the database but never explains what a signature is or what to do if `db sign` exits 4.
- Step 9 says "use `db update` or `migration plan`". It never mentions the `db` ref. `db sign` does not set the ref (only `db init`, `db update`, and `db migrate --advance-ref` do). With no migrations on disk and no ref, `migration plan` silently plans from an empty database and proposes recreating every table. This is the `--from` confusion reported twice in Discord.
- The upgrade guide gets this right (baseline migration, sign, `migration ref set db`, then `--advance-ref db` on each migrate), but J2 users on the existing-project page never see it.

Verdict: **red**. The page stops one step short and the missing step produces a destructive-looking plan.

## J3. Rewrite Prisma 7 queries in Prisma 8

Who: Upgrader.

Done: for every Prisma 7 call in their code, they know the Prisma 8 call or that it does not exist.

Path today:

- No single mapping page. Sixteen inline "For Prisma 7 users" diff blocks are spread across reading-data, writing-data, transactions-and-runtime, pipeline-builder, data-modeling, and eight places in the ORM reference.
- Pagination is taught as `.take()`/`.skip()` on eight pages (29 sites). Those were renamed to `.limit()`/`.offset()` in rc.7 and the old names removed.
- The bulk count mutations are taught as `createCount`/`updateCount`/`deleteCount` (31 sites on two pages). They were renamed to `createAndCount` and friends in 0.17.
- `createMany` appears on no Prisma 8 page. `createAll` and `createAndCount` are documented but nothing says they replace it. `skipDuplicates` has no equivalent and no page says so.
- `findUniqueOrThrow`, `findFirstOrThrow`, atomic `increment`/`decrement`, and case-insensitive filters have no Prisma 8 equivalent in the SQL ORM client source. No page says so.
- `$transaction([...])` is covered in one inline block. `Prisma.UserGetPayload` and the model types have no page at all; the replacements (`Models`, `Shape<>`) merged to prisma/orm `main` on 2026-09-10 (#30231, #30236) and are not in a tagged release as of rc.9.
- Accessor casing (`prisma.user` became `db.orm.public.User`) is stated once in reading-data and nowhere else.

Verdict: **red**. The answers that exist are scattered, two of them are wrong, and the missing features are not admitted.

## J4. Decide whether to move to Prisma 8 now

Who: Upgrader, also a Newcomer choosing an ORM.

Done: they know Prisma 8 is a release candidate, when GA is expected, how long 7 is supported, what `npx prisma` now installs, and how to pin 7.

Path today: the root page says "Prisma 7 remains fully supported" and shows `npx prisma@7.10.0 init`. Nothing on the site says Prisma 8 is an RC, gives a GA window, states the 12-month support commitment for 7, or explains the npm `latest` tag. Five people asked this in Discord in one week.

Verdict: **red**, and the cheapest fix on the list.

## J5. Migrate a whole Prisma 7 app incrementally

Who: Upgrader with a team and a production database.

Done: both versions run side by side, routes move one at a time, migrations hand over, Prisma 7 is removed.

Path today: `guides/upgrade-prisma-orm/postgresql` covers all five phases and is the best page on the site for the Upgrader. Getting there is the problem: the root page, `/getting-started`, and the ORM overview never link to it. The guides index lists "Upgrading: moving from Prisma 7" under "Coming as they land". In the sidebar it sits under "Upgrade Prisma ORM" as "PostgreSQL", with no "7 to 8" in the label. It is also pinned to rc.6 and rc.4 and says so in a callout.

Verdict: content **amber**, discoverability **red**.

## J6. Model my data, especially types Prisma 7 handled with `@db.*`

Who: Newcomer and Upgrader.

Done: they can write `Text`, `VarChar(100)`, `Uuid`, `Decimal`, enums, relations, and know which Prisma 7 attributes are gone.

Path today:

- The data-modeling overview has a scalar table (`String` is `Text`) and a money-in-cents recommendation. Good.
- The PSL syntax page shows `Uuid = String @db.Uuid` in its opening example and again at line 177. That syntax was removed in 0.17. Copying it fails emission.
- No page maps Prisma 7 attributes (`@db.Text`, `@db.VarChar(n)`, `@db.Decimal(p,s)`) to Prisma 8 types.
- `Decimal` defaults and money beyond "use cents" are not covered. One user asked and got no answer.
- Implicit many-to-many is honestly marked unsupported. Good.

Verdict: **amber**, with one stale example that must go.

## J7. Set up my editor

Who: Newcomer and Upgrader.

Done: syntax highlighting and formatting work for `contract.prisma`.

Path today: no page. The facts (extension is on open-vsx not the Microsoft marketplace, no bundled language server, needs the CLI installed locally, file needs `// use prisma-next` on line one) were given by Serhii in a Discord thread. The `// use prisma-next` line appears in examples but is never explained.

Verdict: **red**, missing.

## J8. Use advanced Postgres features

Who: Newcomer and Upgrader on real projects. RLS, policies, expression and functional indexes, extensions such as pg_trgm.

Done: they know whether the contract can express it, and how, or that they must manage it outside Prisma.

Path today: nothing under `orm/`. RLS is covered only through the Supabase extension in the shipped skill. One user's agent invented a contract-builder API because there was nothing to read.

Verdict: **red**, missing. Needs a product answer before a docs answer.

## J9. Name a model or result type for reuse

Who: Newcomer and Upgrader.

Done: `type User = ...` and the type of a query result, without reading `contract.d.ts`.

Path today: no page. `ResultType` for SQL builder plans is the only documented helper. The `Models` namespace and `Shape<>` (prisma/orm#30231, #30236) merged to `main` on 2026-09-10 and are not in a tagged release as of rc.9; the where-type exports (#30158) shipped in rc.9.

Verdict: **red** until the next tagged release carries `Models` and `Shape<>`, then a page is needed on release day.

## J10. Stop Prisma from writing agent files into my repo

Who: Newcomer and Upgrader, five people in one week.

Done: one config line, and they know it.

Path today: `skills: { agents: [] }` is documented on the CLI configuration page and `init --skills=none` on the init page. Neither is linked from create-prisma, the quickstarts, or the existing-project page. The advice circulating in Discord (`skills sync --disable`, an env var) is wrong. `create-prisma` has no flag.

Verdict: **amber** for docs, **red** for the tool.

## Summary

| Job | Verdict | Cheapest fix |
| --- | --- | --- |
| J1 existing app, empty DB | red | new page |
| J2 existing DB, next migration | red | add baseline and ref steps |
| J3 Prisma 7 query mapping | red | one mapping page plus rename fixes |
| J4 should I move now | red | one short page, linked from root |
| J5 incremental upgrade | amber / red | links and a nav label |
| J6 data types | amber | remove `@db.` example, add attribute map |
| J7 editor | red | new page |
| J8 advanced Postgres | red | product decision first |
| J9 types | red | page on the next tagged release |
| J10 agent files | amber | one line on three pages |
