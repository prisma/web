# Reader review: `orm/contract-authoring/typescript-schema-builder.mdx`

I have used Prisma 6 for two years. I have never seen "contract", `defineContract`, or any of this vocabulary before.

## Sentences I could not restate after one reading

**1. Line 163, the whole `defineContract` paragraph.** The worst part of the page. Eight facts in one block, several of them about the library's internal wiring rather than what I type:

> "So `field`, `model`, and `rel` have two sources and either one works. The example takes `field`, `model`, and `type` from the argument, and imports `defineContract`, `enumType`, `member`, and `rel`."

What stopped me: I now know the same three names exist in two places and either works, which is exactly the fact that makes me unable to decide what to write. Then the page tells me what its own example chose, which does not tell me what I should choose. Plainer: "Take `field`, `model`, `rel`, and `type` from the callback argument. Import `defineContract`, `enumType`, and `member` from the package, because you use them outside the callback."

**2. Line 165, the MongoDB paragraph.** One paragraph, about fourteen separate facts, announced as "four more ways" and then listing more than four. I cannot hold it. This should be a bulleted list or its own page. I gave up halfway and skimmed.

**3. Line 187.**

> "To store a date with no time, write that model in [PSL](...) and give the field the `Date` type."

This contradicts line 314: "A project names exactly one contract file in its config." If I can only have one contract file and it is TypeScript, I cannot "write that model in PSL". So what do I actually do if one model needs a date-only column — abandon TypeScript authoring entirely for the whole project? The page does not say, and it reads like the two sentences were written by different people.

**4. Line 244.**

> "Prisma ORM checks that the two sides of a relation name the same number of fields."

I cannot resolve this. Every relation helper on this page names exactly one field per side (`by`, `from`, `to` are all single strings). Nothing on the page shows a relation over more than one field, so I do not know what this check is checking or how I would ever trip it.

**5. Line 252.**

> "Each returns a new model builder and leaves the one you called it on unchanged. `rel.belongsTo(User, ...)` may point at either the bare `User` or the chained one, because both carry the same model name."

This is a description of how the builder is implemented. What I wanted to know is "can I pass `User` before I have chained `.sql()` onto it?" Answer: yes. Say that.

**6. Line 281.**

> "The keys in that object are fixed."

Fixed to what? The paragraph mentions `id` and `uniques`. Are those the only two? Is there a third? "The object accepts exactly two keys, `id` and `uniques`" would have been readable.

**7. Line 306.**

> "Prisma ORM compares a hash of the contract across runs, and a contract that changes every run fails that comparison."

Internal mechanism, and the consequence is vague. What fails, and when? Does `prisma contract emit` error out? Does a migration get regenerated? Plainer: "If the contract file produces different output on each run, `prisma <command>` reports <this error>."

**8. Line 308.**

> "Keep the file free of side effects. `prisma contract emit` runs the file, but it does not type-check it. Type errors show in your editor and when you run `tsc`."

The second and third sentences have nothing to do with side effects. Three unrelated ideas under one bullet. Also, the bullet tells me to avoid side effects and never says what counts as one, or what breaks if I have one. The other two bullets in this list both say what goes wrong; this one does not.

## Words and phrases I had to guess

- **"contract"** — I guessed this is the new name for what `schema.prisma` was. The page half-confirms it in the first sentence but then line 22 says the init command "asks how you want to write your **schema**", and the page title/URL says "schema builder". Three words for one thing.
- **`contract.json` and `contract.d.ts`** — named five times, never described. I guessed `.d.ts` is the types my client code uses. I do not know what `contract.json` is for or whether I commit either file.
- **`codecId: "pg/text@1"`** — I guessed "codec" means the rule for converting between the database value and the JavaScript value. I have no idea what the `@1` means — a version of what? The explanation on line 204 only restates the shape, and then sends me to a **raw queries** page to find valid values, which is a strange place to keep a list the enum section depends on.
- **`nativeType`** — guessed: the literal SQL column type.
- **"extension pack"** — line 285 defines it, 230 lines after line 55 uses it. On first read I guessed it was a plugin.
- **`ulid`, `nanoid`, `cuid2`, `ksuid`** (line 189) — I know `cuid` from Prisma 6. The page says "Each names a different format" and stops. I would be picking at random.
- **`pack` vs `control` exports** (line 287) — guessed that one is for the build tooling and one for the contract file. The page says which import goes where and never says why, so I cannot reason about it if I get it wrong.
- **`refs` vs `ref`** — `User.refs.id` on PostgreSQL, `User.ref("_id")` on MongoDB. I guessed they do the same thing.
- **`cols` vs `fields`** — line 281 says they are "the same model fields under two names", which confirms my guess but leaves me wondering why I have to remember two names.

## Places I asked "so what do I actually type?"

