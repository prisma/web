# Reader round 2 (2026-10-28, Opus, Prisma ORM 7 reader persona)

## Marks

- The opening paragraph carries six ideas; `Contract` described by a forward reference.
- `"+"` with a scalar and a relation together not covered; whether a relation key alone adds the relation.
- "each takes `Contract` and the model name" is false for `ShorthandWhereFilter` and `ModelAccessor`, which also take the schema, in different positions.
- `ModelAccessor`/`Condition` sentence hard to parse; "with it" has no referent; the new nested-create syntax not tied to Prisma ORM 7's.
- No `db` import; relation filters (`some`); `create()`'s return type; compound unique keys; relation changes in an update; the `ResultType` row in the table uses a different form from the section.

## What changed

All of the above. Checked by type-checking on rc.21: `UniqueConstraintCriterion<Contract, "Post">` accepts `{ authorId, title }` for `@@unique([authorId, title])`; `create()` returns `Scalars<Models.public_User>`; `(user: ModelAccessor<...>) => user.posts.some((post) => post.title.eq("Hello"))` is a `Condition`. Relation changes in an update have no exported type (D34), and the page says so.
