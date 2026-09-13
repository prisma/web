# Reader review: `pipeline-builder.part1.mdx`

I used Prisma ORM 7 for two years. I have never seen this API.

## Sentences I could not restate after one reading

**Line 95** — "`from(root)` takes a contract **root name**: the collection name from the contract's `roots` map (`'posts'`, `'users'`), the same names the ORM client uses (`db.orm.users`), not the model names."

What stopped me: "contract" and "the contract's `roots` map". I have no idea what a contract is, where it lives, or what file I would open to see this map. It is bolded like a defined term, but it is never defined and never linked. Plainest wording I would have understood: "`from()` takes the collection name — the same name you use on `db.orm` (`'posts'`, `'users'`), not the model name `Post`."

**Line 97** — "The builder moves through three states as you chain: a starting collection, a filtered collection after `match()`, and a pipeline chain after any other stage. Each state exposes the methods that are valid at that point."

What stopped me: too many ideas, and all of them about the library's internal design. The only part I can act on is the parenthetical about `insertOne` / `insertMany`. Plainest wording: "Some methods are only available before you add stages — `insertOne` and `insertMany`, for example. If a method is missing from autocomplete, you have already chained past it."

**Line 126** — the whole bullet. "`runtime.query(plan)` is the executor. It accepts any plan, including one built by the pipeline builder. On MongoDB `db.runtime()` returns a promise, so the call reads `(await db.runtime()).query(plan)`; hold the runtime in a variable if you run several plans. It returns an `AsyncIterableResult`: `await` it for an array of documents, or `for await` over it to take one at a time. There is no `db.execute` on the MongoDB client."

What stopped me: five separate facts in one bullet. Split it into five bullets, or better, show the "hold the runtime in a variable" version as code — you never do, despite every example paying the double-`await` cost.

**Line 127** — "**Read results are decoded, up to a point.** ... so `_id` comes back as a decoded hex string and other fields come back as their contract types."

What stopped me: "up to a point" is vague until I read the next bullet, "contract types" again leans on the undefined word "contract", and "carries a result shape" is internal vocabulary. The actionable rule is buried: the list of eight stages that preserve decoding.

**Line 150** — "`match()` filter values are **not encoded to the stored type**. The value you pass is compared as-is against the stored value."

What stopped me: "encoded to the stored type" means nothing to me until the `_id` warning 40 lines later. On its own I cannot tell what could go wrong.

**Line 151** — "`eq` and `expr(...)`-wrapped comparisons run in Prisma ORM's own tests; the remaining operators follow the matching MongoDB query operators."

What stopped me: I could not tell what this means for me. Do `gt` and `in` work or not? "Follow the matching MongoDB query operators" sounds like a description of behavior, but the first clause implies a warning. Say plainly: "These operators are untested by Prisma but behave like the MongoDB operators of the same name."

**Line 191** — "the pipeline builder's value resolver walks the value as a plain object, destructuring an `ObjectId` into its internal `buffer` bytes, so the filter that reaches MongoDB never carries a real `ObjectId`."

What stopped me: this is a description of a bug in Prisma's internals. I only needed sentence one: `_id` equality in `match()` silently returns nothing; use `rawCommand()` or `db.orm`.

**Line 191, last two sentences** — "Note that the hex-string form **compiles without any cast**. ... Only the driver-`ObjectId` form requires a cast to attempt."

What stopped me: "cast" — a cast to what type? Neither sentence tells me what I would type, and I cannot work out why "requires a cast to attempt" matters if neither form works.

**Line 616** — "`rawPath` builds a field path without checking it against the model, and a field path is compiled by prefixing a `$`, so `'$KEEP'` reaches the server as `$$KEEP`."

What stopped me: I had to hold three steps in my head and there is no example to check them against. Plainest wording: "Write `f.rawPath('$KEEP')`. The builder adds one more `$`, so the server sees `$$KEEP`."

**Line 626** — "**The expression fields inside these options are opaque.** Fields like `bucket.groupBy` ... are raw aggregation expressions (`MongoAggExpr`), not reachable through the typed `(f) => ...` callback the classic stages use. You build these values with expression helpers and pass the underlying node (`fn.year(ref).node`), or name a field directly with `MongoAggFieldRef.of('price')`."

What stopped me: "opaque", "the underlying node", and `ref` — which appears from nowhere and is never defined. This is the hardest paragraph on the page and the only one with no example.

**Line 644** — "they need Atlas Search's `mongot` process ... because those tests use an in-memory MongoDB with no Atlas Search."

What stopped me: `mongot` is a word I have never seen, and both halves are about Prisma's test setup. The fact I need is the last sentence: it will fail at runtime, not at build time.

## Words and phrases I had to guess

