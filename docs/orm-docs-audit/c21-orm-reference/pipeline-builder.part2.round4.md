Read once, top to bottom, as a Prisma 7 user who has never seen this builder.

## Sentences I could not restate after one reading

**1. Line 108, the rename table's last row.**
> `| $first` and `$last` | `fn.firstElem` and `fn.lastElem` | none |

The column is headed "Why". The answer is "none". So two helpers were given different names for no reason? That reads as a mistake or a joke. The other four rows all give a real reason. I'd guess the real reason is a collision with `acc.first`/`acc.last`, but the page will not say. Plainest wording: say the actual reason, or drop the row's "Why" cell rather than writing "none".

**2. Line 95, the definition of an expression.**
> "An expression is an `f.field` value or an `fn.*` value, never a plain JavaScript value. Stage callbacks and these helpers take expressions. The update operators on the [write methods](#write-methods) and the `MongoFieldFilter` methods take plain JavaScript values instead."

Three rules in three clauses, and the third names two things (`MongoFieldFilter`, write-method update operators) that have not appeared yet. I could not hold it. Plainest wording: "Inside a stage, write `f.title` or `fn.toUpper(...)` — never `'hello'` or `3` on their own; wrap constants in `fn.literal('hello')`. Update operators and `MongoFieldFilter` are the opposite: they take ordinary JavaScript values, so write `f.bio.set('hello')`, not `f.bio.set(fn.literal('hello'))`."

**3. Line 125, the `.node` paragraph.**
> "Every `fn.*` helper returns a typed wrapper, and `.node` is the raw MongoDB expression inside that wrapper. Arguments typed as an expression take the wrapper. Arguments typed as a raw MongoDB expression take `.node`, and those are the condition of `fn.cond()`, `redact()`, and the option-object stages..."

I cannot apply "Arguments typed as an expression take the wrapper" to code I am writing, because nothing on the page tells me how to look at an argument and see which type it is. I only ever learn it from the list that follows. The general rule is unusable; the list is the whole answer. Cut the general rule and keep the table.

**4. Line 130, the `.node` table's second row.**
> "The condition argument of `fn.cond()`, and `f.stage.set()`, `f.stage.replaceRoot()`, `f.stage.replaceWith()`"

`f.stage.*` is not defined until line 378, roughly 250 lines later. On first read this row is unresolvable. Also the row is ambiguous: does "the condition argument of" apply to all four items, or only to `fn.cond()`? (It turns out to be only `fn.cond()`, but I had to reach line 416 to be sure.)

**5. Line 161, the named-arguments remark.**
> "Some helpers take one object of named arguments rather than positional ones: `fn.dateDiff({...})`, `fn.dateTrunc({...})`, `fn.dateAdd({...})`, ... and `fn.convert({ input, to, onError?, onNull? })`."

Eleven signatures inside one sentence. I skimmed it and retained nothing. This is a table, not a sentence.

**6. Line 162.**
> "So does every other helper not named above, in the order given for that operator in [MongoDB's aggregation operator reference]."

I can restate this, but what it actually says is: for about sixty of the helpers in your table, this reference page will not tell me the arguments. I have to leave and read MongoDB's docs. That is worth saying plainly rather than burying it in a remark.

**7. Line 163.**
> "To turn a string id from your own code into an `ObjectId`, build the `ObjectId` yourself and put it in a raw pipeline with [`rawCommand()`](#rawcommand). The last example on this page does exactly that."

The last example does not do that. It does `new ObjectId(postId)` in a `$match`. It never converts an id inside a pipeline, which is what `fn.toObjectId` is for. So I could not tell whether the cross-reference was wrong or whether I had misunderstood `fn.toObjectId`.

**8. Line 236.**
> "Write methods are available at three points: on the root collection, after a `match()` filter, and as the last call in a pipeline."

"As the last call in a pipeline" meant nothing until I reached `out()` and `merge()` 180 lines later. The first two points name the position; the third does not name the methods. Plainest wording: "...and at the end of any pipeline, where `out()` and `merge()` write the output into a collection."

**9. Line 242.**
> "Pipeline form calls `f.stage.*`, and can read other fields of the same document."

