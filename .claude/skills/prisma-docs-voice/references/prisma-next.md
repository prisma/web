# Prisma Next docs

Read this before writing or reviewing any Prisma Next docs. It governs the
source of truth, the information architecture, the fact-check discipline, the
writing voice, and redirect tracking.

Prisma Next is the next major version of Prisma ORM, available in Early Access.
Docs live in the `prisma/web` repo under `apps/docs/content/docs/`. The Prisma
Next ORM docs are authored at `/docs/orm/next` and become `/docs/orm` when
Prisma Next goes generally available; today's Prisma 7 ORM docs at `/docs/orm`
are then pinned to `/docs/orm/v7`. The Prisma Next getting-started pages live
separately at `/docs/next`. Prisma 7 stays the generally available release.

## Ground truth: fact-check before you write

Prisma Next is still shaping up, so its behavior changes faster than memory or
training data can track. Never write a Prisma Next behavioral claim (a command,
flag, API method, config key, default, or output) from memory. Trace every
claim to **ground truth**: the Prisma Next repo.

Repo: https://github.com/prisma/prisma-next

Clone or fork it locally when you need to check behavior:

```bash
git clone https://github.com/prisma/prisma-next
```

Check claims against these, in rough order of authority:

- `packages/` — the actual implementation. The final word on how an API,
  runtime, or CLI command behaves.
- `examples/` — runnable example apps (per database and framework: Postgres,
  MongoDB, SQLite, Cloudflare Workers, React Router, Supabase, and more). Copy
  real, working code shapes from here instead of inventing them.
- `docs/` — the internal reference set: `docs/reference/` (capabilities,
  MongoDB idioms, CLI patterns, extension packs), `docs/commands/`,
  `docs/glossary.md`, `docs/architecture docs/`, and the topic guides
  (Testing, Serverless Deployment, Error Handling).
- `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `ROADMAP.md` — orientation and
  the phased plan from Early Access to GA.
- The installed agent skills. `npx prisma-next@latest init` (or
  `npm create prisma@next`) in a scratch project writes a `prisma-next.md`
  primer and one `SKILL.md` per workflow under `.claude/skills/<name>/` and
  `.agents/skills/<name>/`. These skills are the authoritative agent workflows;
  use them to verify the exact commands, flags, and setup flow a page teaches.

Completion criterion: every behavioral claim on the page is backed by a
specific repo file, example, or generated command output. If you cannot find
it, you have not verified it.

### Call out deltas from Prisma 7

Readers arrive knowing Prisma 7. When Prisma Next changes a workflow (schema
authoring, the generated client, query API, migrations, CLI, project setup),
name the difference explicitly. A silent difference reads as a typo; a named
**delta** teaches. Point migrating readers at the Migration guide, not at a
buried aside.

### Do not guess

If Prisma Next behavior is unclear, unverifiable in the repo, or still in flux,
do not write a plausible-sounding guess. Flag it: leave a `TODO` with the
open question and the engineering owner, and say plainly that it needs
verification. An honest gap is fixable; a confident wrong claim ships and
misleads.

## Information architecture: follow the spec

The canonical structure for Prisma Next user docs is the user-docs spec:

https://github.com/prisma/prisma-orm-messaging/blob/main/docs-strategy/prisma-next-user-docs-spec.md

It is a private repo; fetch it with `gh`:

```bash
gh api repos/prisma/prisma-orm-messaging/contents/docs-strategy/prisma-next-user-docs-spec.md \
  --jq '.content' | base64 -d
```

Before writing a page, read, in order: the section brief for its group, the
page template that brief names, the canonical example schema, and the style
section. The spec's own "Writers' quick start" lists these.

Load the full spec for detail; the rules that bite most often:

- **The tree** is canonical. Top-level groups (Introduction, Getting started,
  Data modeling, Contract authoring, Fundamentals, Middleware, Extensions,
  Migrations, CLI, Reference, Guides) are stable. Anything that does not fit
  one of them needs a docs RFC, not a new top-level section.
- **One concept per page. Code first, prose second.** Open every page with one
  sentence answering its title, then lead with a working example.
- **Pick one template** and follow it: Tutorial (step-by-step to a working
  result), Concept-and-example (what a thing is and how it behaves), or
  Reference (a scannable lookup for one symbol, flag, or error).
- **Reuse the canonical `User`/`Post` schema and the `db` import.** Do not
  invent a new schema per page unless the topic forces it.
- **Multi-database is one canonical page per symbol**, layered by portability:
  the portable core as the body, a `<DbSupport>` block near the top, and
  per-database differences as `## On <Database>` **delta** sections. Reach for
  `<Tabs>` only when the snippets are short, fully parallel, and have no shared
  core (schema-shape blocks, the `aggregate` case), always Postgres then
  MongoDB. Delta sections beat tabs because they stay crawlable for search and
  cleanly chunkable for agents.
- Reuse existing MDX components (`<Cards>`, `<Tabs>`, admonitions). A new MDX
  component needs an RFC in `prisma/web`.

## Writing voice: direct, assertive, useful

Write for a TypeScript developer, often working alongside a coding agent, who
wants to get something done. The docs read well for both humans and agents:
linear prose, exact product names, one canonical page per concept.

- **Write assertively.** State what to do and why. Imperative headings ("Filter
  results", not "Filtering results").
- **Guide step by step** where the reader must do something; make the next
  action and its reason explicit.
- **Keep explanations succinct.** No filler ("we will explore", "let us dive
  in", "it is worth noting"). Respect the length budgets in the spec's briefs.
- **Avoid conceptual complexity the page does not need.** Teach the decision in
  front of the reader, and link out for depth.
- **No vague hype**, no empty slogans, no dramatic fragments. No em dashes.
- **Exact product names.** Prisma Next is the next major version of Prisma ORM.
  Do not reduce the platform to "just an ORM", and do not blur Prisma ORM (the
  toolkit) and Prisma Postgres (the managed database).
- **Be honest about Early Access.** Do not imply GA or production readiness.
  MongoDB support is still being validated. Avoid unsupported absolutes (`no`,
  `all`, `any`, `automatic`, `instant`) and stacked superlatives (`powerful`,
  `seamless`, `effortless`, `fast`) unless the page shows how or why.

The shift to make, every time:

- Weak (hype, no task): `Curious now? Go use this.`
- Strong (task, reason): `Use this to see how Prisma Next changes the way you
  define models, write queries, and structure your Prisma ORM application.`

## Redirect tracking

Prisma Next docs will eventually become the latest ORM docs, so URLs will move.
For every new or moved Prisma Next section, record the migration decision in the
tracking file before the section merges. See `references/redirects-tracking.md`
for the format, the columns, and where the file lives.
