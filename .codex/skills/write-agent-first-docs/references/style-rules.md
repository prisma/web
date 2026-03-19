# Style Rules

## Core stance

- Write for execution first, then for explanation.
- Put the answer, recommendation, or constraint in the first paragraph.
- Use plain technical language. Sound certain when the repo has a clear default.
- Use second person when it makes the action clearer.
- Prefer short declarative sentences over setup-heavy introductions.

## Tone and cadence

- Aim for a calm, deliberate style similar to Linear's docs: understated, precise, and confident without sounding cold.
- Keep paragraphs short. One idea per paragraph is usually enough.
- Open sections with the point, then add the consequence or exception.
- Prefer sentences that move the reader forward: `Use the pooled string for app traffic.` `Use the direct string for migrations.`
- Use transitions sparingly. If the heading already frames the choice, the first sentence can go straight to the answer.
- Let the structure carry the explanation. Do not add filler sentences to glue sections together.
- Choose simple words over inflated ones. `use`, `open`, `copy`, `run`, `switch`, `bypass`, `reuse` are usually better than longer alternatives.
- Keep the tone matter-of-fact. Do not oversell defaults or narrate obvious steps.

## What strong pages do

- Name the job literally in the title and main headings.
- State when to use the page and when not to use it.
- Use numbered steps for procedures and bullets for options or caveats.
- Keep code examples runnable, minimal, and close to the step they support.
- Explain placeholders on first use.
- Add a short verification section after multi-step procedures.
- End with next steps only when there is a real next decision.

## Sentence patterns to prefer

- `Use X for Y.`
- `Choose X when ...`
- `If you need Y, use X.`
- `X changes one thing: ...`
- `This page covers X. See Y for setup details.`

## Sentence patterns to avoid

- `In this guide, you will learn ...`
- `There are a few different ways to ...`
- `It is important to note that ...`
- `At this point, you can now ...`
- `The main thing to understand is ...`

## Phrase smells

Replace these unless the page truly needs them:

- `This guide walks you through`
- `simply`
- `easily`
- `just`
- `seamlessly`
- `powerful`
- `robust`
- `intuitive`
- `comprehensive`
- `leverage`
- `utilize`
- `allows you to`
- `in order to`
- `navigate to`
- `you can now`

## Heading rules

- Prefer literal task or decision headings such as `Connect Prisma ORM to Prisma Postgres` or `Choose pooled vs direct connections`.
- Avoid filler headings like `Overview`, `Concepts`, `Advanced`, `More`, or `Notes` unless there is no clearer label.
- Do not bury the decision inside a vague heading and a long paragraph.

## Anti-patterns

- Do not open with an intro that says the page exists but does not answer anything.
- Do not repeat the same setup on several pages when one canonical page can hold it.
- Do not mix product overview, task steps, and reference tables on one page.
- Do not hide the default inside tabs when one path is recommended for most readers.
- Do not show four equivalent code paths when one canonical path will do.
- Do not make readers infer defaults, limits, or side effects from examples.
- Do not rely on UI screenshots for required instructions.
- Do not end a procedural page without telling the reader how to verify success.

## Rewrite patterns

### Databases

Bad:
`This guide walks you through connecting to our powerful managed Postgres offering.`

Better:
`Use the pooled connection string for app traffic and the direct string for migrations, introspection, and \`pg_dump\`.`

### APIs

Bad:
`You can now leverage the Management API to seamlessly create projects.`

Better:
`Create a project with \`POST /v1/projects\`, then reuse the returned \`projectId\` for database and connection requests.`

### Clients

Bad:
`Prisma Client allows you to interact with your database in an intuitive way.`

Better:
`Instantiate \`PrismaClient\` once, pass the adapter your runtime needs, and reuse that client across requests.`

### Migrations

Bad:
`This guide walks you through handling migrations in order to keep your schema up to date.`

Better:
`Use \`prisma migrate dev\` for normal schema changes. Use \`migrate resolve\` only when you need to reconcile an already-applied hotfix.`

### Operations

Bad:
`Navigate to the dashboard to easily manage backups and settings.`

Better:
`Open the database, choose **Backups**, and create a restore point before changing retention or cutover settings.`

### Troubleshooting

Bad:
`If you run into issues, there are a few things you can try.`

Better:
`If you see \`prepared statement "s0" already exists\`, your CLI command is going through PgBouncer. Switch Prisma CLI traffic to a direct connection and rerun the command.`

### Generic intro

Bad:
`This page provides an overview of Prisma Postgres integrations.`

Better:
`Use this page to choose the right integration path for Prisma Postgres. Start with the default setup unless your tool needs a client-specific exception.`

### Tone tightening

Bad:
`There are two connection strings available for Prisma Postgres, and choosing the right one depends on what you are trying to do.`

Better:
`Every Prisma Postgres database has two connection strings. Use pooled for app traffic and direct for tooling.`

Bad:
`If you are working in a serverless environment, you may want to consider reusing your client when possible.`

Better:
`In serverless runtimes that reuse containers, create one client and reuse it. Otherwise you will burn through pooled connections faster than you expect.`

## Drafting checklist

- Is the first paragraph useful without reading the rest of the page?
- Does each heading describe a concrete job, decision, symptom, or fact?
- Is there one clear default path?
- Did you link to canonical setup instead of duplicating it?
- Does every non-trivial procedure include a verification step?
