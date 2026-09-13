I read the file once, top to bottom, as a Prisma ORM 7 user seeing this API for the first time. Findings below.

## Sentences I could not restate after one reading

**1. Line 11, the "use the pipeline builder when..." sentence.**
> "Use the ORM client (`db.orm`) for everyday reads and writes across models and relations, and the pipeline builder when you need a stage the ORM client doesn't expose: grouping, `$lookup` joins with post-processing, computed projections, multi-stage transformations, or stages that write the results into a collection (`$out` and `$merge`)."

Too many ideas in one sentence: two tools, five use cases, three new terms. "Post-processing" of what, by what? "Computed projections" means nothing to me yet. Plainer: split it into two sentences and drop the list to three concrete items.

**2. Line 19.**
> "`Article` and `Tutorial` are variants of `Post`. They are stored in the same `posts` collection and told apart by the value of the `kind` field."

"Variant" is a new word the page uses as if I know it. The schema then shows `@@discriminator(kind)` and `@@base(Post, "article")`, neither of which is explained anywhere on this page. I can guess, but I had to.

**3. Line 95.**
> "Passing an unknown collection name throws right away, with an error whose `code` is `ORM.MODEL_UNKNOWN` and whose message is `Unknown root: "<name>". Valid roots: ...`."

"Root" appears here for the first and only time and is never defined. The page has spent a paragraph telling me the argument is a *collection name*, then shows an error that calls it a *root*. I could not tell whether "root" is a third concept.

**4. Line 136.**
> "**After `lookup()` or `group()`, compare ids with `String(a._id) === String(b._id)`**, where `a` is a looked-up sub-document and `b` is the parent document it came from."

This sits in "Building and executing a pipeline", before `lookup()` or `group()` have been introduced. I do not yet know what a "looked-up sub-document" is. The letters `a` and `b` are not in any example on the page, so I had to invent the situation the rule applies to.

**5. Line 137.**
> "**Read results are decoded.** If every stage in your pipeline is one of `match()`, `sort()`, `limit()`, `skip()`, `sample()`, `project()`, `addFields()`, and `vectorSearch()`, results are decoded: `_id` is a hex string and dates are your contract's date type. If any stage is not in that list, including `lookup()` and `group()`, every document comes back raw."

I understood the rule, but not "your contract's date type" — my contract does not declare a date type anywhere I can see, and `createdAt DateTime` in the schema does not tell me what I get back. This is also the most consequential rule on the page and it is a bullet in the middle of a list.

**6. Line 159.**
> "Neither a hex string nor a driver `ObjectId` matches in `match()`. The builder sends the value as a plain object, so an `ObjectId` arrives as its bytes."

Two problems. "The driver" is never introduced — I inferred the MongoDB Node driver. And the second sentence explains the tool's insides to justify a rule; I only need the rule.

**7. Line 161.**
> "To compare computed values rather than a field against a constant, wrap the comparison in `expr(...)`... `fn` holds the helpers that build expressions, and `expr()` wraps one so `match()` accepts it. The `fn.*` helpers take expressions, not plain values, so wrap every constant in `fn.literal()`."

Three new things at once (`fn`, `expr`, `fn.literal`) inside a remark about `match()`. I could copy the example but I could not have written a second one. I still cannot state the rule for when I need `expr()` versus when I do not.

**8. Lines 642–646, the "Call site / What you pass" table.**

This table is dropped inside the `redact()` section, under `redact()`'s remarks, with no heading, no introductory sentence, and no subject. It is plainly about `fn.*` values in general, not about `redact()`. I did not know what it was describing until I had read all three rows. Worse, it is the first mention of `.node`, and `.node` is never defined on this page — the table tells me when to type it but not what it is.

**9. Line 683.**
> "`granularity` picks the bucket size from one of MongoDB's preferred-number series."

"Preferred-number series" is a term I do not know, and the page gives no values. I have no idea what to type.

**10. Line 686.**
> "`setWindowFields({ partitionBy?, sortBy?, output })` computes a value for each document from the documents around it, such as a running total. ... `output` is an object mapping each new field name to `{ operator, window? }`, where `operator` is the accumulator or expression to compute."

I understand the purpose sentence. I cannot picture the `output` object. `{ operator }` — is `operator` a string, an `acc.*` value, an `fn.*` value, a `.node`? No example.

**11. Line 692.**
> "Each stage class takes the same arguments as the MongoDB stage it builds."

Twenty-eight class names are listed, then this sentence tells me to go work out the arguments myself from MongoDB's docs. Only three are then documented. This is a list, not an explanation.

**12. Line 750.**
> "These stages need MongoDB Atlas. The query builds, and MongoDB rejects it when it runs."

I had to read twice. Plainer: "Nothing stops you from building these against a non-Atlas database. The error only appears when you run the query."

## Words and phrases I had to guess

- **"variants"** (line 19) — guessed: subtypes of one model stored in one collection.
- **"root"** (line 95) — guessed: the same thing as the collection you pass to `from()`.
- **"the driver"** (lines 136, 137, 159) — guessed: the official MongoDB Node.js driver, underneath Prisma.
- **"decoded" / "raw"** (line 137) — guessed: converted to friendly JS types versus handed back as the driver produced them.
- **"your contract's date type"** (line 137) — guessed: whatever `DateTime` maps to, probably `Date`.
- **"plan"** (line 123 onwards) — guessed: just the variable name for what `build()` returns. The page says as much at line 129, but the name appears three sections earlier.
- **"raw expression"** (lines 682, 683, 684, 685, 686, 688) — used six times before line 691 tells me how to make one. Guessed: a MongoDB expression object, not a typed builder value.
- **`.node`** (lines 646, 670, 691) — guessed: the plain MongoDB object inside an `fn.*` wrapper.
- **"document-shaped expression"** (line 539) — guessed: an expression that evaluates to an object.
- **"option-object stages"** (line 646) — used in the table before the section of that name exists, at line 676.
- **`@@type("mongo/string@1")`** (line 27) — guessed: how the enum is stored. No idea what `@1` means.
- **"post-processing"** (line 11) — guessed: more stages after the join.

