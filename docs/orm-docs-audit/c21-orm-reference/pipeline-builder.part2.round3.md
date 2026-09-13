# Reader review: `pipeline-builder.part2.mdx`

## Sentences I could not restate after one reading

**Line 33 — the paragraph after the accumulator table.** This is seven separate rules in one block: which helpers share a signature, what `output` means, what `sortBy` means, the `n: fn.literal(2)` rule, where `fn.literal` comes from, and the `sort()`-before-`group()` rule. I had to reread it three times and I still could not tell you from memory which of `top`/`bottom`/`topN`/`bottomN` take `n`. Split it. The `sort()` rule in particular is a real correctness warning buried as the last sentence of a housekeeping paragraph.

**Line 109 — "Five have a different name: `in` and `typeof` are reserved words in JavaScript, `toString` is already a method on every JavaScript object, and `$first` and `$last` get the suffix `Elem`."** Three reasons, five names, and the reasons are in a different order than the renames that follow. I counted on my fingers. Plainer: give a two-column table — MongoDB operator, helper name — with a one-line reason each.

**Line 124–130 — the `.node` table.** I do not know what `.node` is. The page never says. It reads as: "sometimes you pass the thing, sometimes you pass a property of the thing, and there is no rule, just memorize this list." Line 129 is a single table cell holding five function names and five option names. I cannot hold that. What I actually wanted: one sentence saying *why* these differ, so I can predict the next case instead of looking it up every time.

**Line 145 — "So does every other helper not named above, in the order MongoDB documents for that operator."** This tells me the reference is incomplete on purpose and sends me to MongoDB's docs, with no link. To use `fn.substrBytes` I have to leave the page.

**Line 238 — "Pipeline form calls `f.stage.*`, where `stage` is a literal property name, and can read other fields of the same document."** "Literal property name" stopped me. I guessed it means "you literally type `.stage`, it is not a placeholder for a stage name" — which is worth saying, because everything else in `f.*` is a field name. Say that directly: "type `f.stage` exactly; `stage` is not a placeholder."

**Line 249 — the `insertOne` remark.** Six ideas in one paragraph: the record is plain, TypeScript checks nothing, `_id` is optional, values are stored raw with no conversion, pass real `Date`/`ObjectId`, `match()` follows the same rule, and `insertMany([])` throws. The "no conversion" point contradicts the "decoded" promise I was given in part 1 and deserves its own callout, not sentence four of seven.

**Line 399 — "`pop(direction)` | `1` removes the last element, `-1` the first. Optional, and defaults to `1`."** Ambiguous: is the *argument* optional, or the operation? I guessed the argument.

## Words and phrases I had to guess

- **`.node`** — guessed: some internal wrapper object, and `.node` unwraps it. Never defined.
- **"built query"** vs the variable named `plan` — guessed these are the same thing. The prose says "built query", every example says `plan`, and neither the writes section nor `out()`/`merge()` calls `.build()`. I eventually worked out that write methods return the built query directly, but only because line 247 says so in passing.
- **"expression"** — used throughout (`sum(expression)`, "written as an expression"). I guessed it means "either an `f.something` or an `fn.something(...)`, never a plain JavaScript value." Line 145 half-confirms this. But `f.bio.set('x')` and `MongoFieldFilter.eq('kind', 'tutorial')` both take plain values, so the rule clearly does not hold everywhere and the page never says where the boundary is.
- **"a plain string, names a different database"** (line 436) — guessed "plain" just means "a string, not an options object."
- **"Root-level writes"** — guessed: called on `from(...)` before any stage.
- **"an `N`-variant"** (line 85 heading) — guessed: the family of accumulators ending in `N`. Coined jargon in a heading.

## Where I asked "so what do I actually type?" and got no answer

1. **`$and`, `$or`, `$not`, `$switch`, `$ifNull`, `$map`, `$reduce`, `$filter` have no helper** (line 109). This is the most common thing I would need — an OR condition — and the page stops at "no helper." Do I use `pipe()`? `rawCommand()`? Nest `fn.cond`? Not said. This is the single biggest gap on the page.
2. **The 28 stage classes in line 190.** Only `MongoMatchStage`, `MongoCountStage`, and `MongoFieldFilter.eq` get a shape. I have no idea what `new MongoLookupStage(...)` takes. Same for `MongoFieldFilter` — `eq` is the only method shown; I do not know if `gt` exists.
3. **Getting an id back as a string.** Lines 192 and 304 both tell me the TypeScript type lies and I get an `ObjectId`. Neither tells me what to do about it.
4. **Filtering by `_id`.** Line 467 says the typed builder cannot do `_id` equality filters. That is a severe limitation mentioned as a subclause. The fix is the last example, which is good, but I only found it after reading the whole page.
5. **`fn.convert`'s `to` values** (line 144) — `'int'` and `'objectId'` are shown as examples. The full list is elsewhere, unlinked.
6. **`merge()`'s `on`** (line 437) — "the field or fields to match on." String, or array of strings? The example shows a string only.
7. **`out()` and `merge()` "produce no rows of their own"** (line 439). So what does `await runtime.query(plan)` return? Empty array? Undefined? The example discards it, which does not tell me.
8. **`upsertOne` on the root** (line 290) takes two callbacks with no labels. I inferred filter-then-updater from the heading text, not from the code.

## Where the page explains internals when I only wanted to know what to do

- **Line 190's 28-class list.** I wanted "here is how to add a raw stage." I got the module's whole export list. One example plus a pointer would do.
- **The `.node` table (129).** This is a description of how the builder represents expressions internally, presented as a rule I must memorize.
- **Line 222 — "`aggregate()` is an alias that returns the identical query. Write `build()`."** If `build()` is the answer, the alias is trivia.
- **Line 224–228 — the "Return type" table** has one row and restates the sentence above it.
- **Line 362 — "the unknown key is ignored and the default `'after'` applies."** Useful warning, but the mechanism explanation ("a typo produces a wrong but plausible result") is longer than the instruction.

## Could I do what the page is for, after one reading?

Partly. I could write a `group()` with `count`, `sum`, `avg`, `min`, `max`, `first`, `last`, `push`, `addToSet`. I could write a simple `project()` with arithmetic or string helpers. I could do `insertOne`, `insertMany`, `updateMany` with operator form, `deleteMany`, and `findOneAndUpdate` with `returnDocument`. The write sections are the strongest part of the page: the examples match the prose and each shows the result shape.

What I would still not know:

- Whether my `fn.*` value needs `.node`, plain, or `expr(...)` at any call site I have not memorized — and I would get it wrong, because the page gives me a list, not a rule.
- How to express OR, AND, or a null fallback. I would be stuck the first time I needed `$or`.
- How to build any raw stage other than `MongoMatchStage` and `MongoCountStage`.
- Which helpers take positional arguments in which order, without opening MongoDB's docs.
- What `.node` actually is.
- How to get a string `_id` out of a `findOneAndUpdate()` result.
- Whether values I pass to `insert*` and `match()` are converted (line 249 says no; part 1's "decoded" promise says the read direction is converted). I would have shipped a bug here.