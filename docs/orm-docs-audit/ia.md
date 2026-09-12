# Information architecture: proposal

Proposal first, then why, then the current state it changes. Source: the `meta.json` files and page titles under `apps/docs/content/docs/` in `prisma/web` on 2026-09-10. Labels are what the sidebar shows.

## Proposed

Scope: the Getting Started > Prisma ORM subtree, the ORM > Introduction group, and the Guides tree (two labels, and the Prisma 7 pages leaving it). Nothing else moves. `+` is a new node, `~` is a renamed or rewritten node, `-` is content leaving the tree, unmarked is unchanged.

### Getting Started > Prisma ORM

```
Prisma ORM
    Introduction to Prisma ORM                      human content first, agent prompt last
  + Release status                                  RC, GA window, 7 support period, what npx prisma installs, how to pin 7
  ~ Start a new app                                 was "Quickstart"; same two pages
      PostgreSQL
      MongoDB
  + Add to an app you already have                  empty or no database: orm init, contract, emit, db init, first query, db.ts shown
      PostgreSQL
      MongoDB
  ~ Adopt an existing database                      was "Add to Existing Project"; adds baseline, ref, second migration
      PostgreSQL
      MongoDB
  + Coming from Prisma 7                            link to the ORM page below, so the Upgrader finds it from here
  + A database on your machine                      prisma dev (no install) first; Composer's local stack; your own Postgres (Docker Compose); how to look at the rows
  + Editor setup
    create-prisma                                   reference; moved to last
```

Four starting states, one group each. "Coming from Prisma 7" is a link node here because the page itself belongs with the API it maps.

"A database on your machine" answers the question every starting state runs into on the first page: where does `DATABASE_URL` come from when I have no hosted database. The site already has the answers, `prisma dev` under Local development and the Composer local stack, but a reader inside the ORM subtree never meets them; the quickstart's "Path A" is the only mention. The node names the three options in order of effort (`prisma dev`, Composer, a Postgres you run yourself with Docker Compose), links to the pages that already exist for the first two, gives the Docker Compose file and connection string for the third, and ends with how to look at the data (Studio against the local instance, or any Postgres client).

### ORM > Introduction

```
Introduction
    Prisma ORM
  + Coming from Prisma 7                            the mapping page: schema and types, CLI, client API, not-yet list
  ~ Core concepts                                   rewritten as narrative from mental-model.md; glossary kept at the end
```

### Guides

```
Overview                                            no "coming soon" line for upgrading; it exists
Upgrade Prisma ORM
  ~ Prisma 7 to 8 (PostgreSQL)                      was "Migrate from Prisma 7 to Prisma 8"
  ~ Prisma 6 to 8 (MongoDB)                         was "MongoDB"
    v7, v6, v5, v4, v3, v1
  - Deployment, Database, Switch to Prisma ORM,      Prisma 7 content; lives under guides/v7
    GitHub Actions, AI SDK, React Router 7, SolidStart
```

The Prisma ORM 8 replacements for those labels sit at the same slugs; C9 (deployment), C11 (CI), and C12 (switching, team workflow) in `changes.md` say what they must cover.

### The ORM root page (`/orm`)

Today the page has six sections: "Your schema becomes a contract", "What changed for developers", "Supported databases", "Get started" (three cards), "Go deeper" (five cards), and "Learn more about the design of Prisma 8" (five blog links). Three of the six argue for the design against Prisma 7. There is no query on the page. A Newcomer cannot tell from it what the product does; an Upgrader is told why it is different before being shown what it is.

Proposed structure, in order:

1. One sentence saying what it is: a typed data layer for TypeScript, for PostgreSQL, MongoDB, and SQLite.
2. The product in one screen: a short contract, the query it enables, and the typed result, side by side. Nothing else above the fold.
3. The four starting-state doors from the Getting Started subtree.
4. What you can do with it: one line and one link each for modeling, querying, relations, transactions, migrations, middleware, extensions. This is the section map, not an argument.
5. Coming from Prisma 7: one line linking to the mapping page.
6. Release status: one line linking to the status page.

The page name follows the naming rule: "Prisma ORM", not "Prisma 8".

Removed from this page: the three-step workflow explanation, "What changed for developers", and the blog list. The first moves into Core concepts; the other two go, or the blog list moves to the bottom of Core concepts.

### Root page (`/`)

The ORM line becomes a short row with the four starting states, linking into the subtree above. The platform hero stays.

### What each proposed node fixes

| Node | Jobs |
| --- | --- |
| Release status | J4 |
| Add to an app you already have | J1 |
| Adopt an existing database (rewritten) | J2 |
| Coming from Prisma 7 | J3, J5 (links to the incremental guide), J6 (attribute map) |
| A database on your machine | J1, J11 |
| Editor setup | J7 |
| Guides labels and overview line | J5 |
| Core concepts rewritten | the "written for AI" complaint, by giving the Newcomer a why-first page |

J8, J9, and J10 need product decisions or shipped code before a node makes sense; they are in `changes.md` under C and D.

### Not proposed

No change to the top-level section list, to Data Modeling, Contract Authoring, Fundamentals, Migrations, Middleware, Extensions, or Reference. Under Guides, only the label changes above and the removal of the Prisma 7 pages (A7). The "Prisma 7" group at the bottom of Getting Started stays as the home for people staying on 7.

## Why: where each job lands today, and where the structure fails it