"Can read other fields of the same document" is the entire reason to choose pipeline form, and it is one trailing clause. I did not understand what it bought me until I saw `f.stage.set({ bio: f.name.node })` at line 416.

## Words and phrases I had to guess

- **"option-object stages"** (line 125). Guessed: stages whose argument is a single options object rather than a callback. The page lists five of them (`bucket()`, `bucketAuto()`, `graphLookup()`, `setWindowFields()`, `fill()`), so I could work out the membership, but never the definition.
- **"typed wrapper"** (line 125). Guessed: an object the builder makes, whose real contents sit in `.node`. This is the tool's internals, not something I need.
- **"combinators"** (line 159). Guessed: the `eq`/`gt`/`in` filter methods. The word is used as if I already know it; the link is to a different page.
- **"`Mongo*Stage` classes, one per MongoDB stage"** (line 202). Guessed: `$unwind` becomes `MongoUnwindStage`. The page never lists them or states the naming rule outright, so I am guessing a class name and hoping the import resolves.
- **"read terminals"** / **"pipeline-write-terminals"** (anchors at lines 222 and 421). Guessed: "terminal" means the call that ends the chain. The word appears only in the anchors, never in the prose, but it is what shows up in the URL I share with a colleague.
- **"decoded"** applied to `pipe()** (line 204): "the rows come back exactly as MongoDB returns them, whatever the TypeScript type claims." Guessed: adding `pipe()` means the pipeline is no longer all-eight-approved-stages, so decoding stops for the whole query. The page does not connect this back to the eight-stage rule, and does not say whether the loss applies to the whole result or only to fields the raw stage touched.
- **"the driver"** (lines 204, 311, 312). Guessed: the `mongodb` npm package. Never introduced.
- **`f.name.node`** (line 416). The `.node` rules at lines 125-131 are all about `fn.*` values. Here `.node` is on a plain field reference. I guessed that field references also carry `.node`, but the rule as written does not cover this case.

## Places where I asked "so what do I actually type?" and got no answer

1. **Argument order for most helpers** (line 162). The table at 112-123 lists roughly a hundred helpers. Apart from the eleven object-argument ones and `slice`/`range`, the page tells me to go read MongoDB's docs. So this reference does not let me write `fn.dateDiff` — sorry, `fn.substr` — without leaving it.

2. **OR/AND/NOT inside `project()` or `addFields()`** (line 160): "Write that stage yourself with `pipe()`, or write the whole command with `rawCommand()`." No example. I have a concrete need (`$or` inside a computed field) and two pointers, neither of which shows the code.

3. **`MongoAndExpr`** (line 158) is named but never imported or shown. Only `MongoOrExpr` has an example. I assume the import path is the same, but I am assuming.

4. **Which `Mongo*Stage` class do I want?** (line 202). Two are shown (`MongoMatchStage`, `MongoCountStage`). There is no list and no stated naming rule, so for any third stage I am typing a name and hoping.

5. **`whenMatched` as an array of update stages** (line 429): "`MongoAddFieldsStage`, `MongoProjectStage`, and `MongoReplaceRootStage` objects". No constructor signatures, no example. I cannot type `new MongoAddFieldsStage(...)` from this.

6. **Can I put `sort()` between `match()` and a write?** Line 311 tells me to "use `findOneAndUpdate()` after a `sort()` when the choice matters", but the section is titled "Writes after `match()`", every example is `match()` then write, and line 313 says `skip()` blocks these methods. I do not know whether the chain is `.match(...).sort(...).findOneAndUpdate(...)` or something else, and no example shows it.

7. **What fields must an insert document have?** Line 253 says "TypeScript requires no particular field, and the builder does not check the record against your contract", yet the example at 265 passes `bio: null` and `address: null` explicitly. Can I leave them out? Should I? The page says the builder won't stop me and then models the opposite.

8. **The two examples I cannot run.** Line 44 ("on a collection with a numeric `views` field") and line 409 (`f.views.inc(1)`, `f.tags.push('mongodb')`) both invent fields the example schema does not have. Every other example uses `users` and `posts`. For `inc`, `push`, `pop`, `pull`, `pullAll`, and `addToSet` — six of the fourteen operators — there is no runnable example at all.

9. **Mixed argument conventions inside one accumulator call** (lines 35-36, 85-86). In `acc.top({ output: f.title, sortBy: { createdAt: -1 } })` I use the `f` argument for `output` and a bare string key for `sortBy`. In `acc.firstN({ input: f.title, n: fn.literal(2) })` I use `f` for `input` and `fn.literal` for a number. Three conventions in two lines. Line 36 flags the `n` rule but nothing explains why `sortBy` keys are bare strings when everything else goes through `f`.

10. **`MongoFieldFilter.eq('kind', 'tutorial')`** (line 148) takes the field name as a string. Everywhere else I write `f.kind`. The page never says that building a filter by hand costs me the typed field reference and the spell-checking that comes with it. I would want that said out loud, because it is the trade I am making.

11. **`neq` vs `ne`.** `MongoFieldFilter` has `neq` (line 159). `fn.*` has `ne` (line 118). Two spellings of the same idea, on the same page, uncommented. I will get this wrong.

12. **`setOnInsert(value)`** (line 398): "A value written only when an upsert inserts a new document." So it only does anything inside `upsertOne`. The page does not say that, and the `upsertOne` examples do not use it.

13. **`fn.toObjectId` throws** (line 163) but, unlike every other failure on the page, no error `code` is given. Elsewhere I get `ORM.MUTATION_DATA_MISSING`, `ORM.ARGUMENT_INVALID`, `ORM.OPERATION_UNSUPPORTED`. Here I just get "throws", so I cannot recognise it in a log.

14. **Line 256** points at "the `match()` warning" for the `_id` rule, and line 457 does the same. Both links go to `#match`, which is in the half I do not have. Inside this page the rule appears twice as a pointer and once as an example, but never as a statement of what actually goes wrong if I try `f._id.eq(someString)`.

