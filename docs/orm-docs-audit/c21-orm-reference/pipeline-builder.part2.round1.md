# Reader report: `pipeline-builder.part2.mdx`

I have used Prisma ORM 7 for two years. I have never seen this builder. Here is what stopped me.

---

## 1. Sentences I could not restate after one reading

**Line 33** — "The examples below are the common accumulators, all executed against a live database. The `N`-variants (`firstN` shown), `top`/`bottom`, and the standard-deviation accumulators share the same call shapes; `firstN` is exercised here as a representative of the family."

Stopped by: "executed against a live database" and "exercised here as a representative of the family". This is a note about how you tested the docs, not about how I use the thing. I do not care where you ran them. "Exercised" is test-suite vocabulary. Plainest wording: "`firstN` is shown below. `lastN`, `maxN`, and `minN` are called the same way." And drop the live-database clause entirely.

**Line 33, second half** — "In every signature, `sortBy` is a plain `{ field: 1 | -1 }` object and `n` is an expression, so pass `fn.literal(2)` rather than `2`."

Stopped by: "`n` is an expression". At this point in the page "expression" has not been defined — expression helpers start 80 lines later. I only learned from the trailing example what I actually type. Plainest wording: "`n` must be wrapped: write `n: fn.literal(2)`, not `n: 2`." Also `1 | -1` is never spelled out; I guessed ascending/descending.

**Line 120** — "The `fn.*` namespace covers 73 of MongoDB's aggregation expression operators. It is not all of them: there is no `fn.and`, `fn.or`, `fn.not`, `fn.switch`, `fn.ifNull`, `fn.map`, `fn.reduce`, or `fn.filter`, and arithmetic stops at `add`, `subtract`, `multiply`, and `divide`."

Too many ideas in one paragraph, and it tells me what is missing without ever telling me what is there. The table below it is headed "Helpers (examples)" — so eight helpers are named out of 73 and the other 65 are unlisted. I cannot use this page to find out whether `fn.substr` or `fn.dateAdd` exists. This is the biggest gap on the page.

**Line 127** — "Return a boolean expression; use `.node` where a raw expression is required."

Stopped by `.node`. It is never defined anywhere on the page. It is used at lines 136, 180, 407, 428 and I still do not know what it is or when I need it, beyond "`fn.cond` wants it and `match()` does not". Plainest wording: say what `.node` gives you and give me a one-line rule for when to add it.

**Line 136-138** — the `fn.cond` / `expr()` remarks.

The rule is buried under an internal crash message: "throws `TypeError: visitor.expr is not a function`". That error names an internal thing called a "visitor" that I have no way to connect to anything. Plainest wording: "Inside `fn.cond()`, pass `fn.eq(a, b).node`. Inside `match()`, pass `expr(fn.eq(a, b))`."

**Line 138** — "`fn.toObjectId(fn.literal(id))` throws (`Cannot read properties of undefined (reading 'codecId')`), because `fn.literal()` has no field type information."

"codecId" is your internals leaking. So is "field type information". And the fix — "Give `fn.toObjectId()` an expression taken from the `f` argument instead" — has no example, so I still do not know what to type when the ObjectId I want to convert is a string variable from my own code and not a field on the document. That is the normal case and the page does not cover it.

**Line 207** — "It keeps the row type you already had; `pipe<NewShape>(stage)` lets you declare a new one. Whatever the row type says, the rows are no longer decoded, because a stage the builder does not recognise drops the result shape."

Three ideas, one sentence, and the key word "decoded" is never defined. It appears again at lines 259, 322, 466, 468. I guessed it means "converted from raw BSON into the model's types", but the page never says so. Plainest wording: "After `pipe()`, the rows come back exactly as MongoDB returns them — dates and ids are raw driver values, whatever the TypeScript type claims."

**Line 247** — "A bare (non-array) operation throws as soon as you call the write method: `Error: Unreachable: items.length > 0 but first is undefined`. This is an internal consistency guard, not a friendly validation message..."

