# Reader round 2: `orm/supported-versions.mdx` (2026-10-22, Opus, Prisma ORM 7 reader persona)

## Sentences I could not restate after one reading

1. The tsconfig paragraph: too many ideas, and "a new project" is undefined. Running init on my existing app would overwrite my `module` setting, stated as a fact, not a warning. Plainer: "If your project has a `tsconfig.json`, `npx prisma orm init` changes `module` to `preserve` and `moduleResolution` to `bundler`. If you compile with `tsc`, change both back to `nodenext` afterwards."
2. "lists the four setups" points at something the page never lists, and the link goes to a PostgreSQL upgrade guide, odd for MongoDB.
3. "In your project this means one thing: `"type": "module"`" is contradicted by "A CommonJS app can stay CommonJS".
4. "`Temporal` objects, the standard JavaScript type that replaces `Date` for this purpose." Vague; which Temporal type does a `DateTime` field give?
5. The "checked on 22 October 2026" line: rc.25 and rc.19 do not match, and the page never says what the `prisma` package is.

## Words I had to guess

"release candidate" (safe for production?), "best-effort basis" versus "experimental", "`npx prisma orm init`" (safe on an existing Prisma 7 project?), "`@prisma/orm-postgres`" (learned two lines later that it replaces `@prisma/client`), "`mongodb` 7, which npm installs" (peer dependency that pnpm or Yarn would not install?), "SQLite is experimental" (no package named), "the 22 line".

## So what do I actually type?

- Polyfill on Bun and Deno: `bun add`? an `npm:` specifier on Deno? On Bun 1.4 or Deno 2.7, still needed?
- Where the import goes in a project with no `src/prisma/db.ts`; what happens if I forget it.
- A command for `SELECT version();`.
- No `yarn --version`; no way to check the installed Prisma version.
- CommonJS: can I `require()` the packages?
- Next.js or another framework: does that count as "a bundler"?

## Internals I did not need

The list of each tsconfig key init sets, replaces, adds, and keeps; "which `npx prisma orm init` adds when the file has no `"type"` field"; the verification note.

## Could I do what the page is for?

Mostly. Still unknown: the polyfill on newer Bun and Deno and how to install it there; where the import goes without `src/prisma/db.ts`; whether `orm init` breaks my `tsc` build; which tsconfig settings apply to my framework and what the four setups are; whether the `mongodb` driver is installed under pnpm or Yarn; the PostgreSQL server version command; whether a CommonJS app can `require()` the packages.