## Places that explain the machinery when I only wanted the instruction

- **Line 125**: "Every `fn.*` helper returns a typed wrapper, and `.node` is the raw MongoDB expression inside that wrapper." I do not need to know there is a wrapper object. I need to know: type `.node` in these four situations, and nowhere else. The table right below already does that job.
- **Line 125 again**: "Arguments typed as an expression take the wrapper. Arguments typed as a raw MongoDB expression take `.node`." This describes the type signatures the library authors wrote. It is not actionable, because I cannot see those signatures while typing.
- **Line 204**: "After a `pipe()` stage the rows come back exactly as MongoDB returns them, whatever the TypeScript type claims." The useful half is the second clause — the types lie to you. The framing is about how the builder's decoding step is implemented.
- **Line 311**: "Which document `updateOne` / `deleteOne` picks is up to the driver." Correct but unhelpful. What I need is: do not use `updateOne` when it matters which one; use `findOneAndUpdate` after a `sort()`. The sentence after does say that, so the driver sentence earns nothing.

## Could I do what the page is for, after one reading?

Partly. I could write a `group()` with the common accumulators, do a simple `project()` with `fn.concat`/`fn.toUpper`, and do all the basic writes — `insertOne`, `insertMany`, `updateMany`, `deleteMany`, `upsertOne`, `findOneAndUpdate`. Those have real, runnable, complete examples, and the "return an array" rule at line 238 is stated firmly enough that I would not get it wrong.

What I still would not know:

- The arguments to most of the ~100 expression helpers. The page hands that back to MongoDB's docs.
- Whether to write `.node`, in any situation not literally listed at lines 129-132. The rule is a list, not a principle, so the first unlisted case stops me.
- How to write an `$or` inside a `project()`. I know I must use `pipe()` or `rawCommand()`, and that is all I know.
- Which `Mongo*Stage` class to import for any stage other than match and count.
- How to build the update-stage objects `merge({ whenMatched: [...] })` accepts.
- Whether `sort()` is allowed between `match()` and `findOneAndUpdate()` — which line 311 tells me to do and no example shows.
- How to use `inc`, `push`, `pop`, `pull`, `pullAll`, or `addToSet` against the schema the page uses, since the only examples for them reference fields that do not exist.

The two structural problems, if you only fix two things: line 161's eleven signatures should be a table, and line 162 should not outsource argument order for most of the helper list to another site. A reference page that cannot tell me the arguments is not yet a reference page.