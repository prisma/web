# Slice: the Supported versions page

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`. Item C18 of `changes.md`, decided by Will on 2026-09-28. Written 2026-10-22 by `seacole-52`.)_

## At a glance

No page states every version Prisma ORM 8 needs. The Node.js range and TypeScript floor are on Release status, the Deno floor is on the Deno guide, the Bun guide says 1.1 when create-prisma refuses anything below 1.3, and the PostgreSQL and MongoDB floors are on no page. After this slice one page, `/orm/supported-versions`, states them all, every quickstart links it from its prerequisites, and the Bun guide agrees with it.

## The facts, each checked on 2026-10-22

| What | Floor | Where it is declared |
| --- | --- | --- |
| Node.js | `^22.18.0 \|\| ^24.11.0 \|\| >=26.0.0` | `engines` of `prisma@8.0.0-rc.25`, `create-prisma@0.14.3`, `@prisma/composer@0.33.0` |
| Bun | 1.3 | `engines.bun` of `create-prisma@0.14.3` (`>=1.3.0`) |
| Deno | 2.6, experimental | `guides/runtimes/deno.mdx`: the scaffold passes `--minimum-dependency-age=0`, which earlier releases reject; Will's decision marks Deno experimental |
| PostgreSQL | 15 | `prismaNext.minServerVersion` in `packages/3-targets/3-targets/postgres/package.json` on prisma/orm main; ADR 248 lowered it from 17 |
| MongoDB | 8.0 | `prismaNext.minServerVersion` in `packages/3-mongo-target/1-mongo-target/package.json` |
| TypeScript | 5.9, optional | `peerDependencies.typescript: ">=5.9"` with `peerDependenciesMeta.typescript.optional: true` on `@prisma/orm-postgres@8.0.0-rc.19`, `-mongo`, `-sqlite`; `MIN_TYPESCRIPT_PEER` in `scripts/validate-typescript-peer.mjs` |
| `mongodb` driver | 7 | `peerDependencies.mongodb: "^7.0.0"` on `@prisma/orm-mongo` |
| `temporal-polyfill` | 1.0.4, required peer on Node.js 22 and 24 | `peerDependencies` on `@prisma/orm-postgres`; `Temporal` is built into Node.js 26 |
| Module system | ES modules only | `"type": "module"` on every published package; `cli/orm-init.mdx` covers a CommonJS project |
| `tsconfig.json` | `module: "preserve"`, `moduleResolution: "bundler"`, `strict: true`, `target: "ES2022"` | `cli/src/commands/init/templates/tsconfig.ts` on prisma/orm main, which `orm init` writes |

Not true any more, so not on the page: prisma/orm's `docs/Supported Versions.md` says Node.js 24, Bun 1.2, Deno 2.0, and a `--merge-tsconfig` flag; the flag does not exist in the CLI source.

## Chosen design

All paths are under `apps/docs/content/docs/`. Do not touch `v6/` or `v7/` folders.

- New page `orm/supported-versions.mdx` at `/orm/supported-versions`, in the ORM sidebar's Introduction after Supported databases. Sections: a table of runtimes, a table of databases, TypeScript and `tsconfig.json`, ES modules only (one sentence and the link to `cli/orm-init.mdx` for CommonJS), the Node.js 22 and 24 `temporal-polyfill` requirement, the date the versions were checked, and how to check your own versions (`node --version`, `psql --version` or `SELECT version()`, `mongod --version`, `npx tsc --version`).
- `(index)/prisma-orm/meta.json` gets a `[Supported versions](/orm/supported-versions)` link entry after Supported databases, so the Getting started sidebar lists it.
- `orm/release-status.mdx` keeps its requirement sentence and gains a link to the page.
- Every quickstart and starting-point page that states the Node.js range in its prerequisites links the page once, in the same sentence or bullet: `quickstart/postgresql`, `quickstart/mongodb`, `quickstart/existing-app/postgresql`, `quickstart/existing-app/mongodb`, `add-to-existing-project/postgresql`, `add-to-existing-project/mongodb`, `from-scratch`, `create-prisma`.
- `guides/runtimes/bun.mdx`: Bun 1.1 becomes 1.3.
- `orm/supported-databases.mdx` links the page from Next steps.

Wording rules: the C21 conventions. No commentary about the docs. Versions are stated once each. "Experimental" for Deno is Will's label, not npm's.

## Checks before the PR

`check-plain.sh`, `check-ai-signs.sh`, `check-staccato.py`, `cspell`, `lint:links`, `lint:versions`; two cold reader rounds with `references/reader-persona.md`; a fact re-check of every number against the table above.
