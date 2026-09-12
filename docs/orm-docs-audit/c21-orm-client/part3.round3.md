## Sentences I could not restate after one reading

**Line 3** — "PostgreSQL supports aggregation over a result set, both flat (`aggregate()`) and grouped (`groupBy().aggregate()`), with `having()` to filter groups. Neither method exists on a MongoDB collection."

"Neither method" stopped me. Three methods were just named — `aggregate()`, `groupBy()`, `having()` — so "neither" (which means two) does not resolve. Plainer: "None of these methods exist on a MongoDB collection."

**Line 3** — "use the pipeline builder, which is this library's API for MongoDB's own aggregation pipeline."

"this library" — which library? The page has named `@prisma/orm-postgres` and `@prisma/orm-mongo`; neither is "this library." Plainer: "use the pipeline builder, Prisma's wrapper around MongoDB's aggregation pipeline."

**Line 55** — "It also gives you three exact variants, for numbers too large or too precise to hold in a JavaScript `number`."

Too many ideas in one sentence and "exact variants" is an invented label. I had to read the next three sentences to work out that "exact" means "does not lose precision." Plainer: "Three more methods avoid JavaScript's `number` precision limits."

**Line 55** — "You import nothing to use these."

I could restate it, but I could not work out why it is here. Nothing earlier suggested I would need an import for a method on a callback argument. It answers a question the page never raised.

**Line 243** — "Which methods a field has depends on its type, and your editor's autocomplete is the answer: if it does not offer a method on that field, the type does not support it."

Three ideas in one sentence, and the middle one tells me the page is not going to answer. Plainer: "The methods available on a field depend on the field's type. Autocomplete shows which ones apply."

**Line 364** — "It works from both sides of a relation, so `u.posts.some(...)` and `p.user.some(...)` are both valid."

"works from both sides" is a slick phrase, not a description. I think it means "the same method name is used whether the relation is to-many or to-one," which the previous sentence already said. I could not tell whether it was making a new point.

## Words and phrases I had to guess

- **"flat (`aggregate()`)"** (line 3) — guessed: aggregating over the whole result set as one group, as opposed to per group.
- **"exact variants"** (line 55) — guessed: they return `bigint` or a string instead of `number`, so no precision is lost.
- **"resolves to"** (lines 45, 47) — guessed: the promise resolves, i.e. this is the value you get after `await`.
- **"calling a method on the `MongoFieldFilter` class itself"** (line 235) — guessed: a static method, called on the class, not on an instance.
- **"a type that can be compared for equality" / "a type that can be ordered"** (line 243) — guessed at the boundary, and I still do not know it. Is `Uuid` orderable? Is `Json` equality-comparable? Is `DateTime`? The page never lists the types.
- **`GroupedCollection`, `MongoAndExpr`, `MongoOrExpr`** — guessed these are class names I mostly do not touch, except `MongoOrExpr` and `MongoAndExpr`, which I do call `.of()` on.
- **`@prisma/orm-mongo/query-ast/execution`** (line 326) — a path with "query-ast" and "execution" in it reads like an internal module. I guessed it really is the supported public import, because the page uses it in an example.

## "So what do I actually type?" — unanswered

1. **Sorting groups by an aggregate value.** Line 129: "To do that, write the query with the SQL query builder (`db.sql`)." This is the most common thing anyone wants from `groupBy` — top customers by total spend. The page names the escape hatch and gives no code, not even one line.
2. **The three exact methods have no example.** `countBigInt()`, `sumBigInt()`, `avgDecimal()` are described in prose at line 55 and appear in no code block, no Options table, and no Return type table.
3. **Aggregating a `BigInt` or `Decimal` column.** Line 47 only covers `sum('amount')` on `Int`. What does plain `sum()` do on a `Decimal` column — throw, or silently lose precision? If it throws, that is the one case where I need `avgDecimal`, and the page does not say so.
4. **Building `MongoAndExpr` directly.** Line 298 tells me `MongoAndExpr.of([a, b, c])` exists. The only Mongo import line on the page (line 326) imports `MongoFieldFilter` and `MongoOrExpr`. I do not know where `MongoAndExpr` comes from.
5. **The Mongo import path is not in the prose.** Line 234 tells me exactly what to import for PostgreSQL. The matching Mongo bullet at line 235 tells me none of it; I have to scroll to a code block on line 326 to find the module.
6. **Chaining two `.where()` calls.** The page tells me explicitly that repeated `.having(...)` is ANDed (line 197). It never says whether repeated `.where(...)` is. I would have to guess.
7. **Mixing the shorthand object and a callback in one `where()`.** Both forms are documented. Whether I can pass both, or combine them, is not stated.
8. **Is the callback form available on MongoDB?** Every Mongo example uses `MongoFieldFilter`. Line 235 implies the callback form is PostgreSQL-only, but never says it.
9. **`every()` and `none()` on a to-one relation.** Line 364 says `some()` works on to-one. It says nothing about the other two, so I do not know if `p.user.none(...)` compiles.
10. **The ORM 7 replacement for `is` / `isNot`.** I used `{ user: { is: {...} } }` for two years. The page gives me a migration diff for `aggregate()` and for `groupBy()`, so I expected one here. There is none, and `is`/`isNot` are never mentioned. I had to infer that `p.user.some({...})` is the replacement.
11. **`aggregate()` is itself the terminal call.** Everywhere else a query ends in `.all()` or `.first()`. Line 68 awaits `aggregate()` directly. The page never states that `aggregate()` runs the query; I worked it out from the `await` in the examples.

## A direct contradiction

Line 243: if a field's type cannot be compared for equality, it does not have `eq` — "if it does not offer a method on that field, the type does not support it."

Line 392: "a field whose type cannot be compared for equality throws an error whose `code` is `ORM.FILTER_UNSUPPORTED`. Filter that field with a comparison method instead."

If the type has no equality comparison method, which comparison method am I supposed to use instead? The advice on line 392 points at something line 243 says does not exist. One of these is wrong, or line 392 means something else and does not say what.

## Internals where I only wanted instructions

- Line 142, Return type table: "`GroupedCollection`". I cannot import it, name it, or type a variable with it from anything the page shows. The useful part is the two lines of prose next to it ("Not a promise. Call `.aggregate(...)`").
- Line 298: "The result is a `MongoAndExpr`" — relevant only because `.of()` is then mentioned, but it is introduced as a fact about the return type rather than as something to do.
- Line 350: "There is no `$nor` combinator in the library." `$nor` is MongoDB's own operator name. This tells me about the library's coverage; it does not tell me what to write if I wanted NOR.

## Could I do what the page is for, after one reading?

For the common PostgreSQL cases, yes. I could write `aggregate()`, `groupBy(...).aggregate(...)`, `having(...)`, scalar comparisons, `and`/`or`/`not`, and relation filters from the examples without going anywhere else. The "For Prisma ORM 7 users" diffs on lines 114 and 184 did more for me than anything else on the page.

What I would still not know:

- How to sort groups by a computed total — the single query I would have written first.
- Which field types support which comparison methods, so I would find out by hitting a compile error or a runtime `ORM.FILTER_UNSUPPORTED`.
- What to do with a `Decimal` or `BigInt` column, or when the three exact methods are required rather than optional.
- How to write anything on MongoDB beyond copying the four example lines. I have `MongoFieldFilter` (list is in a part I do not have), `MongoOrExpr.of`, `.and()`, `.not()`, one import path, and a named class I cannot import.
- Whether my ORM 7 `is` / `isNot` relation filters map onto `some()`, and whether stacked `where()` calls behave like the stacked `having()` calls the page does document.