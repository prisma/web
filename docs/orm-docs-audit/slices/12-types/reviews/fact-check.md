# Fact re-check (2026-10-28, Opus)

Sources: type-checking on `@prisma/orm-postgres` and `@prisma/orm-mongo` 8.0.0-rc.21, the rc.21 declarations, prisma/orm at `v8.0.0-rc.20`, a generated Prisma ORM 7.4.2 client, and the v7 docs.

## Corrected

| Claim | Source | New text |
| --- | --- | --- |
| A broken `Shape` rule is "a TypeScript error on that key" (also in `orm-client.mdx`) | compiling bad specs: the error is on the spec argument, and its message names the key | "a TypeScript error that names that key" |
| "`User` from `@prisma/client`" | Prisma ORM 7's default `prisma-client` generator writes to an `output` path; `@prisma/client` is the deprecated `prisma-client-js` | "`User` from your generated client" |
| "`Prisma.User`" as the Prisma ORM 7 row type (`orm-client.mdx`, Coming from Prisma ORM 7) | a 7.4.2 client has no `Prisma.<Model>`; the row type is the top-level `User` | "`User`" |
| MongoDB "a model declared outside a `namespace` block" | the MongoDB contract parser rejects `namespace` blocks | "where the contract has no `namespace` blocks, a model is `Models.unbound_User`" |

## Confirmed

Every model, row, `Shape` rule, and argument type on the page by type-checking, including `ModelAccessor` parameter order, `Condition` with `ilike` and `or`, `ScalarUpdateInput` rejecting relations, `UniqueConstraintCriterion` accepting `id` or `email` and rejecting `name`; the MongoDB paths and type parameters; `Models` first appearing at rc.10; the Prisma ORM 7 type names; all links.

## Q, left as written

- `ShorthandWhereFilter`'s second argument is a contract namespace id, equal to the PostgreSQL schema in the default setup; not tested with a namespace whose name differs from its schema.
- Whether `prisma-client-js` exports `User` at the top level was not checked.
- The ORM's `docs/reference/model-and-result-types.md` maps `Prisma.User` to `Models.public_User`, names `@prisma/orm-mongo/family-contract/types`, and names `MutationUpdateInput`; recorded in D34.
