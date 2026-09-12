Read once, top to bottom. Here's what stopped me.

## Sentences I could not restate after one reading

1. **Line 186:** "Models hang off `db.orm.public` and use the contract's **root names**, which match your Prisma Schema Language (PSL) model names"
   Stopped by: "the contract's root names." I don't know what a contract is, what a root name is, or why an extra concept is needed to say "the name matches your model." Plainer: "Models hang off `db.orm.public` under their model names from the schema: `db.orm.public.User`."

2. **Line 204:** "use the contract's **root names too, but those are the lowercase plural collection names** from the contract's `roots` map, not the PSL model names"
   Stopped by: three ideas at once — the same term meaning something different, a `roots` map I've never seen, and a negation. Also it contradicts itself in feel: if "root name" is defined as "matches the PSL model name" one paragraph earlier, then here root names don't match model names. Plainer: "On MongoDB, models hang off `db.orm` under the collection name you mapped with `@@map`: `db.orm.users`."

3. **Line 382:** "Which fields each of those functions accepts comes from the aggregate map in your emitted contract, not from a fixed rule."
   Stopped by: "aggregate map," "emitted contract." I cannot look at my schema and predict what will compile. Plainer: "`sum()` and `avg()` accept numeric columns. `min()` and `max()` also accept text and date/time columns. Anything else is a compile error."

4. **Line 383:** "`sum()` over an integer column returns `number` and raises `RUNTIME.DECODE_FAILED` outside ±(2^53 − 1); `avg()` over an integer column returns a `float8` `number`; `sumBigInt(field)` and `avgDecimal(field)` are the lossless forms."
   Stopped by: four separate facts in one sentence, plus `RUNTIME.DECODE_FAILED` (an error code I have no context for — is it thrown? a rejected promise? what do I catch?) and `float8` (a Postgres type name used to describe a JavaScript value). I'd split this into a short list.

5. **Line 334:** "passing a second argument to `include()` does **not** throw. JavaScript does not arity-check, so the extra argument is silently ignored and a plain, unrefined `$lookup` runs. This differs from calling a genuinely absent method, which throws `TypeError`."
   Stopped by: this is a paragraph about JavaScript's calling convention, not about the ORM. I read it twice trying to find the instruction. The only fact I need: "On MongoDB `include()` takes no second argument; if you pass one it is ignored."

6. **Line 478:** "On PostgreSQL, **native** enum columns sort in the enum's declaration order... A text-backed enum sorts by its stored value instead"
   Stopped by: "native enum" vs "text-backed enum." The page never defines either, and both enums in the example schema carry `@@type("pg/text@1")`, so I have no example of the native kind and no way to tell which one I have. This directly changes my sort results and I cannot act on it.

7. **Line 466 (note):** "columns stored as date/time strings or backed by `Temporal`. So `min('createdAt')` over a `DateTime` column type-checks and returns a `Temporal.Instant`."
   Stopped by: `Temporal` appears with no introduction. Is that the TC39 `Temporal` global? Do I need a polyfill? What does `Temporal.Instant` support? This is a return type I have to write code against.

8. **Line 466, last clause:** "those calls are a compile error, naming the operation that is unavailable for that input."
   Stopped by: "naming the operation that is unavailable for that input" — I think it means the TypeScript error message mentions `SUM`, but I had to guess.

9. **Line 588:** "`cursor()` is typed to require a preceding `orderBy()`. This is a **type-only** guard: at runtime there is no such check."
   Stopped by: "type-only guard" is invented phrasing, and the whole point is an implementation detail. What I need: "Always call `orderBy()` before `cursor()`. Without it the cursor is ignored and you get every row."

10. **Line 200:** "To attach domain methods to a model, register a custom `Collection` subclass when you build the client. That path uses the `orm(...)` factory instead of the client's built-in facet"
    Stopped by: "domain methods," "facet," "the `orm(...)` factory" — three unexplained things and no code. "Facet" is used twice on the page (line 182 too) and never defined.

## Words and phrases I had to guess

- **"contract"** / **`contract.json`** / **`./contract.d`** — I guessed this is Prisma 8's replacement for the generated client, produced by something like `prisma generate`. The page never says. This is the single biggest gap: it appears in the first code block and is never explained or linked.
- **"facet"** (line 182, 200) — guessed: a namespace on the client object, i.e. `db.orm` vs presumably `db.something-else`.
- **"root names"** / **"`roots` map"** — guessed: the keys the client uses to expose each model.
- **"extension pack"** (line 198) — guessed: an npm package adding database-specific types.
- **"read method (#read-terminals)"** (line 222) — "terminals" guessed as "methods that end the chain and execute."
- **"reducer"** (line 341, in the `refineFn` type) — guessed: one of `count`/`sum`/`avg`/`min`/`max`.
- **"polymorphic (PostgreSQL) or discriminated (MongoDB) model"** (line 677) — guessed these both mean the `@@base` / `@@discriminator` thing in the schema. Neither is defined, and `@@base`, `@@discriminator`, `types { ... }`, `@@type("pg/text@1")`, and the `Uuid` type all appear in the example schema with no explanation or link.
- **"native"** vs **"text-backed"** enum — guessed text-backed means the `@@type("pg/text@1")` annotation, native means its absence. Not stated.
- **"multi-table inheritance (a base table plus a variant table)"** (line 682) — guessed, but then the sentence says it "affects some mutations" and points at two sections not on this page, so I still don't know what it affects.

