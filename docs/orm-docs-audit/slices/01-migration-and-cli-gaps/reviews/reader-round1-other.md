# Round 1 cold read: other pages

Reader: a developer who used Prisma ORM 7 for two years and has never seen Prisma ORM 8. Read the introduction of each page plus the section holding each change.

## (index)/prisma-orm/from-scratch.mdx

### CHANGED

1. "The lines `across 1 contract space` and `App space` in the output refer to a [contract space](/orm/migrations/the-migration-graph#terms-used-on-this-page), which is a separate migration history."
   - Stopped me: "separate" from what? I have never had more than one migration history, so I cannot tell what this one is separate from or why a project would have several.
   - Plainer: "Prisma ORM keeps one migration history for your own models, called the `app` space, and one for each extension package that ships its own migrations. The output counts them."
2. "Your own migrations are in the `app` space, in `migrations/app/`, and each extension package that ships migrations, such as pgvector, has its own."
   - Stopped me: this page never uses an extension or pgvector, so "extension package" is a word I have to guess (I guessed: an add-on npm package). The output says `App space` with a capital A and the text says `` `app` space ``; I had to check they were the same thing.
   - Missing: whether I need to do anything about spaces. I assume not, but the paragraph does not say so.

### EXISTING

4 marks (what "signs the database" means; "marker"; the dense `db` ref sentence; the snapshot under `migrations/snapshots/` appearing with no explanation).

### Could I do what the page is for?

Yes. The new paragraph does not block me. I only learn that "contract space" is a thing I can ignore for now, and the page does not say I can ignore it.

## (index)/prisma-orm/quickstart/mongodb.mdx

### CHANGED

1. "A [contract space](/orm/migrations/the-migration-graph#terms-used-on-this-page) is a separate migration history."
   - Stopped me: the same "separate from what?" problem. This page never shows an `App space` line or any second space, so the definition answers a question I did not yet have, and it does not explain the "1" in "across 1 contract space".
2. "Your own migrations are in the `app` space, in `migrations/app/`."
   - Stopped me: this is the first time the page says where step 2 wrote the plan. I would have expected that in step 2, not in the middle of the troubleshooting text for step 3.
   - Placement: these two sentences sit between "The output ends with a summary..." and "If it fails with a connection error...", so they break up the "what success looks like / what to do on failure" flow.

### EXISTING

4 marks (PSL not defined; `prisma-8.md` not explained; why the scaffold writes `.env` but the scripts ignore it; replica set requirements spread across two paragraphs).

### Could I do what the page is for?

Yes. The added sentences do not stop me, but they do not help me either.

## guides/integrations/github-actions.mdx

### CHANGED

1. "`init` installs the agent skills and does not set up Prisma ORM, which `orm init` did in step 2.1."
   - Stopped me: I had to read it twice to see that "which" means "setting up Prisma ORM", not "installing skills". In Prisma ORM 7, `prisma init` set up the project, so this sentence is useful, but it is packed.
   - Plainer: "`init` only installs the agent skills. You already set up Prisma ORM with `orm init` in step 2.1."
   - Missing: whether running `init` in this already set-up project changes or overwrites any file from step 2.1 (`prisma.config.ts`, `prisma-8.md`).
2. "Run `npx prisma@latest init` once to install the Prisma ORM skills for your coding agent and keep them matching your installed packages." (text unchanged, but on the added line)
   - Stopped me: how does running it "once" keep the skills matching my packages later? I guessed something else re-syncs them, but the page does not say what.

### EXISTING

3 marks (`@prisma/cli-engine` as a dev dependency with no reason given; "Those two emitted files are the whole client"; "the prisma-8 skill" in the first prompt is a name I have to guess).

### Could I do what the page is for?

Yes for the section. I would still not know whether `init` touches my existing files.

## orm/extensions/using-extensions.mdx

### CHANGED

1. Removed link at the end of "`db` itself has no `orm` or `sql`: those live on the three role-bound clients." and the removed paragraph listing runnable example projects.
   - Stopped me: the Supabase note is the hardest setup on the page (a different config import, a different client factory, JWKS versus HS256, role-bound clients, `db sign` after upgrades), and it now ends with no complete project to look at. I still ask "so what do I actually type?" for the step after this: where `jwt` comes from in a request handler, and what a query on `await db.asUser(jwt)` looks like. The removed example link was the only place that would have answered that.

### EXISTING

6 marks ("Supabase publishes no `control` entry point"; "pack"; the JWKS / ES256 / HS256 paragraph; `supabase status` printing `JWT_SECRET`; the `db sign` / `MIGRATION.CONTRACT_SPACE_VIOLATION` paragraph explaining internals; "The database packages are in the table too.").

### Could I do what the page is for?

For pgvector, yes. For Supabase, I could write the config and the client, but not the first real query as a user.

## orm/migrations/editing-a-migration.mdx

### CHANGED

1. "The Migration API reference shows both helpers in full, under [MongoDB operations](/orm/reference/migration-api#mongodb-operations), and the listing below is the migration that calls them:"
   - Stopped me: the listing calls `existingProductsWithoutStatus` and `backfillRun`, which are not on this page, so I cannot copy a working migration from here. I also do not know where the helpers go: in the same `migration.ts`, above the class, or in another file.
   - Missing: the listing imports only `dataTransform` and `setValidation`, but the paragraph says `AggregateCommand` and `RawUpdateManyCommand` come from `@prisma/orm-mongo/query-ast/execution`. The listing does not show that import.
2. The paragraph as a whole (all of it is on the added line; only the last sentence is new text): eight sentences with imports, the shape of `check`, two command classes, a constructor signature, two helper names, `storageHash`, and `setValidation` in one block. I could not restate it after one reading.
   - "The example below needs no `db` statements, because it builds its queries directly": I do not know what "`db` statements" are. I guessed it refers to the PostgreSQL example earlier on the page.
   - "each of them takes the end contract's `storageHash`, because every MongoDB query records the hash of the contract it was built for": this is how the tool works inside. I only need "pass `storageHash` to each helper".

### EXISTING

3 marks (the `migration.json` hash paragraph is internals; "recompile" used before it is fully explained; the inline `db` ref definition in the last introduction paragraph).

### Could I do what the page is for?

For PostgreSQL, the introduction is clear. For MongoDB, not from this page alone: I must open the reference to get the helpers, and I still would not know where to put them.

## orm/reference/migration-api.mdx

### CHANGED

1. "The first of the two helpers below finds documents with no `status` and limits to one, and the second sets it, where `RawUpdateManyCommand` takes the collection name, a filter, and an update:"
   - Stopped me: three ideas in one sentence. "limits to one" does not say why (I guessed the check only needs to know whether any document is left). "sets it" does not say to what (the code shows `'active'`).
   - Plainer: "The first helper finds one document that has no `status`. The check uses it to see whether any are left. The second helper sets `status` to `'active'` on every such document. `RawUpdateManyCommand` takes the collection name, a filter, and an update."
   - Missing (caused by the removed link to the full example file): the page does not say where these helper functions live relative to the `Migration` class, so I cannot assemble the full `migration.ts`.

### EXISTING

5 marks (`meta` in the code has `target` and `lane` fields that the prose does not mention, and I cannot tell whether `'mongo-pipeline'` versus `'mongo-raw'` matters; "a frozen copy of the contract"; `invariantId?` unexplained; the `filter` and `expect` fields named but not explained; `collMod` `meta` argument).

### Could I do what the page is for?

I could look up each MongoDB function. I could not write a MongoDB data transform from scratch without guessing the `meta` values and where the helpers go.
