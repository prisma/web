# Reader round 1 (2026-10-28, Opus, two cold readers: a Prisma ORM 7 user and a TypeScript developer new to Prisma)

## Marks

- "your contract", `db`, which package, and when to run `contract emit` not stated.
- The import path for `contract.d` relative to an unstated file.
- The `"+"` rule for relations-only reads as a contradiction; "next to a `"-"`" unclear.
- `ShorthandWhereFilter` "object form" implies another form the page never shows; why only it takes the schema.
- Prisma ORM 7's `WhereInput` covered operators, `OR`, and relation filters; the page offered only equality.
- `UpdateInput` and `CreateInput` with nested relation writes not covered.
- `ResultType` for a query that depends on an argument; whether `Awaited<ReturnType<...>>` still works.
- The `getProfile` example strips `email` by hand without saying whether the type requires it; the plain user-with-posts example was only in the Prisma ORM 7 table.
- The Prisma ORM 7 section came first, which a new user skips, and hid facts they need.
- MongoDB: no update or unique-lookup types.

## What changed

All of the above, with these checked by type-checking on rc.21: a filter function typed `(user: ModelAccessor<Contract, "User", "public">) => Condition` accepts `ilike` and `or(...)`; `ResultType<ReturnType<typeof fn>>` works for a query built from an argument; `include("posts").first()` returns directly as `Shape<..., { "+": "posts" }>`; a row that still has `email` is accepted where the `Shape` omits it, so the page now says leaving a field out of a type does not remove it from the data; `CreateInput` accepts `posts: (p) => p.create([...])`; MongoDB exports `CreateInput`, `UpdateInput`, and `MongoWhereFilter`, each taking the contract and the model name. The Prisma ORM 7 table moved after the PostgreSQL sections.
