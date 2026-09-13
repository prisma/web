# Reader review: `pipeline-builder.part1.mdx`

I have used Prisma 7 for two years. I have never used MongoDB aggregation pipelines seriously. Here is what stopped me.

## 1. Sentences I could not restate after one reading

**Line 19** — "The `posts` collection holds two kinds of document, `Article` and `Tutorial`, told apart by the value of the `kind` field. No example on this page uses them."

This is wrong, or I cannot tell what "them" means. The very next stage example is `.match((f) => f.kind.eq('tutorial'))`, and line 726 says "`duration` is a field on `Tutorial`". So examples do use them. I stopped and re-read three times trying to work out whether "them" meant the models, the `kind` field, or something else. Plainer: say which, or delete the sentence.

**Line 19** — "A type id such as `mongo/string@1` is the stored type plus a version, always `@1` today."

I do not know what a "type id" is, where it comes from, or why I am being told this on a pipeline-builder page. It appears once in the schema, on `@@type(...)` inside an enum, and is never mentioned again. I cannot restate it because I do not know what it is for.

**Line 84** — "`db` is the client you create with `mongo(...)`. See [Transactions and runtime] for how to create it. Prisma ORM 8 renames `schema.prisma` to `contract.prisma`. Run `npx prisma contract emit` to generate `contract.json`, used at run time, and `contract.d.ts`, used for types."

Four unrelated facts in one paragraph: what `db` is, a file rename, a codegen command, and two output files. I had to read it twice to work out that `contract emit` is a thing I must run before any code on this page compiles. That is important and it is buried in the middle of a paragraph about something else.

**Line 135** — "**After `lookup()` or `group()`, compare ids with `String(a._id) === String(b._id)`.** Both a looked-up sub-document's `_id` and the top-level `_id` are the driver's own `ObjectId` values there, not hex strings."

`a` and `b` are never defined. I do not know what two things I am comparing. I guessed: a joined sub-document and a parent document. The plain version would be: "After `lookup()` or `group()`, `_id` values come back as the MongoDB driver's `ObjectId` objects, not strings. `==` between two `ObjectId`s is false even when they are the same id, so wrap both sides in `String(...)` before comparing."

**Line 136** — "Decoding only survives these stages: `match()`, `sort()`, `limit()`, `skip()`, `sample()`, `project()`, `addFields()`, and `vectorSearch()`. After any other stage, including `lookup()` and `group()`, documents come back raw."

"Decoding only survives these stages" — survives means what? I eventually guessed: if my pipeline contains *only* stages from this list, results are converted; add one other stage anywhere and the whole result is raw. But the sentence could equally mean it survives *past* each of those stages and is lost only at the point of a different stage. Those are different rules and I would write different code for each. Also: "come back raw" — raw meaning what, exactly? `ObjectId` objects and driver `Date`s? Say the two or three things that actually change.

**Line 158** — "It is why an `_id` filter never matches: your hex string is compared as a string against a stored `ObjectId`."

Understandable, but then line 199 says the driver's own `ObjectId` does not match either. So the explanation given here does not explain the actual behaviour. After reading both I still do not know why the `ObjectId` form fails.

**Line 643** — "For `$$KEEP` write `f.rawPath('$KEEP')`."

One dollar sign in, two dollar signs out. Nothing says why. I assumed a typo, then assumed `rawPath` prepends a `$`, then gave up. If `rawPath` adds a `$`, say so in the sentence.

**Line 644** — "Every `fn.*` call returns a wrapper. `.node` is the raw expression inside it. `match()` takes the wrapper through `expr(...)`. `fn.cond()`, `redact()`, and the option-object stages take `.node`."

Four sentences, four new concepts, no names I recognise ("wrapper", "node", "raw expression"). I cannot restate this. What I actually need is a rule I can apply: which argument positions need `.node`. Even the example at line 673 has to re-explain it in a code comment, which tells me the prose did not land.

