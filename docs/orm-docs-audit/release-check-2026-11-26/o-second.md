# Release check: inventory entries O25 to O45

Checked against `@prisma/orm-*` 8.0.0-rc.25 (tag `v8.0.0-rc.25` in prisma/orm) and `prisma` 8.0.0-rc.35, both installed from npm into `wip/release-check/o-second/proj/`. Docs are `origin/main` at `6c765c503`; line numbers below are from that commit. Reproductions ran on Homebrew PostgreSQL 15 (port 54351, now stopped). No MongoDB server was available, so the MongoDB entries were checked by type-checking against the published packages, by building queries without running them, and by reading the code.

## Summary

| Entry | Verdict | Docs change |
| --- | --- | --- |
| O25 `--from-prisma7-schema` refuses extension datasources | still present | none |
| O26 Temporal polyfill is a manual step | partly fixed (fixed before the audit; the rest still present) | none |
| O27 cache middleware caches nothing on MongoDB | still present | none |
| O28 `params` typed optional in `beforeEncode` | still present | none |
| O29 `db.runtime()` a promise on MongoDB only; `runtime.close()` | still present | none |
| O30 `MutationUpdateInput` not exported | **fixed in the release** | `orm/fundamentals/types.mdx` |
| O31 `nanoid()` / `uuid()` refused on a MongoDB `String` | still present | none |
| O32 MongoDB `select()` does not narrow the type | still present | none |
| O33 MongoDB variant updates need `@ts-expect-error` | still present | none |
| O34 MongoDB dot-path `where()` needs a cast | still present | none |
| O35 pipeline builder `_id`, `toObjectId`, "root" | still present | none |
| O36 inputs the ORM accepts and then ignores | still present, **but two sentences about `update()` are now wrong** | `orm/reference/orm-client.mdx:1336, 1340` |
| O37 a second copy of the ORM is not detected | still present | none |
| O38 MySQL `upsert` and unlisted unique indexes | still present | none |
| O39 Supabase extension contract fits one version | still present | none |
| O40 Prisma 6 and 7 schema readers | still present | none |
| O41 Vite plugin prints a failure it recovers from | still present | none |
| O42 `db migrate` prints a tab-separated line | still present | none |
| O43 pool needs the exact `pg` and `@types/pg` versions | already removed from the docs (fixed in rc.25) | none |
| O44 `contract format` and the editor disagree on line endings | still present | none |
| O45 error that does not name the column | still present | none |

## O25. `orm init --from-prisma7-schema` refuses extension datasources after a partial install

