# Reader round 1: `orm/supported-versions.mdx` (2026-10-22, Opus, Prisma ORM 7 reader persona)

## Sentences I could not restate after one reading

1. "Prisma ORM 8 runs on the versions below and on anything newer." The Node.js row lists "22.18 on the 22 line, 24.11 on the 24 line, or 26". Does "anything newer" include Node.js 23 and 25? The page contradicts itself.
2. "Versions below a floor are untested and unsupported, so check yours before you start." "Floor" is a metaphor.
3. "The npm that ships with each of these releases works, including npm 10 on Node.js 22." Makes me wonder what goes wrong with other npm versions or with pnpm and yarn.
4. "`bun create prisma@latest` refuses older releases." Does the ORM itself work on Bun 1.2 if I don't use `bun create`?
5. "Deno | 2.6, experimental | The scaffold passes `--minimum-dependency-age=0`, which earlier releases reject." Does "experimental" describe Deno support or version 2.6? "The scaffold" is undefined. The flag is internal.
6. The Temporal sentence carries seven ideas. I don't know what `db.ts` is.
7. "Node.js is the runtime Prisma tests on." Conflicts with the opening line. Are Bun and Deno untested?
8. "so that the types Prisma ORM generates are accurate." What happens on 5.8?
9. "a project that keeps its own `tsconfig.json` needs them too." Does `orm init` leave an existing `tsconfig.json` alone or merge into it? Are all four settings mandatory?
10. The CommonJS link text is a command name. How large is the change? Other CommonJS setups (ts-node, Jest, a bundler emitting CommonJS)?
11. The "checked on 22 October 2026 against rc.25 and rc.19" line is the first mention that Prisma ORM 8 is a release candidate.

## Words I had to guess

"on the 22 line", "floor", "the scaffold", "experimental", "`db.ts`", "`temporal-polyfill/full/global`", "`@prisma/orm-postgres`" (replaces `@prisma/client` plus a driver adapter?), "Driver" column, "installed alongside `@prisma/orm-mongo`" (automatic or manual?), "`npx prisma orm init`".

## So what do I actually type?

- Temporal polyfill: no install command; dependency or dev dependency; must the import be first; do Bun and Deno need it?
- MongoDB driver: do I run `npm install mongodb@7`?
- tsconfig: my Prisma 7 project runs `tsc` output on Node.js with `"module": "nodenext"`. Do I really switch to `preserve` and `bundler`?
- Checking versions: `psql --version` prints the client version, not the server; `mongod --version` needs a local server; no `bun --version` or `deno --version`.
- MySQL and SQLite: the page sends me to another page instead of saying "not yet".

## Internals I did not need

The `--minimum-dependency-age=0` flag; "`bun create prisma@latest` refuses older releases"; "so that the types are accurate"; "`"type": "module"` in its `package.json`" (I need to know what to change in my project); the npm sentence.

## Could I do what the page is for?

Mostly. Still unknown: Node.js 23 and 25; the real server version; whether to switch `module`; whether I install the `mongodb` driver; which file `db.ts` is and whether the import must come first; whether Bun and Deno need the polyfill; what the CommonJS change involves; that Prisma ORM 8 is a release candidate.