## Places I asked "so what do I actually type?" and got nothing

- **Where do `contract.json` and `contract.d` come from?** No command, no link. I cannot run the very first example.
- **The pgvector example (line 198)** describes the option in prose — "pass the pack when you create the client," "needs `extensions: [pgvector]`" — but shows no code. Every other setup step gets a code block; this one doesn't, and it's the one with an unfamiliar import path.
- **What do I pass to `.eq()` for an enum?** Line 254 uses `u.kind.eq('admin')` (a member name of `user_type`) and line 271 uses `p.priority.eq('urgent')` (the *mapped value* of the `Urgent` member). Both enums are declared the same way. I cannot tell which form is correct or why they differ.
- **`variant('Bug')` and `variant('Tutorial')`** both use the capitalized PSL model name, even though every other MongoDB accessor on the page is lowercase plural. Is the variant name the model name, or the discriminator string (`"bug"`, `"tutorial"`)? The schema shows both, the page doesn't say which one `variant()` takes.
- **`combine()`** (line 394, 454): "Object of sub-views and aggregates." In the example, `posts.combine({ recent: posts.orderBy(...), total: posts.count() })` references `posts` from inside its own callback. I don't know whether that's required, whether the keys are free-form, or what shapes are legal values.
- **Every id in every example is undefined:** `aliceId`, `carolId`, `acmeId`, `postId`, `emptyCustomerId`. None is ever assigned. I can't copy any example and run it.
- **`select()` on MongoDB** — Remarks say the return type isn't narrowed. So what do I write to get a typed result? Cast it myself? Not said.
- **`where()` callback fields on PostgreSQL** — what operators exist besides `.eq()`? The page says "column-level operators" and defers to "[Filter conditions and operators]," a section not on this page. Same for `MongoFieldFilter` (`.eq`, `.gte` shown; the rest deferred).
- **`Customer` / `Order`** are used in three examples (lines 431–448) and defined nowhere in this file, only forward-referenced to "Grouped aggregates."
- **`countBigInt()`** is named in the Remarks (line 383) but has no row in the Options table and no example.
- **`PostTag`** exists in the example schema with explicit `postId`/`tagId`, while `Post.tags Tag[]` and `Tag.posts Post[]` look implicit. I can't tell whether the join model is required or vestigial, and it's never used in an example.

## Places explaining how it works inside when I only wanted what to do

- Line 334, the JavaScript arity paragraph. Pure internals.
- Lines 588 and 651, "type-only guard, not a runtime check." I only need "always call `orderBy()` first."
- Line 382, "comes from the aggregate map in your emitted contract, not from a fixed rule." Tells me about the code generator, not about what compiles.
- Line 332, "`include(relationName)` adds a `$lookup`." I don't need the Mongo aggregation stage name to load a relation.
- Line 682, "variants use multi-table inheritance (a base table plus a variant table)." Schema internals in a method reference.
- Line 383, `float8` and `RUNTIME.DECODE_FAILED`. The engine's type name and error code, where I wanted "use `sumBigInt()` for large sums."
- Line 297, "narrows the projected fields at runtime, but does not strip fields from the returned row type at compile time" — the fact is important, but it's phrased as a compiler/runtime split rather than "on MongoDB the result type still lists every field, even though only the selected ones have values."

## Could I look up a method and use it correctly after one reading?

For the plain chainers — `where`, `orderBy`, `limit`, `offset`, `distinct` — yes, once I already have a working client. The Remarks/Options/Return/Examples layout is easy to scan and the Postgres/Mongo tabs are genuinely useful.

But I could not get to a working client at all, because the page opens with `contract.json` and `contract.d` and never says where they come from. That blocks everything.

Beyond that, still unknown after one reading:
- What a contract is, and therefore what "root names," "the `roots` map," and "the aggregate map" mean — three of the page's load-carrying facts rest on a term it never defines.
- Whether my enums are native or text-backed, so I can't predict `orderBy` results.
- Whether `.eq()` takes an enum member name or its mapped string.
- Whether `variant()` takes the model name or the discriminator value.
- What operators exist on either database — both lists are deferred off-page.
- What `Temporal.Instant` is or whether I need a polyfill before using `min('createdAt')`.
- How to write a `combine()` shape from scratch, rather than modifying the one example.

One more thing: the page promises at line 17 that "every example is transcribed from an executable test suite that runs against a live database," but no example is runnable as printed, because none of the id variables exist. That claim raised my expectations and then didn't hold.