## Places I asked "so what do I actually type?"

1. **Line 97, using the builder without a client.**
   > "You can build the same pipelines without a client. `import { mongoQuery } from '@prisma/orm-mongo/query-builder'`, then `mongoQuery({ contractJson }).from('posts')`."

   It tells me how to *build* a pipeline with no client, and never tells me how to *run* one. If there is no client there is no `runtime.query`. So what do I do with the result? No example, no code block, one line in a bullet.

2. **`build()` itself.** Line 9 says I "finish the chain with the call that builds the query". Every table says "then finish with `build()`". But `build()` has no entry of its own, no options table, no return-type table, unlike every other method on the page. What does it return? Can I inspect it? Can I log the pipeline it produced?

3. **Line 686, `setWindowFields`.** No example anywhere. I cannot type this.

4. **Lines 687–688, `densify` and `fill`.** `{ method }` — which methods? No values given. `bounds` gets its three values spelled out; `method` gets nothing.

5. **Line 683, `granularity`.** No values.

6. **`search()` and `vectorSearch()`.** Lines 751–753 describe the arguments in prose; there is no code example for any of the three Atlas stages. The `search()` call only appears squeezed into a table cell at line 759.

7. **Line 691 contradicts the `bucket()` example.** The bullet says "Build a raw expression with the `fn.*` helpers and pass its `.node` property, or name a field with `MongoAggFieldRef.of('duration')`." The example at line 735 passes `MongoAggFieldRef.of('duration')` with no `.node`. So does `MongoAggFieldRef` need `.node` or not? I would have guessed wrong.

8. **Line 459, `unwind()`.**
   > "This example needs a `tags String[]` field on `Post`, which the example schema does not have."

   The one stage where I most wanted to copy a working example is the one I cannot run. Add `tags` to the schema.

9. **Example output comments assume data I never saw.** Line 629 says "two buckets, each `{ _id: <kind>, count: 1 }`" and line 722 says "facets.totalCount is `[{ count: 2 }]`". The page shows a schema but never shows the documents. I cannot check my results against these.

10. **Three different import paths** — `@prisma/orm-mongo/runtime`, `@prisma/orm-mongo/query-builder`, `@prisma/orm-mongo/query-ast/execution` — with no statement of which things come from which. I had to scan every code block to work out that `fn`, `acc`, `expr` are in one and the `Mongo*Stage` classes in another.

11. **`count()` collides with `acc.count()`.** The page documents a `count()` stage at line 574 and an `acc.count()` at line 505 without ever saying they are different things. I would have typed the wrong one.

12. **`lookup()` with no match.** Line 360 says the joined documents arrive in an array. It does not say what happens when nothing matches — empty array, or missing field?

## Places that explain the insides when I only wanted the instruction

- **Line 159.** "The builder sends the value as a plain object, so an `ObjectId` arrives as its bytes." I do not need to know how the value is serialized. The rule I need is in the warning at line 200.
- **Line 639.** "It prefixes `$` to the string you give it, so `f.rawPath('$KEEP')` reaches MongoDB as `$$KEEP`." Here the internal detail is unavoidable, because the string I type does not look like the string MongoDB sees. But the surrounding sentences — "There is no expression helper for a `$$` variable, and `fn.literal(...)` cannot stand in. The server rejects both `fn.literal('KEEP')` and `fn.literal('$$KEEP')`" — tell me about two things that do not work before telling me the one that does.
- **Line 692.** The full list of 28 internal class names is the implementation surfacing into a reference page. I need the ones I can use in `facet` and `unionWith`, with their arguments.
- **Line 137.** The decode rule is stated as a fact about the library's behaviour with no instruction attached. What do I do about it? Change my comparison code? Convert manually? The page tells me the mechanism and leaves the action to me.

## Could I do what the page is for, after one reading?

Partly. I could write and run a pipeline that filters, sorts, limits, projects, groups, and joins — those five have clear examples I could adapt, and the `groupBy` diff at line 526 is the single most useful thing on the page for someone coming from version 7.

What I would still not know:

- What `.node` is, and therefore when to type it. The table at line 642 gives me three rules for a thing the page never names.
- How to run a pipeline built with `mongoQuery` and no client.
- How to write `setWindowFields`, `densify`, `fill`, `graphLookup`, `geoNear`, `search`, `searchMeta`, or `vectorSearch`. Eight stages are described only in prose bullets with no code.
- What arguments any of the 28 stage classes take, beyond the three used in one example.
- Whether `MongoAggFieldRef.of(...)` needs `.node`.
- What "your contract's date type" is, so I do not know what my dates will actually be.
- What to do about the decode rule beyond being warned it exists.
- What `@@discriminator`, `@@base`, and `@@type("mongo/string@1")` mean in the schema I am told all examples run against.

The biggest single defect is the table at lines 642–646. It is general guidance about `fn.*` values, filed under `redact()`, introducing `.node` with no definition and referring forward to a section that does not exist yet. I would have missed it entirely if I had jumped to the stage I needed, which is how people read reference pages.