1. **`field.column(pg.enum(Role))`, line 215.** Line 198 told me `.column("column_name")` takes a string and sets the column name. Now the same method takes a type. Same name, two unrelated jobs, no acknowledgement. On top of that the snippet has no `import` line, so I do not know where `pg` comes from as a value (the prose says the package exports it, the code does not show it), and it never says whether `Role` has to go in the returned `enums` map the way `Priority` does.
2. **Does `defineContract` on PostgreSQL require the options object?** Every PostgreSQL example passes `{ extensions: { pgvector } }`. I have no extensions. Do I write `defineContract({}, ({ field, model }) => ...)` or `defineContract(({ field, model }) => ...)`? The page never shows the common case — a plain contract with no extensions — which is exactly the case I have.
3. **The two reasons to use TypeScript at all (line 15-16) are never demonstrated.** "build models in a loop from data you already keep in TypeScript, such as one model per entry in a list of table names" is the reason I would come to this page. There is no example of a loop, and no example of splitting models across modules. The page sells a capability and then never shows it.
4. **`.sql({ fk: { name } })` vs `.sql({ foreignKeys: [...] })`, lines 238 and 242.** Two spellings for one thing, `fk` singular object versus `foreignKeys` array. When do I use which? "Ask for one in either of two places" does not help me choose.
5. **Where does the `pgvector` key on `type.pgvector` come from?** I assume it is the key I used in `extensions: { pgvector }`, so renaming the import renames the accessor. Never stated.
6. **`type.pgvector.Vector(1536)` is stored under the key `Embedding1536`.** Is that name arbitrary, or does it appear in the database or in `contract.d.ts`? I do not know whether I am naming something or just holding a local variable.
7. **MongoDB indexes.** "indexes are an `indexes` option on the model" — no example, and the PostgreSQL index syntax uses `constraints.index([cols.x])` which clearly does not apply, since MongoDB has no `.sql(...)`.
8. **`.id()` on a field.** Line 197 lists it. Line 281 says the `field.id.*` helpers already do it. So when do I ever call `.id()` myself — an integer primary key? An existing column? Not shown.
9. **`rel.manyToMany`, line 229.** The example references `Membership` and `Team` out of nowhere. It says "You declare the model for the join table yourself" but does not show what that model has to contain (does it need its own `id`? just the two foreign keys?). The composite-key example on line 276 uses `Membership` again, still never defined.
10. **MongoDB relation arguments are inconsistent with PostgreSQL and with themselves.** `rel.hasMany("Post", { from: "_id", to: "authorId" })` uses a string model name; `rel.belongsTo(User, { from: "authorId", to: User.ref("_id") })` uses the object, and mixes a plain string `from` with a ref-object `to`. PostgreSQL's `hasMany` uses `{ by }` instead of `{ from, to }`. Four shapes across two examples. I would be copying and pasting and hoping.
11. **Do I commit `contract.json` and `contract.d.ts`, and when do I re-run `emit`?** Only after editing the contract? As part of a build script? Never said.

## Places explaining how the tool works when I only wanted to know what to do

- Line 163, the "two sources and either one works" explanation.
- Line 252, "Each returns a new model builder and leaves the one you called it on unchanged."
- Line 281, "`cols` in `.sql(...)` and `fields` in `.attributes(...)` are the same model fields under two names."
- Line 306, "Prisma ORM compares a hash of the contract across runs."
- Line 52, "`prisma contract emit` looks for those two names and nothing else" — the useful half is "export it as `contract` or as the default export"; the rest is about the tool's lookup.
- Line 246, "Pass a string and the typo is reported when `prisma contract emit` builds the contract" — this one earns its place, because it changes what I should type. Most of the others do not.

## Could I do what the page is for, after one reading?

Partly. I could copy the PostgreSQL example, rename models, change field helpers, and get a contract with a one-to-many relation and a table mapping. That is real.

I could not do any of the following without rereading or guessing:

- Write a contract with **no** extension packs, because the shape of `defineContract`'s first argument in that case is never shown.
- Use TypeScript for the reason the page told me to use TypeScript — generating models in a loop or splitting them across modules. No example exists.
- Add a real PostgreSQL `enum` type. The only snippet for it has no imports, reuses `field.column` for an unrelated purpose, and never says where `Role` goes in the returned object.
- Handle a date-only column, because the page's advice contradicts its own rule about having one contract file.
- Choose between `.sql({ fk })` and `.sql({ foreignKeys })`, or between importing `field`/`model`/`rel` and destructuring them.
- Pick an ID format, because the page lists six and describes none.
- Explain to a colleague what `contract.json` is, what `codecId`'s `@1` means, or why a pack has both a `/pack` and a `/control` export.

The page is roughly two pages: a reference for someone who already knows the builder, and a tutorial that never quite commits to showing the plain case. The single biggest fix would be a short, complete, extension-free PostgreSQL example near the top — two models, one relation, no `pgvector`, no `codecId`, no callback destructuring puzzle — before any of the advanced material.