**Line 692** — "Build a raw expression with the `fn.*` helpers and pass its `.node` property, or name a field with `MongoAggFieldRef.of('price')`."

`price` is not a field in the example schema. I looked for it. Use a real field.

## 2. Words and phrases I had to guess

- **"compiles to"** (line 11) — guessed: is translated into, at build time or at `build()` time. I do not know which, and the page later says nothing runs until you execute, so "compiles" may mean neither.
- **"plan"** (line 121, 127) — the page calls it "a built query" and then names the variable `plan`. I guessed these are the same thing. Two names for one object on the same line is avoidable.
- **"built query"** vs **"pipeline"** vs **"chain"** vs **"builder"** — four words circulating. I guessed they are stages of the same object.
- **"root"** (lines 93, 101, 357, 454) — the parameter is called `root` but every example passes a collection name positionally and never types the word `root`. The error message says `Valid roots: ...`. I guessed root = collection. Line 454's example `db.query.from(root).unwind('items')` literally tells me to type `root`, which is not valid code.
- **"There is no `find` and no `distinct`"** (line 11) — guessed this refers to the MongoDB driver's methods. If you have not used the driver, this sentence names nothing.
- **`@@discriminator(kind)`, `@@base(Post, "article")`** (lines 59, 67, 74) — never explained anywhere on the page. Guessed: `Article` and `Tutorial` are subsets of `posts` selected by `kind`. That is Prisma 8 vocabulary I have never met.
- **"Leaf fields"** (line 159) — guessed: scalar fields, as opposed to embedded documents. Why not say "scalar fields", which the same page uses at line 158?
- **"system variables"** (line 642) — guessed: MongoDB's `$$`-prefixed names. Fine if you know MongoDB, opaque if you do not.
- **"expression helper" / "accumulator" / "raw expression" / "document-shaped expression" / "key expression"** — five kinds of expression, no definitions on this page. I guessed from the examples.
- **"decoded"** (line 136) — guessed: converted from driver types to my types.
- **"granularity"** (line 683) — passed through with no explanation at all.

## 3. Places I asked "so what do I actually type?" and got no answer

- **`graphLookup`, `setWindowFields`, `densify`, `fill`, `geoNear`, `bucketAuto`** (lines 683–688). Each gets one sentence and an options list. `output` in `setWindowFields` and `fill` is an object of *what*? `range` in `densify` is what shape? There is not one example among the six. I could not write any of these calls.
- **`startWith` / `groupBy` / `partitionBy` / `near` are "a raw expression"** — said four times before line 692 tells me how to build one. And line 692's two options (`fn.*` + `.node`, or `MongoAggFieldRef.of`) are not the same thing, so I do not know which applies where.
- **The facet example imports `MongoFieldFilter`** (line 707) but `MongoFieldFilter` is not in the list of importable classes at line 693, and nothing documents `MongoFieldFilter.eq('kind', 'tutorial')`. I would have copied the example and had no idea how to change it — e.g. to a `gt` filter.
- **Constructor signatures.** Line 693 lists 28 classes and says "Import them". `new MongoCountStage('count')`, `new MongoSortStage({createdAt: -1})`, `new MongoLimitStage(2)` — I can copy those three. For the other 25 I have nothing.
- **`for await` over it** (line 133). No example. Over what expression? `for await (const doc of runtime.query(plan))`? I guessed, and `await runtime.query(plan)` returning an array makes me unsure the same call can be iterated.
- **Dropping a field with `project()`.** Line 398 says "keeping, dropping, or computing each field" but no example shows `0`, and I would not have known dropping used `0` if the table at line 405 had not listed the type.
- **`unwind('tags')`** takes a plain string while every other stage takes `(f) => f.something`. Nothing says why, and the one example (line 460) explicitly does not work against the example schema. So there is no runnable example of `unwind` on this page.
- **`contract.json` import** (line 116): `import contractJson from './contract.json' with { type: 'json' }`. This needs specific Node and TypeScript settings. Nothing says which.
- **`mongo({ contractJson, url, dbName })`** (line 118) — `dbName: 'app'`. Where does that come from? Is it required? The page sends me to another page for `mongo()` but still shows a half-explained call I must copy.
- **`search(config, index?)`** — what happens if I omit `index`?
- **`acc.*`** is used at line 480 and 501 and defined nowhere on this page. It says "See part 2" nowhere either.

