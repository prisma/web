# Reader round 1: `orm/contract-authoring/advanced-postgresql.mdx` (2026-10-22, Opus, Prisma ORM 7 reader persona)

## Sentences I could not restate after one reading

1. The opening sentence carries three ideas: "contract" is new, the file rename, and `migration plan`, which may or may not replace `migrate dev` and may or may not apply the SQL.
2. "`contract emit` does not check the SQL": `contract emit` is never explained. The column-names rule is easy to miss; `"ownerId"` is quoted in the example because there is no `@map`.
3. "a policy per operation, applied to a database role" reads like a PostgreSQL rule, but `policy_all` exists.
4. "the connection string your app uses must log in as that role": `role app_user {}` has no login and no password, and Limitations says Prisma does not grant privileges, so the example cannot work as written, and the page says so 100 lines later.
5. "Prisma ORM appends a short hash to the `name:` you give": the index name in the database is not what I typed, and the page does not say what it is. "Rename it" is ambiguous.
6. "`map:` set to the exact name": first appearance of `map:`; the difference from `name:` is a guess.
7. `PN_EXACT_NAME_BODY_COMPARISON`: the code says nothing about what it warns or whether to act.
8. "Use `map:` only for SQL that `contract infer` wrote" conflicts with "Keep `map:` on anything that already exists".
9. "A single-table variant loses its own constraints": "variant" and "base model" are undefined.
10. `T?[]` is new syntax.

## Words I had to guess

"contract", `namespace unbound { role app_user {} }` (why a role needs that wrapper), `@onCreate(uuid())` beside `@default(autoincrement())`, `Uuid`, `policy_select` blocks and `target`, `permissive`, "roles that already exist", `@@control` and "control policy" (clashes with row-level security policies), `tolerated` versus `external`, `db verify`, `override get operations()` and `this.addColumn` (migrations are now TypeScript classes, with no introduction), "extension package", `8.0.0-rc.19`.

## So what do I actually type?

- How to set `app.user_id` through the Prisma client; `SET LOCAL` is named with no client code.
- How `app_user` gets a login and password, and what exact `GRANT` to write, and where the raw SQL step goes.
- The command flow after editing the contract (emit, plan, apply, verify).
- Where `createExtension` is imported from, which file creates `migration.ts`, whether `migration plan` generates it.
- Why `citext` is added in a migration file and not in the contract, and how the contract declares the `citext` column.
- The `contract infer` command and its flags.
- The raw SQL step, mentioned five times and never shown.

## Internals I did not need

The list of statements `migration plan` writes without what I must do myself; the hash and rename-versus-rebuild behaviour; the checks Prisma adds on enum and list columns; the reason behind the `map:` drift rule.

## Could I do what the page is for?

Partly. The index, check, and `@@control` examples would work. I could not ship row-level security (login, `GRANT`, setting `app.user_id`, the command flow), add an extension (file creation, import, contract side), or settle `name:` versus `map:` for an existing object I wrote by hand. "Single-table variant" stays undefined.