You are apologising for a bug in the middle of a reference. I do not need the crash text or the words "internal consistency guard". The rule is one sentence: "Always return an array." Then: "(Some older internal material shows the bare form. That is incorrect.)" — I cannot resolve "older internal material". I have never seen any internal material. Delete it or name the thing.

**Line 249** — "You cannot mix operator-form ops and pipeline-form (`f.stage.*`) ops in one updater."

Neither form is defined until line 400, 150 lines later. On first reading this sentence is meaningless.

**Line 260** — "The builder does not check it against the model, and its values are stored as you pass them, the same way [`match()`](#match) filter values are."

"stored as you pass them" — as opposed to what? The contrast is never stated, so the warning has no teeth. What actually goes wrong if I pass a string where the contract says Date? The page does not say.

**Line 322** — "Both disappear from the type after a stage MongoDB's `findAndModify` command cannot carry, such as `skip()`; forced past the type system they throw an error whose `code` is `ORM.OPERATION_UNSUPPORTED`."

The worst sentence on the page. "Disappear from the type" plus "a stage `findAndModify` cannot carry" plus "forced past the type system" — three unfamiliar ideas stacked. Plainest wording: "You cannot call `findOneAndUpdate()` or `findOneAndDelete()` after `skip()`. TypeScript will not offer them there." That is all I need.

**Line 386** — "If you force it past the type system, the unknown key is silently ignored and the default (`'after'`) applies."

"Force it past the type system" appears three times on the page (322, 386, and implied at 138) and is never explained. I guessed it means casting with `as any`. Say that, or drop the whole clause — TypeScript already rejects it, so this is an essay about what happens if I defeat my own compiler.

**Line 466** — "`db.query.rawCommand(command)` packages a command node (for example `new RawAggregateCommand(collection, pipeline)`) into a plan, without translating it."

"command node", "without translating it", and (line 462) "bypassing the typed AST". AST is internal architecture. I only want to know: raw pipeline in, untyped rows out.

---

## 2. Words and phrases I had to guess at

| Quote | What I guessed |
|---|---|
| `.node` | Some unwrapped inner value. Still not sure. |
| "decoded" / "undecoded" | Converted from raw driver values to the model's types. Never stated. |
| "result shape" | The TypeScript type of a returned row. |
| "the typed AST" | Your internal query representation. |
| "expression" | Anything built from `fn.*` or taken off `f`. Never defined on this page. |
| "plan" vs "Built query" (line 227) | The same thing under two names. The return-type table says "Built query", the prose everywhere says "plan". |
| "terminals" (anchor `#read-terminals`, and `#pipeline-write-terminals-out-and-merge`) | The last call in a chain. It only shows in anchors, but I saw it. |
| "escape hatch" (208, 467) | A way out of the typed API. Used twice, never unpacked. |
| `_id: null` in every `group()` example | "Put everything in one group." Never said. |
| `1 | -1` in `sortBy` | Ascending / descending. |
| `output` in `acc.top({ output, sortBy })` | The fields to return. Never explained and never shown. |
| `$redact` with `$$KEEP` / `$$PRUNE` (467) | Raw MongoDB features. Nothing on this page tells me what they are or why they are named here. |
| "field path" (line 130, `fn.literal` description) | A reference to a document field, as opposed to a constant. |

---

## 3. "So what do I actually type?" — places the page does not say