- **"contract"** (lines 95, 127) — I guessed it is some generated description of my schema, maybe a file, maybe a type. I still do not know.
- **"roots map"** — guessed: a list of collection names somewhere in that contract.
- **"plan"** (line 116 onward) — guessed: the object `build()` returns, which you hand to the executor. The page never says this in one sentence; I inferred it from the variable name.
- **"discriminated model"** (line 23) — guessed: one collection storing two kinds of document, told apart by a field. `@@discriminator`, `@@base`, and `@@type("mongo/string@1")` in the schema are all new to me and unexplained.
- **"result shape"** / **"carries the shape forward"** — guessed: Prisma knows the column types, so it converts values back.
- **"decoded hex string"** vs **"raw driver `ObjectId`"** — guessed: one is a `string`, the other is the mongodb driver's class.
- **"inert"** (line 122) — guessed: nothing runs until you execute.
- **"the executor"** (line 126) — guessed: just a name for `runtime.query`.
- **"opaque"** (line 626) — guessed: not type-checked.
- **"the underlying node"** — guessed: some internal AST object; `.node` is a property I am told to reach for without being told what it is.

## Where I asked "so what do I actually type?"

1. **Where does `db` come from?** Every single code block starts with `db`, and no block imports it or creates it. The `fn` / `acc` / `expr` imports are shown, so the omission is glaring. One line and a link would fix it.
2. **`mongoQuery(...)`** (line 94) — named as an alternative entry point, with no import, no signature, no example, no link.
3. **`build()` vs `aggregate()`** (line 122) — I am told they are aliases. I am never told which one to prefer, so I do not know which is idiomatic.
4. **Holding the runtime in a variable** (line 126) — the page recommends it and then never shows it. I would have to invent `const rt = await db.runtime()` myself.
5. **`redact()`** — no Options table, no Return type table, and **no example**, unlike every other stage on the page. It is also the stage with the most confusing workaround. I would have to assemble `fn.cond(someCondition, f.rawPath('$KEEP'), f.rawPath('$PRUNE'))` from prose, and I am not confident that is right.
6. **`unwind()`** — no example, and the reason given is "the example schema has no array field." Add an array field to the schema.
7. **Every option-object stage** — `bucket`, `bucketAuto`, `geoNear`, `graphLookup`, `setWindowFields`, `densify`, `fill`, `facet` are named and then shown zero code. The one example is `unionWith('users')`, the simplest of the group. `facet` in particular ("an object that maps each output field name to an array of raw stages") is impossible for me to write from that sentence.
8. **`search()` / `searchMeta()` / `vectorSearch()`** — no example block, only a one-line table cell. The `vectorSearch` spec is listed as bare field names with no types.
9. **Comparing `ObjectId`s** — "Compare them with `String(...)`" appears twice. Show the line: `String(a._id) === String(b._id)`.
10. **`lookup()` chain** — `from(root).on((local, foreign) => ({ local, foreign })).as(name)` is written once as a signature, where `local` and `foreign` are both parameter names and object keys. I had to read the example twice to see that the keys are fixed.

## Places explaining internals when I only wanted to know what to do

- Line 15: "Where Prisma ORM's own tests do not run a method against a live MongoDB, the Remarks say so." I do not care about your test suite. Say "some methods are unverified" if you must, but the repeated test-coverage notes (lines 151, 625, 644) read like release notes for the Prisma team.
- Line 97: the three builder states.
- Line 126–128: "result shape" carried and dropped.
- Line 191: the value resolver and the `buffer` bytes.
- Line 451: "(Some older internal material shows a two-argument callback. That is incorrect.)" This is a note to whoever wrote the previous draft. Delete it; just show the correct signature.
- Line 616: the double-`$` compilation trick, explained as mechanism rather than as an instruction.
- Line 626: `MongoAggExpr`, `.node`, `MongoAggFieldRef`, `MongoMatchStage`, `MongoCountStage`, and "a known gap in the typed API."
- Line 644: `mongot`, in-memory test MongoDB.

## Could I do what the page is for, after one reading?

Partly. I could write the simple stages — `match`, `sort`, `limit`, `skip`, `sample`, `project`, `addFields`, `group`, `count`, `sortByCount`, `lookup`, `replaceRoot`. The examples for those are complete and I could copy them.

What I would still not know:

- **How to get `db`.** I cannot run a single example on the page. This is the biggest failure.
- **What a "contract" is**, so I cannot check what names `from()` will accept without guessing from `@@map`.
- **How to write `unwind`, `bucket`, `bucketAuto`, `geoNear`, `graphLookup`, `setWindowFields`, `densify`, `fill`, `facet`, `redact`, `search`, `searchMeta`, or `vectorSearch`.** That is 13 of the stages the page claims to document. The page says "This page documents every stage" (line 15); for these it names them and stops.
- **Whether my results will be decoded.** I understand the rule exists. I would not remember which eight stages preserve it, and the page gives me no way to check at runtime other than inspecting values.
- **Why `Article` and `Tutorial` are in the schema.** No example uses them, and the schema syntax around them is all unfamiliar. They cost me reading time for nothing.
- **Whether `gt`, `in`, `exists`, `type` actually work**, because line 151 hedges without saying what the hedge means for me.