## 4. Places that explain how the tool works inside, when I only wanted to know what to do

- **Line 644**, the wrapper/`.node` paragraph. This is the internal object model. What I need is a rule: "pass `.node` when the argument is X". The code comment at line 673 does a better job than the reference text.
- **Line 158** — "Prisma ORM sends your value to MongoDB unchanged. It does not turn a string into an `ObjectId`, a date, or anything else." This is implementation behaviour. The thing I need is the consequence, and it is in the warning at line 199 anyway.
- **Line 136** — the whole decoding paragraph is framed as "what Prisma does to values" when what I need is "results are normal after these stages; after anything else you get `ObjectId`s and driver dates."
- **Line 131** — "Call `build()`. `aggregate()` is the same method under another name." Knowing there is a second name for the method I should not use is not useful. Say "Call `build()`" and stop.
- **Line 691** — "`geoNear`, `densify`, and `fill` have not been verified against a running MongoDB." This is your internal test status. As a reader I do not know what to do with it — use them or not?
- **Line 199** — "The hex-string form passes TypeScript, so it compiles cleanly and then returns zero documents." The compiler detail is background; the fact I need is "returns zero documents, always", which is already in the first sentence.

## 5. Contradictions I noticed and could not resolve

- **Line 136** lists `vectorSearch()` as a stage that preserves decoding. **Line 745** says `vectorSearch()` is Atlas-only. Reading in order, I met the claim before I knew what the stage was.
- **Line 158** says Prisma sends values unchanged, which is why `_id` filters fail. **Line 203** shows `db.orm.posts.where({ _id: postId })` working with a plain hex string. So the ORM client *does* convert and the pipeline builder does not. Nothing says that, and after one reading I believed the two pages behaved the same way.
- **Line 11** promises "This page documents every stage, accumulator, expression helper, and write method." The page ends at line 760 with no accumulators, no expression helpers, no write methods. I would have scrolled back looking for what I missed.

## Could I do what the page is for, after one reading?

Partly. I could write and run the simple stages: `match`, `sort`, `limit`, `skip`, `sample`, `project`, `addFields`, `count`, `sortByCount`, `group`, `lookup`, `replaceRoot`. Those all have complete, copyable examples against the real schema, and that is the bulk of what I would actually use.

I could not do these things:

1. **Set up the project.** `contract emit`, `mongo(...)` options, and the JSON import are shown but not explained. I would guess and fail at least once.
2. **Write any of the six option-object stages** — `bucketAuto`, `geoNear`, `graphLookup`, `setWindowFields`, `densify`, `fill`. No examples, no shapes for `output` or `range`.
3. **Know when to write `.node`.** The rule at line 644 did not survive one reading. I would trial-and-error against the type checker.
4. **Use `facet` or `unionWith` with anything but the exact stages shown**, because `MongoFieldFilter` is used and never documented, and 25 of the 28 stage classes have no constructor shown.
5. **Use `unwind`**, because the only example needs a field the schema does not have.
6. **Predict when results come back decoded.** I do not know whether the rule is "the whole pipeline" or "up to the first non-listed stage".
7. **Explain `@@base`, `@@discriminator`, or `@@type("mongo/string@1")`** to a colleague, even though they are in the schema every example runs against.

The biggest single gap is the setup paragraph at line 84. Every code block on the page depends on `db`, `runtime`, and `contract.json`, and all three are handled in four sentences that also contain a file rename.