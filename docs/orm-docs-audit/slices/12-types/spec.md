# Slice: Types for your code

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`. Item C6 of `changes.md`, job J9. Written 2026-10-28 by `seacole-52`.)_

## At a glance

`orm/reference/orm-client.mdx` documents `Models`, `Scalars`, `Shape`, and `ResultType` in one section, and Coming from Prisma ORM 7 has one row for them. No page shows the input and filter types or puts each Prisma ORM 7 type beside its replacement. After this slice, `orm/fundamentals/types.mdx` does both, for a reader who wants to type a function's argument or return value.

## The facts, each checked on 2026-10-28 by type-checking on `@prisma/orm-postgres` and `@prisma/orm-mongo` 8.0.0-rc.21

| What | Fact |
| --- | --- |
| Model types | `contract.d.ts` exports `Models`; `Models.public_User` has every scalar and every relation |
| `Scalars`, `Shape` | `@prisma/orm-postgres/family-contract/types` (also `/family-contract`); `@prisma/orm-mongo/family-contract` on MongoDB. `@prisma/orm-mongo/family-contract/types` does not exist on rc.21, although `orm-client.mdx` names it |
| `ResultType` | `@prisma/orm-postgres/components/runtime`, `@prisma/orm-mongo/components/runtime` |
| `Scalars<Models.public_User>` | the row of `first()` and `all()` with no `select` or `include` |
| `Shape<Models.public_User, { "+": "posts" }>` | the row of `include("posts")`; `ResultType<typeof q>` of that query is assignable to it |
| Input and filter types | from `@prisma/orm-postgres/orm-client`: `CreateInput<Contract, "User">`, `ScalarUpdateInput<Contract, "User">`, `ShorthandWhereFilter<Contract, "public", "User">`, `UniqueConstraintCriterion<Contract, "User">`; all type-check as arguments of `create`, `where(...).update`, and `where`. `MutationUpdateInput`, which `update()` declares and the ORM's `docs/reference/model-and-result-types.md` names, is not exported |
| MongoDB inputs | `CreateInput`, `MongoWhereFilter` from `@prisma/orm-mongo/orm` |
| Prisma ORM 7 names | from the ORM's `docs/reference/model-and-result-types.md` "Coming from Prisma 7" table at `v8.0.0-rc.20`, with `MutationUpdateInput` replaced by `ScalarUpdateInput` |

## Chosen design

- New page `orm/fundamentals/types.mdx` at `/orm/fundamentals/types`, last in Fundamentals. Sections: the Prisma ORM 7 to 8 table first; model types; the row of a query (`Scalars`, `ResultType`); choosing fields (`Shape`, with its rules as a short list); input and filter types with a function example; MongoDB last.
- `orm/reference/orm-client.mdx`: the MongoDB import path corrected, and the section links the new page.
- `orm/coming-from-prisma-orm-7.mdx`: the `Prisma.User` row links the new page.
- ORM-side follow-up (D34): `MutationUpdateInput` is what `update()` takes but is not exported, and the ORM's types reference names it.

## Checks before the PR

The three scripts, cspell, `lint:links`, `lint:versions`; two cold reader rounds; a fact re-check.