1. **`pipe()` has no example at all.** It is the escape hatch and it shows zero code. "`new MongoMatchStage(...)`" — with what arguments? What does the import line look like? I cannot use `pipe()` after reading this.
2. **The 65 unlisted `fn.*` helpers.** I need `fn.substr` or a date-add. The page gives me a naming rule (drop the `$`, camelCase) and five exceptions, but no list, so I have to guess and hope the compiler agrees.
3. **The 14 operator-form operators at line 406** — `inc`, `push`, `pull`, `pullAll`, `pop`, `currentDate`, `setOnInsert`, `rename`. Every example on the page uses `set` and nothing else. What are the arguments to `f.tags.pull(...)`? To `f.views.inc(...)`? To `f.updatedAt.currentDate(...)`? Unanswered.
4. **`merge()`'s `whenMatched` and `whenNotMatched`** (line 440). Named, no values listed, no example. I cannot write a merge that does anything other than the default.
5. **`out()`'s second argument** (line 439): "A second argument names a different database." A bare string? An object? No example.
6. **`acc.top` / `bottom` / `topN` / `bottomN`.** Line 33 says they "share the same call shapes" with `firstN`, but they do not — they take `output` and `sortBy`, and `firstN` takes `input`. So the one worked example does not transfer, and `output` is never shown.
7. **Converting a string id to an ObjectId.** Line 138 tells me the obvious approach throws, and points me at "an expression taken from the `f` argument" — which is not what I have when the id came from a URL parameter. The answer turns out to be `rawCommand()` 330 lines later, but the two are never connected at the point where I hit the problem.
8. **`durationSum: acc.sum(fn.literal(1))`** (line 44). The variable is called "durationSum" but it sums the constant 1, which just counts. I do not learn how to sum an actual field. Show `acc.sum(f.views)`.
9. **`findOneAndUpdate`'s second argument** — is it optional? Both examples pass it. The default is stated, so presumably yes, but the signature is never given.
10. **What `acc.first()` / `last()` mean without a `sort()`.** The example sorts first. The table says "first document in the group" with no warning that this is meaningless unsorted.

---

## 4. Places that explain how the tool works inside, when I only wanted to know what to do

- Line 136: `TypeError: visitor.expr is not a function` — a "visitor" is your code, not mine.
- Line 138: `Cannot read properties of undefined (reading 'codecId')` and "because `fn.literal()` has no field type information" — internal cause for an internal crash.
- Line 207: "because a stage the builder does not recognise drops the result shape" — the reason is internal; the consequence is all I need.
- Line 247: `Error: Unreachable: items.length > 0 but first is undefined` plus "This is an internal consistency guard, not a friendly validation message".
- Line 407: "(which emits an `$addFields`-style stage)" — I do not need to know what it compiles to.
- Line 462/466/467: "bypassing the typed AST", "packages a command node", "without translating it".
- Lines 33, 120: "executed against a live database", "exercised by the test suite", "exercised here as a representative" — three references to your test suite. Your tests are not my concern, and "the ones exercised by the test suite" tells me the table's contents were chosen by what you happened to test, which makes me trust the table less.

---

## 5. Could I do what the page is for, after one reading?

Partly. I could write a `group()` with `count`, `sum`, `avg`, `min`, `max`, `first`, `last`, `push`, `addToSet`. I could write a simple `updateMany` with `set`, a `deleteMany`, an `insertOne`, and a `findOneAndUpdate` with `returnDocument`. Those have real, complete, copyable examples.

I could **not**:

- Use any `fn.*` helper not in the eight-row table, because I have no list of the other 65 and no way to check whether the one I want exists.
- Use any update operator other than `set` — that is 13 of the 14 listed.
- Use `pipe()`, because there is no example and no import.
- Use `acc.top`, `bottom`, `topN`, or `bottomN`, because `output` is undefined and unshown.
- Configure `merge()` beyond the default, because `whenMatched` and `whenNotMatched` have no values listed.
- Convert a string id from my application into an ObjectId for a filter, which is something I do constantly in ORM 7.
- Explain to a colleague what `.node` is, or when a value is "decoded" and when it is not — and both of those change what my code gets back at run time, so not knowing them is a real risk, not a cosmetic one.

The page reads as if it were assembled from a test suite: what was tested got an example, what was not got a name in a table or nothing. The reference sections that matter most for day-to-day work — the full `fn.*` list and the update operators — are the ones reduced to a name.