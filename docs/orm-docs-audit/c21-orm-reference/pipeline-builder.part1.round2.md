# Reader review: `pipeline-builder.part1.mdx`

Reading as a Prisma ORM 7 user, first time on Prisma 8, no source access.

## Sentences I could not restate after one reading

**1. Line 86, the contract paragraph.** Too many new ideas in one place.

> "Your contract is the `contract.prisma` file that replaced `schema.prisma`. Running `npx prisma contract emit` compiles it into two generated files: `contract.json`, read at run time, and `contract.d.ts`, read by TypeScript."

What stopped me: "contract" is a noun I have never seen, and the page uses it as if I know it. I know `schema.prisma`. I do not know what "your contract" is, why the file was renamed, or whether "contract" means the file, the generated JSON, or a concept. Plainest wording I would have understood: "Prisma 8 renames `schema.prisma` to `contract.prisma`. Run `npx prisma contract emit` to generate `contract.json` (used at run time) and `contract.d.ts` (used for types)." Then never use the bare word "contract" to mean something else.

**2. Line 137, the decoding bullet.**

> "Only `match()`, `sort()`, `limit()`, `skip()`, `sample()`, `project()`, `addFields()`, and `vectorSearch()` keep that."

What stopped me: "keep that." I had to scroll back up to work out that "that" means the decoding described in the bullet above. The bullet before it is a bolded paragraph, so the link is not obvious. Plainer: "Decoding only survives these stages: ... After any other stage, including `lookup()` and `group()`, documents come back raw."

**3. Line 159, the match() comparison rule.**

> "The value you pass is compared exactly as you wrote it, with no conversion into the stored type."

What stopped me: "conversion into the stored type" made me stop and build a mental model of encode/decode that the page has not yet given me. Plainer: "Prisma sends your value to MongoDB unchanged. It does not turn a string into an `ObjectId`, a date, or anything else."

**4. Line 643, the redact workaround.**

> "Write `f.rawPath('$KEEP')` instead. The builder adds one more `$`, so the server sees `$$KEEP`."

What stopped me: `rawPath` is introduced here and nowhere else. I do not know what a "path" is in this API, why a method named "rawPath" is the way to express a constant, or whether the one-extra-`$` rule applies anywhere else. This reads as a bug I am being asked to work around, and I cannot tell whether it will keep working.

**5. Line 691, the raw-expression rule for option-object stages.**

> "Build a raw expression with the `fn.*` helpers and pass its `.node` property, or name a field with `MongoAggFieldRef.of('price')`."

What stopped me: `.node`. Nothing on the page says what `.node` is or when I need it. It appears again in the `redact()` example on line 669 — `fn.eq(f.kind, fn.literal('tutorial')).node` — where the first argument has `.node` and the two `rawPath` arguments do not. After one reading I could not state the rule for when to add `.node`.

**6. Line 692.**

> "The stages you pass to `facet` and `unionWith` are classes too: `MongoMatchStage`, `MongoCountStage`, `MongoSortStage`, `MongoLimitStage`, and the rest."

What stopped me: "too" (too, as opposed to what?) and "and the rest." There is no list of the rest and no link to one. I cannot write a `facet` with a `$group` in it from this page.

## Words and phrases I had to guess

- **"contract"** — guessed: the schema file, renamed.
- **"root"** (`from(root)`, "Unknown root") — guessed: the collection name. The page says this on line 95, but uses "root" in the signature before explaining it.
- **"plan"** — every example writes `const plan = ....build()`, while line 127 calls the result "a built query." Guessed these are the same thing and the variable name is arbitrary.
- **"decoded"** (line 136) — guessed: Prisma converts driver values into the types my schema declares.
- **`fn`, `acc`, `expr`** — guessed: three import namespaces for expressions, accumulators, and "wrap this as an aggregation expression." `acc` is explained at line 478. `fn` is never introduced; it just appears in the line 194 example.
- **`fn.literal(2023)`** — guessed: I must wrap plain constants so the builder does not read them as field paths. The page never says why I cannot pass `2023`.
- **`.node`** — guessed: the underlying expression object inside a helper's wrapper. Low confidence.
- **`default_`** (line 737, trailing underscore) — guessed: `default` is a reserved word in JavaScript, so the key was renamed. The page does not say, and I would have typed `default` and been confused.
- **`@@type("mongo/string@1")`, `@@discriminator(kind)`, `@@base(Post, "article")`** — guessed from the prose on line 21. The `@1` version suffix I could not guess at all.
- **"aggregation-time writes with `$out` / `$merge`"** (line 11) — guessed: stages that write results back to a collection.
- **`mongo(...)`** (line 86) — guessed: the Prisma 8 replacement for `new PrismaClient()`.

