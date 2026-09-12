Read once, top to bottom, as a Prisma ORM 7 user.

## Sentences I could not restate after one reading

**Line 3** — "PostgreSQL supports aggregation over a result set."
This reads as a fact about the database, which I already knew, so I could not work out what it was telling me. I think you mean "On PostgreSQL, a collection has aggregation methods." Plainest wording: "These methods exist only on PostgreSQL collections."

**Line 48** — "`sum()` and `avg()` are offered on `Decimal` and `BigInt` columns. Over a `Decimal` column they return the exact value as a string."
"Offered" stopped me. The bullet above already showed `sum('amount')` on an `Int` column, so "offered on Decimal and BigInt" cannot mean "only on". And "they return the exact value as a string" — does that include `avg()`? If `avg()` on a `Decimal` already returns a string, why does `avgDecimal()` exist (line 56)? Three ideas in two sentences and they contradict the next paragraph. Plainest wording: state the return type per column type in a small table: column type → `sum()` returns → `avg()` returns.

**Line 48** — "Over a `BigInt` column `sum()` returns a `number` and throws an error whose `code` is `RUNTIME.DECODE_FAILED` if the total is past `Number.MAX_SAFE_INTEGER`."
Too many ideas in one sentence, and it never says *when* it throws — at query time? on property access? Plainest wording: split into two sentences, and say the error comes from running the query.

**Line 135** — "`groupBy(...)` returns a `GroupedCollection`, which you never import or name yourself."
I could not work out why I was being told this. It answers a question I did not ask. If the point is "don't try to type this type", say "You never write this type in your own code."

**Line 137** — "To do that, write the query with the SQL query builder (`db.sql`)."
"SQL query builder" appears here for the first time with no definition, and the example below it (line 176) uses four things this page never explains: `db.sql.public.order`, `(f, fns)`, `.build()`, and `db.runtime().query(...)`. I could not restate what any of them do.

**Line 227** — "Stacked `where()` calls are combined with AND, and you can use the shorthand object in one call and the callback in the next."
"Stacked" is a guess. Plainest wording: "If you call `where()` more than once, the conditions are ANDed. One call can take the object form and the next the callback form."

**Line 238** — the whole bullet.
This is one paragraph carrying seven separate rules. The parts that stopped me: "need a type that can be compared for equality" and "need a type that can be ordered" are abstract categories the page never lists. I get two examples (`Uuid`, `DateTime` yes; `Json` no) and nothing else, so I cannot predict whether `Boolean`, `Decimal`, `Bytes`, or an enum is ordered. Plainest wording: a table of field type → available methods.

**Line 392** — "Naming such a field throws an error whose `code` is `ORM.FILTER_UNSUPPORTED`."
"Naming such a field" made me stop — I think it means "putting that field as a key in the object". And "throws" tells me it is a runtime failure, but the `groupBy` section said a missing `orderBy` is a *TypeScript* error, so now I do not know which failures I catch at compile time and which blow up in production. Plainest wording: "Using that field as a key compiles, but fails at runtime with `ORM.FILTER_UNSUPPORTED`."

**Line 356** — "There `some()` reads as 'the related row matches' and `none()` as 'it does not'."
I could restate this, but only after re-reading, because `some`/`every`/`none` are plural words and a to-one relation has one row. It also does not say what `every()` means on a to-one relation, which it just told me is available.

## Words and phrases I had to guess

- **"result set"** (lines 3, 40, 47) — guessed: the rows my filters match, not rows already fetched into memory.
- **"collection"** in "None of these methods exist on a MongoDB collection" — I was told "collection" means the query object, but MongoDB also calls its tables collections, and line 230 says "the accessor is the collection name". I guessed the query-object meaning here.
- **"offered on"** (line 48) — guessed: "also work on".
- **"pipeline builder"** (line 3) — guessed: a separate chaining API. I did not follow the link.
- **"selector"** and **"predicate"** as the Name column in the Options tables (lines 54, 207) — guessed these are just labels for the positional callback, not keys I type. The tables look exactly like options-object tables, so I first read them as `aggregate({ selector: ... })`.
- **"page the groups"** (line 138) — guessed: pagination.
- **"Column-level comparison methods"** (line 233) — guessed: comparisons on one field at a time. "Column-level" is not a term I know.
- **"to-many relation"** / **"to-one relation"** (lines 351, 356) — guessed from the examples; the page defines to-many but not to-one until it is already used.
- **`@prisma/orm-mongo/query-ast/execution`** — "query-ast" and "execution" look like internal package paths. I guessed I copy it verbatim and do not think about it.
- **`MongoAndExpr` / `MongoOrExpr` / `MongoFieldFilter`** — guessed "Expr" means expression. The page never expands it.
- **`h`, `agg`, `f`, `fns`, `o`, `u`, `p`, `t`, `group`** — guessed all of these are arbitrary parameter names I choose.

