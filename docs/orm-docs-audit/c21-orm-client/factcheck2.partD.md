# Final fact re-check, slice D (MongoFieldFilter, dot notation, field update operations, result types)

One correction: `u.address.set({...})` must give every field of the embedded object, including `zip`, because the generated type makes optional fields required keys of type `string | null`.

Everything else confirmed, including `.where(a).where(b)` ANDing, the eleven helpers, `of()` passthrough, `isNull` semantics, `MongoExistsExpr`, the cast (compiled with the repo's TypeScript), the four callback-taking methods, the function-call form for dot paths, `ORM.WHERE_MISSING` on `where({})`, `_id` as a hex string, the variant typing (no test), the eight operations and signatures, `AsyncIterableResult` rules, and the aggregate result shapes.

Q (left as is): `inc`/`mul` on a missing field is MongoDB server behaviour; `isNotNull('_id')` matching every document rests on MongoDB's `_id` guarantee; the `$size` illustration names a `tags` field the schema does not have (reworded by the orchestrator to say "on an array field"); two different operators on the same field in one update is a MongoDB conflict, untested here.
