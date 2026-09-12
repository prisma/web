# Fact re-check 1, slice C (Grouped aggregates, filter conditions through shorthand filter)

Six edits, line count unchanged (408). Corrections: `quantity Int?` in the aggregate schema; `min()`/`max()` also `null` over an empty set (Remarks and Return table); selector also has `countBigInt`, `sumBigInt`, `avgDecimal`; to-one relation filtering works from either side; shorthand `null` on MongoDB also matches a missing field; `ORM.FILTER_UNSUPPORTED` is PostgreSQL only.

Q: the result comments in the `aggregate()`/`groupBy()` examples (`// { total: 10 }` etc.) and the Customer/Order schema itself have no seed data or fixture in the rc.9 source. The real aggregate tests run on the fixture in `test/integration/test/sql-orm-client/fixtures/contract.ts` (User/Post with `Post.views`). Page-wide decision needed on the "every example is copied from a test suite" claim.

Confirmed: everything else in the slice, including `some()` taking an object or a callback, `MongoOrExpr.and()`, variadic `groupBy`, grouped `orderBy` by grouping field only, `limit`/`offset` typed `never` without `orderBy`, no `having` by alias, `in([])` renders FALSE and `notIn([])` TRUE.