## Places I asked "so what do I actually type?"

1. **Line 98, the client-free builder.** "passing the `contract.json` you import." I do not know how to import a JSON file in my project, or what path it is at. There is no code block here, and every other entry point has one.

2. **Line 117.** The first example uses `db` and `runtime` with no import lines and no `mongo(...)` call, just a link. The rest of the page has import lines. This is the one example where I most need them.

3. **Lines 199–203, the `_id` warning.** This tells me a thing does not work and names two escape hatches, neither with code. `rawCommand()` links forward to a section I do not have. `db.orm.posts.where({ _id })` is a fragment, not runnable. "Fetch one post by id" is the single most common thing I do, and after reading this section I still cannot type it.

4. **Lines 683–687.** Six stages given as bare parameter lists and nothing else:
   > "`geoNear({ near, distanceField, spherical?, maxDistance?, minDistance?, query?, key?, distanceMultiplier?, includeLocs? })`."

   No types, no descriptions, no example. `near` also appears in the line 691 list as needing a raw expression, so I cannot even guess its shape. Same for `graphLookup`, `setWindowFields`, `densify`, `fill`, `bucketAuto`.

5. **Line 458, the `unwind()` example.** "This example assumes a `tags String[]` field on `Post`, which the example schema above does not have." So the one example I would copy cannot be run against the schema the page gave me.

6. **Line 734, `bucket()`.** `groupBy: MongoAggFieldRef.of('duration')` — but `duration` lives on `Tutorial`, not `Post`, and I am aggregating `'posts'`. Whether that is legal, and whether `MongoAggFieldRef.of` accepts any string or only fields of the root model, is not stated.

7. **Line 669, `redact()`.** The example passes `.node` on one argument and not the others. I would not know which way to write my own.

8. **Line 527, the ORM 7 migration diff.** The `+` line calls `acc.count()` with no import in the diff. Small, but this is the block a v7 user copies first.

## Places that explain the machinery when I only wanted the instruction

- **Line 131:** "`build()` and `aggregate()` are two names for the same method. This page uses `build()`." I only need to be told which one to type.
- **Line 137:** the whole decoding bullet is an explanation of Prisma's internal encode/decode behavior. What I need is the instruction: "after `lookup()` or `group()`, compare ids with `String(a._id) === String(b._id)`." That instruction is there, but buried under the mechanism.
- **Line 643:** "The builder adds one more `$`, so the server sees `$$KEEP`." I do not need to know what the builder adds. I need "write `f.rawPath('$KEEP')`."
- **Line 97:** "If a method is missing from autocomplete, you have already chained past it." This explains why my editor behaves a certain way rather than telling me the rule, which is: call `insertOne`/`insertMany` directly on `from()`, before any stage.
- **Line 13:** "Where a method has not been verified against a running MongoDB, the Remarks say so." This tells me about the state of the documentation team's testing. As a reader I read it as "some of this page may be wrong," which makes me trust the parts with no such note less, not more.

## Could I do what the page is for, after one reading?

Partly.

**Yes:** filter, sort, page, sample, project, add computed fields, join with `lookup()`, group and count, promote a sub-document. The stage sections from `match()` through `sortByCount()` each have a runnable example with imports, and I could copy them and change field names.

**No, I would still not know:**

- **How to get `db` and `runtime` in the first place.** The page assumes them from line 117 onward and hands the setup to two links.
- **How to fetch one document by its id.** The page tells me it is impossible through this builder and does not show me the working alternative in code.
- **What `fn` is, what it contains, or when a value needs `fn.literal(...)` or `.node`.** `fn` is used in six examples and defined in none of them. The page says the definition is in "Expression helpers," which is on the other half.
- **How to use any of the option-object stages except `unionWith`, `facet`, and `bucket`.** The other six are a list of parameter names.
- **Which `Mongo*Stage` classes exist and what their constructors take.** "and the rest" is not enough to write a `facet`.
- **Whether the Atlas stages work.** Line 753: "None of the three has been verified against a running Atlas deployment."

One structural note: the page's opening says it "documents every stage, accumulator, expression helper, and write method." Reading only this half, I hit forward links to `#expression-helpers` and `#rawcommand` four times before the page ends, and two of those (the `_id` workaround and the `fn` namespace) are things I need to finish a basic task, not advanced extras.