## Places where I asked "so what do I actually type?"

1. **`db.sql.public.order` (line 176) is lowercase, but `db.orm.public.Order` is capitalized.** The schema has `@@map("order")`. The page never says that `db.sql` uses the mapped table name while `db.orm` uses the model name. I would have typed `db.sql.public.Order` and got an error I could not explain.
2. **`db.runtime().query(topCustomers)` (line 182).** What is `runtime()`? Do I need a different import? Is this inside a transaction? This is the one escape hatch the page offers for a real need (sorting groups by an aggregate), and it is the least explained code on the page.
3. **`(f, fns)` in the `db.sql` example.** Two callback arguments appear with no word about what the second one is.
4. **`.build()` then `await db.runtime().query(...)`** — two steps, no explanation of why the query is not awaited directly like every other example on the page.
5. **`import { MongoAndExpr }`.** Line 293 tells me to use `MongoAndExpr.of([a, b, c])` but no example imports or uses it. I would have to infer the import line from the neighbouring one.
6. **`having()` placement.** Line 136 says `having()`, `orderBy()`, `limit()`, `offset()` can come in any order, and line 198 says `having()` comes "before `aggregate()`". Both are fine, but the only `having()` example has no `orderBy()`, so I do not know if `.orderBy(...).having(...)` compiles.
7. **Aggregates plus `orderBy`/`limit`.** Does `aggregate()` on a non-grouped collection honour a `limit()` earlier in the chain, or does it always aggregate everything the `where()` matched? The page never says.
8. **`count()` on a to-many relation.** Nothing here says how to count a group without `groupBy`, or how to aggregate related rows. I would have gone looking.
9. **The `Task` model in line 280** (`t.description.isNull()`) is not in either schema I was shown. Minor, but I could not check the field type against the claim.

## Places explaining internals when I only wanted to know what to do

- **Line 135**, `GroupedCollection` "which you never import or name yourself" — internal type naming. The useful half is "you cannot `await` it; call `.aggregate(...)`."
- **Line 150**, the Return type table saying `GroupedCollection` / "Not a promise." This repeats line 135 and still tells me about a type I never write.
- **Line 213**, the same table again for `having()`: "The same grouped collection with this condition added." That is a description of the builder's internal state, not of what I do.
- **Line 292**, "`.and(other)` and `.not()` are **methods on a condition you already built**" — the bolded contrast between "standalone functions" and "methods on a condition" is API-design commentary. What I need is the two code shapes side by side, which line 300 and line 318 already give.
- **Line 230**, "a filter you build by calling a static method on the `MongoFieldFilter` class". "Static method on the class" is implementation vocabulary. `MongoFieldFilter.eq('name', 'Alice')` shows me everything I need.

## Could I do what the page is for, after one reading?

Partly.

I could write a simple `aggregate()`, a `groupBy().aggregate()`, a `having()`, and PostgreSQL `where()` filters with `and`/`or`/`not` and relation filters. Those sections have enough examples that I could copy and adapt.

What I would still not know:

- **Which comparison methods my field has.** For anything that is not `String`, `Int`, `Uuid`, `DateTime`, or `Json`, I would have to poke at autocomplete. The page tells me to rely on autocomplete instead of telling me the rule.
- **What `sum()` and `avg()` actually return on a `Decimal` column**, and therefore whether I need `avgDecimal()`. Lines 48 and 56 point in different directions.
- **How to sort groups by an aggregate.** This is a common thing to want, the page names it as the reason to drop to `db.sql`, and then the escape hatch is four unexplained API calls. I would have to go find the `db.sql` docs before I could write it.
- **Which mistakes the compiler catches.** `limit()` without `orderBy()` is called a TypeScript error; a `Json` key in a shorthand object is a runtime throw. I have no rule for predicting which is which.
- **How to aggregate on MongoDB.** Told to go elsewhere, which is fair, but it means half the page does not apply to a MongoDB reader and the split is only announced once, in line 3.
- **Whether `every()` works on a to-one relation**, and what it would mean.

The largest single problem is the `db.sql` example at line 176. It is the answer to a real question the page raises itself, and it is the one block I could not type from.