- **Verdict:** still present.
- **Evidence:** the passage is still at `guides/upgrade-prisma-orm/postgresql-incremental.mdx:62`. At the tag, `createPrisma7SourceCheck` in `packages/1-framework/3-tooling/cli/src/orm/init-prisma7-check.ts` builds the config with `defineConfig({ contract: prisma7Schema(schemaPath), output })` and no `extensions`. So the Prisma 7 reader raises `PSL.PRISMA7_EXTENSION_PACK_MISSING` (in `contract-prisma7/src/extensions.ts`) for `citext`, `vector`, `postgis` or `pg_search`, and init throws `CLI.INIT_PRISMA7_SCHEMA_REFUSED`. The check runs after the install of the target package, `dotenv` and `pg` (`init.ts:248-252`; the Postgres contribution's `peerPackages` is `['pg']`). This matches the docs sentence. No commit between rc.22 and rc.25 changes the check or the extension reader.

## O26. The Temporal polyfill is a manual step

- **Verdict:** partly fixed, but the fixed part was fixed and removed from the docs before the audit. The remaining part is still present.
- **Evidence:**
  - Fixed earlier: `contract infer` and the Prisma 7 route now map timestamps to the convenience types, which read a JavaScript `Date` and need no `Temporal` (since rc.15; `cli/contract-infer.mdx:73` already says so). The pages listed in the inventory no longer tell every reader to install the polyfill. They tell only readers of `as: temporal` fields to install it (for example `orm/coming-from-prisma-orm-7.mdx:116-124`, `orm/supported-versions.mdx:21-30`). That is the deliberate runtime requirement, not a workaround.
  - Still present: `temporal-polyfill` is still a required peer dependency of `@prisma/orm-postgres`, `@prisma/orm-mongo` and both `@prisma/orm-target-*` packages at rc.25 (`peerDependencies: { "temporal-polyfill": "^1.0.8" }`, not optional). Each target's control entry imports `temporal-polyfill/full/implementation` at load time (for example `packages/3-targets/postgres/1-target/src/exports/control.ts:9`), so a project without it cannot emit. `orm init` installs only the target package, `dotenv` and the driver (`init.ts:248-252`; `peerPackages` is `['pg']` or `['mongodb']`), so with Yarn or npm's `legacy-peer-deps` the emit step of `orm init` still fails. The Yarn passages are still needed: `guides/switch-to-prisma-orm/from-mongoose.mdx:27`, `guides/upgrade-prisma-orm/mongodb.mdx:20, 173`, `(index)/prisma-orm/from-scratch.mdx:48`, `orm/release-status.mdx:45`, `orm/data-modeling/mongodb.mdx:71`.
  - Note: prisma/orm#31077 (in rc.25) records the decision that Prisma 8 "is not a package manager and does not second-guess one". That may mean the remaining part is now intended. Whoever owns the inventory should decide whether this entry stays a defect.

## O27. The cache middleware registers on MongoDB but caches nothing

- **Verdict:** still present.
- **Evidence:** passages still at `orm/middleware/built-in-cache.mdx:41`, `orm/middleware/how-middleware-works.mdx:312`, `orm/supported-databases.mdx:72`. The last change to `packages/3-extensions/middleware-cache/src` is prisma/orm#30822 (before rc.24). The middleware is still a `CrossFamilyMiddleware` with no family check. Nothing in `packages/2-mongo-family` mentions annotations, so a MongoDB read still cannot opt in.

## O28. A guard exists only because `params` is typed optional

- **Verdict:** still present.
- **Evidence:** passages still at `orm/middleware/how-middleware-works.mdx:217, 221` and `orm/middleware/authoring-custom-middleware.mdx:445, 449`. At the tag the hook is still `beforeEncode?(draft, ctx, params?: TMutator)` in `framework-components/src/execution/runtime-middleware.ts:188`, and `params?: SqlParamRefMutator<…>` in `2-sql-family/5-runtime/src/middleware/sql-middleware.ts:72`.

## O29. `db.runtime()` is a promise on MongoDB only; `runtime.close()` leaves the client half open

- **Verdict:** still present.
- **Evidence:** the passages are still on the listed pages (for example `orm/reference/transactions-and-runtime.mdx:432, 473`, `orm/reference/pipeline-builder.mdx:135`, `orm/reference/index.mdx:43`). At the tag, `packages/3-targets/mongo/9-facade/src/runtime/mongo.ts:48` still declares `runtime(): Promise<MongoRuntime>`. The client's `closed` flag is set only by `db.close()` (`mongo.ts:230-236`). Closing the runtime directly does not set it, so `db.runtime()` keeps handing out the closed runtime.

## O30. `MutationUpdateInput` is not exported

- **Verdict:** fixed in the release.
- **Evidence:** prisma/orm#30611 ("export MutationUpdateInput from the orm-client entrypoint"), merged 2026-11-16 after the rc.24 tag and included in rc.25. The published `@prisma/orm-family-sql/dist/orm-client.d.mts` exports `type MutationUpdateInput`, and `@prisma/orm-postgres/orm-client` re-exports it (`export * from "@prisma/orm-family-sql/orm-client"`). At the tag, `update()` takes `MutationUpdateInput<TContract, ModelName, NsId>` (`sql-orm-client/src/collection.ts:2397-2400`). It combines the scalar fields and the relation callbacks. Reproduction: this type-checks and runs on rc.25:

  ```ts
  import type { MutationUpdateInput } from "@prisma/orm-postgres/orm-client";
  function updateUser(id: number, data: MutationUpdateInput<Contract, "User">) {
    return db.orm.public.User.where({ id }).update(data);
  }
  await updateUser(u.id, { name: "Ada", posts: (p) => p.create([{ title: "Hello" }]) });
  // -> name 'Ada', and one Post { authorId: 1, title: 'Hello' } created
  ```

- **Docs change needed:** `orm/fundamentals/types.mdx`.
  - Line 133: "`ScalarUpdateInput` is the scalar fields `update()` takes, each one optional. It does not include relation changes such as `connect`, and no exported type does yet, so pass relation changes in a separate argument of your function and write them where you call `update()`." Should become, roughly: "`MutationUpdateInput` is what `update()` takes: each scalar field, optional, and relation changes such as `posts: (p) => p.create([...])`. `ScalarUpdateInput` is the scalar fields only."
  - The example at lines 108-121 imports `ScalarUpdateInput` and types `updateUser`'s `data` with it. Switch it to `MutationUpdateInput<Contract, "User">`, or keep both and show one of each.
  - Line 166, table row: "`Prisma.UserUpdateInput` | `ScalarUpdateInput<Contract, "User">`, for scalar fields". Should become `MutationUpdateInput<Contract, "User">`.

## O31. `nanoid()` and `uuid()` are refused on a MongoDB `String` field

- **Verdict:** still present.
- **Evidence:** passage still at `orm/fundamentals/writing-data.mdx:144`. Reproduction with `prisma` rc.35 and `@prisma/orm-mongo` rc.25, on a model with `id String @id @map("_id") @onCreate(nanoid())`:

  ```text
  ✘ [CONTRACT.SOURCE_DIAGNOSTIC] prisma/contract.prisma:3:41 PSL_UNKNOWN_GENERATOR_FUNCTION: Field "Thing.id": unknown generator function "nanoid". No generator function applies to this codec.
  ✘ [CONTRACT.SOURCE_DIAGNOSTIC] prisma/contract.prisma:8:41 PSL_UNKNOWN_GENERATOR_FUNCTION: Field "Other.id": unknown generator function "uuid". No generator function applies to this codec.
  ```

## O32. MongoDB `select()` does not narrow the result type

- **Verdict:** still present.
- **Evidence:** passages still at `orm/fundamentals/reading-data.mdx:258` and `orm/reference/orm-client.mdx:363`. Using the MongoDB example contract from `orm-client.mdx`, `const u = await db.orm.users.select("name").first(); const e: string | undefined = u?.email;` type-checks with no error on rc.25.

## O33. MongoDB variant updates need `@ts-expect-error`

- **Verdict:** still present.
- **Evidence:** passages still at `orm/reference/orm-client.mdx:1329-1333, 2337, 2357-2370`. tsc on rc.25:

  ```text
  .variant("tutorial")…update((u) => [u.duration.inc(10)])
  error TS2339: Property 'duration' does not exist on type 'FieldAccessor<Contract, "Post", CodecTypes>'.
  .variant("tutorial")…update({ duration: 5 })
  error TS2769: … 'duration' does not exist in type 'Partial<{ authorId: string; content: string; createdAt: Date; id: string; kind: string; title: string; }>'
  ```

## O34. A MongoDB dot-path `where()` needs a cast

- **Verdict:** still present.
- **Evidence:** passages still at `orm/reference/orm-client.mdx:2300` and the cast example after it. tsc on rc.25 for `db.orm.users.where({ "address.city": "San Francisco" })`: `error TS2769 … '"address.city"' does not exist in type 'MongoWhereFilter<Contract, "User", CodecTypes>'`.

## O35. The pipeline builder's `_id` filters, `toObjectId` and result types

- **Verdict:** still present.
- **Evidence:** the passages are still at `orm/reference/pipeline-builder.mdx:95, 140, 210-222, 382, 940, 1099` and `guides/upgrade-prisma-orm/mongodb.mdx:386`. Since rc.22, the only change to `packages/2-mongo-family/5-query-builders/query-builder` is prisma/orm#31173 (reserved names). On rc.25:
  - `f._id.eq("507f1f77bcf86cd799439011")` type-checks and builds a match whose value is the plain string, with no codec (`{"field":"_id","op":"$eq","value":"507f…"}`). Nothing turns it into an `ObjectId`. A bare `new ObjectId(...)` is refused by the types (`'ObjectId' is not assignable to parameter of type 'MongoValue'`), and `new MongoParamRef(new ObjectId(...))` type-checks, as the docs say. I did not run the query against a server, because no MongoDB server was available.
  - `fn.toObjectId(fn.literal("507f…"))` throws `TypeError: Cannot read properties of undefined (reading 'codecId')`.
  - `db.query.from("nope")` throws `ORM.MODEL_UNKNOWN` with `Unknown root: "nope". Valid roots: posts, users`.
  - I checked the `findOneAndUpdate()` typing and the decoding rules (lines 140, 382, 1099) only by finding no change to that code since rc.22.

## O36. Inputs the ORM accepts and then silently ignores or rejects late

- **Verdict:** still present, every item. But the `update()` behaviour changed: it now returns the unchanged row, not `null`, so two sentences on `orm-client.mdx` are now wrong.
- **Evidence** (PostgreSQL 15, rc.25):

  ```text
  update(fn)                     -> {"email":"a@x.io","id":2,"meta":null,"name":"A"}   (row unchanged, no error)
  update({})                     -> { email: …, id: 4, isAdmin: false, meta: null, name: 'E' }   (row, not null)
  cursor() without orderBy()     -> both rows returned (cursor ignored)
  Tag.where({label:'js'}).upsert({create:{label:'ts'}, update:{uses:5}, conflictOn:{label:'zzz-not-the-value'}})
                                 -> {"id":1,"label":"ts","uses":5}   (where ignored; conflictOn value ignored)
  where({ meta: { a: 1 } }) on Json  -> compiles, throws ORM.FILTER_UNSUPPORTED at run time
  fns.raw`now()`.returns("pg/timestamptz@1") in select()
                                 -> type-checks; [ { ts: '2026-11-26 20:34:30.780103+11' } ]  (raw text, no error)
  ```

  - `outerFullJoin()` on MySQL: there is still no type check. The MySQL renderer throws at run time (`3-targets/mysql/1-mysql/2-adapter/src/core/sql-renderer.ts:789-790`). I did not run MySQL.
  - `supabase(...)` still passes `{ kind: 'pgPool', pool }` to the shared Postgres binding check, which checks only that the pool is an object (`3-extensions/supabase/src/runtime/supabase.ts:266-305`).
  - Side note: `db.raw.sql\`…\`.returns("pg/timestamptz@1")` used as a fragment is now refused by TypeScript. `fns.raw`, which the docs describe, is not.
- **Docs change needed:** `orm/reference/orm-client.mdx`, in the `update()` remarks.
  - Line 1336: "Take care on PostgreSQL: `update()` takes an object of field values only, and passing a function instead writes nothing, reports nothing, and returns `null`." Should become: "… passing a function instead writes nothing and reports nothing: `update()` returns the matched row unchanged."
  - Line 1340: "Returns `null` when no row matches. On PostgreSQL it also returns `null` when the object you pass is empty and has no keys at all. An object whose values already match the row is different: that update runs and returns the row." Should become: "Returns `null` when no row matches. On PostgreSQL an empty object changes nothing and returns the matched row." Drop the "is different" sentence.
  - Neither sentence is a workaround that can go. They are now false statements of behaviour. Which change caused it is unconfirmed; it is most likely one of the nested-update pull requests (prisma/orm#31096, #31100), which moved `update()` onto `MutationUpdateInput` and `parseMutationInput`.

## O37. A second copy of the ORM is not detected

- **Verdict:** still present.
- **Evidence:** passages still at `orm/release-status.mdx:45` and `orm/reference/error-reference.mdx:1428`. The current error-reference text already says that `RUNTIME.MULTIPLE_ORM_COPIES` was raised in rc.22 and later removed on purpose, because hosts such as Prisma Composer's boot wrapper load the ORM twice. No detection exists at the tag. A fix would have to be a warning, not a refusal.

## O38. MySQL `upsert` returns the wrong row on a collision with an unlisted index

- **Verdict:** still present.
- **Evidence:** the passage moved to `orm/supported-databases.mdx:39` (it was at line 31). No commit to `packages/3-targets/mysql` between rc.22 and rc.25 touches upsert. The only `ON DUPLICATE KEY` code is unchanged, and nothing detects a collision on an index the contract does not list. Not reproduced; MySQL was not run.

## O39. The Supabase extension's contract fits one Supabase version, and cannot be removed

- **Verdict:** still present.
- **Evidence:** passages still at `orm/extensions/using-extensions.mdx:268` and `guides/switch-to-prisma-postgres/from-supabase.mdx:17`. Commits to `packages/3-extensions/supabase` between rc.22 and rc.25 are about transactions, pools and messages. None changes the extension's contract or adds a way to remove it.

## O40. The Prisma 6 and 7 schema readers

- **Verdict:** still present.
- **Evidence:** passages still at `guides/upgrade-prisma-orm/postgresql.mdx:386` and `guides/upgrade-prisma-orm/mongodb.mdx:154-164, 215, 250`. At the tag:
  - The `contract-prisma7` README (lines 41, 86, 92) still says that `@unique` and `@@unique` become unique indexes, not constraints.
  - `contract-prisma6/src/interpreter.ts:1307` still refuses `onDelete` and `onUpdate`, so a valid Prisma 6 self-relation that needs `NoAction` cannot be read.
  - `prisma6-side-by-side.ts` has no `postinstall`.
  - None of the three areas changed between rc.22 and rc.25, apart from prisma/orm#31093 and #31173, which do not touch these behaviours.

## O41. The Vite plugin prints a failure it then recovers from

- **Verdict:** still present.
- **Evidence:** passage still at `guides/frameworks/tanstack-start.mdx:146`. At the tag, `vite-plugin-contract-emit/src/plugin.ts:256` still calls `logError('Failed to load config module graph root:', error)` when `ssrLoadModule` fails on the config, and the plugin goes on. The plugin has had no behaviour change since rc.22.

## O42. `db migrate` prints a tab-separated machine line when there is no terminal

- **Verdict:** still present.
- **Evidence:** passage still at `guides/deployment/turborepo.mdx:386`. Reproduction with `prisma` rc.35 and stdout redirected to a file:

  ```text
  --- stdout:
  app<TAB>20261126T0936_add_note2<TAB>f5f108e2…<TAB>84d4915c…<TAB>1
  --- stderr:
  ✔ Applied 1 migration(s) (1 operation(s)) across 1 contract space(s)
  …
  ```

  `migration status` prints the same kind of lines. This looks like deliberate output for scripts (data on stdout, people's messages on stderr). Whether it counts as a defect is for the inventory owner to judge.

## O43. A pool you create needs the exact `pg` and `@types/pg` versions the ORM pins

- **Verdict:** already removed from the docs. The release fixed it as well.
- **Evidence:** prisma/orm#31060 ("declare pg and @types/pg as peer dependencies"), in rc.25. The published `@prisma/orm-postgres` 8.0.0-rc.25 has `peerDependencies` `pg: ^8.22.0` and `@types/pg: ^8.20.0`, and no `pg` dependency of its own. `guides/deployment/vercel.mdx:123-130` now says to install `pg` and `@types/pg` as peers, and mentions the old behaviour only as "Before `8.0.0-rc.25`…". The pinned versions `pg@8.22.0` and `@types/pg@8.20.4` are gone.

## O44. `contract format` and the editor extension disagree on line endings

- **Verdict:** still present.
- **Evidence:** passages still at `cli/configuration.mdx:279` and `orm/contract-authoring/editor-support.mdx:34`. At the tag, the CLI's `control-api/operations/format.ts:101,116` defaults to the operating system's `EOL` when `formatter.newline` is unset. The language server's `project.ts:296` calls `resolveFormatOptions(data.formatter)`, which defaults to `'\n'` (`psl-parser/src/format/options.ts:32`).

## O45. An error that does not name the column

- **Verdict:** still present.
- **Evidence:** passage still at `orm/migrations/editing-a-migration.mdx:173`. Reproduction on rc.25: plan `--delete User.isAdmin --backfill User.role`, then fill the backfill with a `db` built from the end contract, reading `isAdmin` (TypeScript check bypassed with a cast, as `node` strips types), and run `node migrations/app/…_replace_is_admin/migration.ts`:

  ```text
  RUNTIME.PARAM_REF_CODEC_REQUIRED: Cannot construct a ParamRef for a undefined value without an explicit codec. Provide a CodecRef at the call site or use a column-bound builder path.
  ```

  The message does not name `isAdmin`.

## Something else I noticed

The scratch project is inside the prisma/web worktree. There, `prisma contract emit`, even with `--config ./prisma.config.ts`, loaded the worktree's root `prisma.config.ts` and not the one in the current directory. It found the right file only once the scratch folder was its own git repository (`git init`). The CLI seems to resolve the project root, and `--config`, from the git root. This falls outside O25 to O45 (it belongs to prisma/prisma-cli). It may surprise anyone who tries a scratch project inside another repository.