| Job | Lands on | Structural failure |
| --- | --- | --- |
| J1 existing app, empty database | Add to Existing Project > PostgreSQL | page assumes tables exist; no node for this state |
| J2 existing database with data | Add to Existing Project > PostgreSQL | right node, page stops before the ref step |
| J3 Prisma 7 query mapping | Fundamentals > Reading data | no node; fourteen diff blocks spread over six pages |
| J4 should I move now | root, `/prisma-orm` | no node; note box only says 7 is supported |
| J5 incremental upgrade | Guides > Upgrade Prisma ORM > Migrate from Prisma 7 to Prisma 8 | not linked from any ORM node; three levels down, and the MongoDB twin is labelled only "MongoDB" |
| J6 data types | Data Modeling > Overview | right node; one stale example |
| J7 editor setup | none | no node |
| J8 advanced Postgres | none | no node; needs product answers |
| J9 types | none | no node; API in PRs |
| J10 opt out of agent files | CLI > configuration | right node, unreachable from Getting Started |

Two observations follow from the table.

First, the Getting Started > Prisma ORM subtree is organised by the tool that runs (`create-prisma` for Quickstart, `orm init` for Add to Existing Project) and then by database. The reader does not know those tools yet. The failures in J1 and J2 both happen at the point where the reader's situation differs from the page's assumption about it. The reader knows their situation: do I have an app, do I have a database, does it have data, was it Prisma 7. That is why I proposed organising this subtree by starting state. The database split (PostgreSQL / MongoDB) stays inside each.

Second, the Upgrader has no node anywhere in Getting Started or ORM. Every Prisma 7 pointer is for staying on 7. The one page written for moving to 8 is filed under Guides, three levels down, and its MongoDB twin carries only a database name as its label.

## Current state

Top-level sections, in nav order: Getting Started, ORM, Composer, Local development, AI, Compute, Postgres, Storage, Studio, Query insights, Console, Guides, CLI, REST API, Accelerate.

### Getting Started

```
Start
  Get started with Prisma                    /            platform landing; ORM is one line
  Choose a Prisma 8 setup path               /getting-started
  Deploy the full Prisma stack               /full-stack-tutorial
  Deploy your first app                      /prisma-compute/deploy
Prisma ORM
  Introduction to Prisma 8                   /prisma-orm
  create-prisma                              /prisma-orm/create-prisma
  Quickstart
    PostgreSQL                               /prisma-orm/quickstart/postgresql
    MongoDB                                  /prisma-orm/quickstart/mongodb
  Add to Existing Project
    PostgreSQL                               /prisma-orm/add-to-existing-project/postgresql
    MongoDB                                  /prisma-orm/add-to-existing-project/mongodb
Prisma Postgres
  (quickstarts per ORM, import from existing database, from the CLI)
Prisma 7
  Prisma 7 setup paths                       /v7/getting-started   (for people staying on 7)
```

### ORM

```
Introduction
  Prisma 8                                   /orm
  Core concepts                              /orm/core-concepts
Data Modeling
  Overview, Relational data modeling, MongoDB data modeling
Contract Authoring
  The data contract, Author in PSL, Author in TypeScript, The emitted artifacts, Capabilities
Fundamentals
  Reading data, Writing data, Relations and joins, Transactions, Advanced queries
Migrations
  How migrations work, The migration graph, Generating, Editing, Applying, Rollbacks and recovery
Middleware
  How middleware works, Built-in: budgets, lints, cache, Authoring custom middleware
Extensions
  Using extensions
Reference
  API reference, ORM client, SQL query builder, Pipeline builder, Raw queries, Transactions and runtime, Error reference
```

### Guides (ORM-relevant parts)

Snapshot of 2026-09-10. On 2026-09-11, #8242 rewrote the Deployment, Database, Switch to Prisma ORM, GitHub Actions, AI SDK, React Router 7, and SolidStart pages for Prisma ORM 8 at the same slugs, moved their Prisma 7 versions (and Cloudflare D1) under `guides/v7`, and gave the overview an Upgrading section.

```
Overview                                     /guides   says "Upgrading: moving from Prisma 7" is coming
v7
Frameworks   (Next.js, Hono, TanStack Start, NestJS, Astro, Nuxt, SvelteKit, Elysia, React Router 7, SolidStart)
Runtimes     (Bun, Deno)
Deployment, Authentication, Integrations, Postgres
Database     (Expand-and-contract migrations, Multiple databases, Schema management in teams)
Switch to Prisma ORM, Switch to Prisma Postgres
Upgrade Prisma ORM
  Migrate from Prisma 7 to Prisma 8          /guides/upgrade-prisma-orm/postgresql   Prisma 7 to 8
  MongoDB                                    /guides/upgrade-prisma-orm/mongodb      v6 Mongo to 8
  v7, v6, v5, v4, v3, v1                     older version-to-version guides
Making guides
```

### Where Prisma 7 readers are pointed today

- Root page: one line, "Here for the ORM? Jump straight to Prisma 7 or Prisma 8".
- A note box ("Using Prisma 7?", "Prisma 7", or "Prisma 7 users") on `/orm`, `/prisma-orm`, `/prisma-orm/create-prisma`, all four getting-started pages (PostgreSQL and MongoDB), and `/cli`. It says Prisma 7 remains supported and links to `/orm/v7` and `/v7/getting-started`. Both links are for staying on 7.
- Nothing under Getting Started or ORM links to the upgrade guide. It is reachable only through Guides > Upgrade Prisma ORM, where the PostgreSQL page is labelled "Migrate from Prisma 7 to Prisma 8" and the MongoDB page just "MongoDB" (#8238 relabels both).
