# Fact re-check: `orm/supported-versions.mdx` (2026-10-22, Opus)

Sources: npm (`npm view ... engines type peerDependencies peerDependenciesMeta`), prisma/orm `origin/main` (which may be newer than the published `prisma` 8.0.0-rc.25 and the rc.19 libraries), local `node` 24.13.0, `bun` 1.3.13, `deno` 2.6.10, and the two linked docs pages.

## Corrected

| Claim | Source | New text |
| --- | --- | --- |
| `DateTime` is `Temporal.Instant` on every database | `postgres/1-target/src/core/type-constructors.ts:50-54` (`pg/timestamptz-temporal@1`); `mongo/1-target/src/core/prisma6-binding.ts:30` and `codecs.ts:132` (MongoDB returns the wire `Date`) | "On PostgreSQL, Prisma ORM 8 reads and writes a `DateTime` field as a `Temporal.Instant`, not a `Date`. On MongoDB, a `DateTime` field is still a `Date`." |
| `Temporal` is built into Node.js 26 and later | `skills/prisma-8/references/contract.md:120`: 26.8.2 and later ship it; 26.8.1 and earlier do not | "built into Node.js 26.8.2 and later. Node.js 22 and 24, Node.js 26 before 26.8.2, Bun, and Deno do not have it today" |
| metaDescription: polyfill on Node.js 22 and 24 | same | "the Temporal polyfill for PostgreSQL on Node.js 22 and 24" |
| For an existing `tsconfig.json`, `orm init` changes only `module` and `moduleResolution` | `cli/src/commands/init/templates/tsconfig.ts:23-27, 113-125`: also sets `resolveJsonModule` and adds `node` to `types` | "sets `module`, `moduleResolution`, and `resolveJsonModule` to those values, adds `node` to `types`, and keeps your other settings" |
| `orm init` adds `"type": "module"` | `cli/src/commands/init/hygiene-package-scripts.ts:160-166` with `init-scaffold.ts:144-147`: a `package.json` with non-empty `dependencies` and no `"type"` is left alone with a warning | "which `npx prisma orm init` adds when `package.json` lists no `dependencies` yet" |

## Confirmed

Node.js `^22.18.0 || ^24.11.0 || >=26.0.0` (`prisma`, `create-prisma`, `@prisma/composer` engines); Bun `>=1.3.0` (`create-prisma` engines); npm, pnpm, Bun, Yarn 4.10 (`create-prisma.mdx:22`, create-prisma README); no `Temporal` on node 24.13.0, bun 1.3.13, deno 2.6.10; `npm install temporal-polyfill` and the import line (`contract.md:120`; `temporal-polyfill ^1.0.4` is a peer of `@prisma/orm-postgres`); `src/prisma/db.ts` (`init-scaffold.ts:237`, `config-types.ts:45`); `RUNTIME.TEMPORAL_UNAVAILABLE` (`postgres/1-target/src/core/errors.ts:27`, `require-temporal.ts:22`); PostgreSQL 15 and MongoDB 8.0 (`prismaNext.minServerVersion`); `pg` 8.22.0 is a dependency of `@prisma/orm-postgres`; `mongodb ^7.0.0` is a peer of `@prisma/orm-mongo`; npm 7+ and pnpm (`auto-install-peers: true`) install peers; no `@prisma/orm-{mysql,mariadb,sqlserver,mssql,cockroachdb}` on npm; TypeScript `>=5.9` optional peer (`MIN_TYPESCRIPT_PEER`); the tsconfig template; `"type": "module"` on all six packages; `prisma` in `devDependencies` (`cli/orm-init.mdx:52`); all seven links and both anchors.

## Q, left as written, with the decision

1. "24 is recommended": no source in prisma/orm. Kept, because every quickstart page says it (#8441).
2. Deno 2.6 and "experimental": the only 2.6 source is the Deno guide's scaffold flag; "experimental" is Will's label (C18, 2026-09-28). Kept.
3. SQLite "experimental": only `orm/supported-databases.mdx` says it. Kept; same decision.
4. "Each replaces `@prisma/client` and its driver adapter": npm says only "the one package a Postgres application installs". Changed to "the one package your app installs for its database, in place of `@prisma/client`".
5. "`require` works on every supported Node.js version": the init warning says only "CommonJS code can require it". The version clause is removed.

## Follow-up done in the same PR

`cli/orm-init.mdx:62-63` said `"type": "module"` is added whenever the field is missing, and omitted that `node` is added to `types`. Both corrected from the source lines above.

## Correction on 2026-10-22, after the CodeRabbit review of prisma/web#8572

The "Node.js 26.8.2" claim from `skills/prisma-8/references/contract.md:120` is wrong for the official binaries: `mise exec node@26.0.0 -- node -p "typeof Temporal"` prints `object`, as does 26.8.2. Bun 1.4.0 prints `object` and 1.3.14 `undefined` (`npx bun@<version> -p`); Deno 2.7.1 prints `object` and 2.6.10 `undefined` (`npx deno@<version> eval`). The page now says Node.js 26, Bun 1.4, and Deno 2.7, with a probe per runtime. `RUNTIME.TEMPORAL_UNAVAILABLE` is raised by `requireTemporal` in `temporal-codec-helpers.ts` (decode) and `date-time-now-generators.ts` (`now()` defaults) at rc.20, not when an existing `Temporal` value is written; the page's sentence was scoped to match.
