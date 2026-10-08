# Who reads the Prisma ORM docs

Four readers arrive. The first two produce almost all the complaints (Discord, GitHub, and support, August and September 2026). The docs outside `orm/` are built for the third. The fourth never complains.

## The Newcomer

Has never used Prisma. Has an app, or is about to start one, and wants typed queries against a database. Arrives from npm, a search result, or a framework tutorial. Often already ran `bun init` or `npm create next-app` before looking for an ORM, so scaffolding tools that create the app for them are the wrong shape.

What they need on the first visit: install, define models, connect, run one query, in one sitting. They will accept one new idea (the contract) if it pays off on the same page. They will not read a philosophy page first.

How they judge the docs: can I copy the example and does it run.

## The Upgrader

Has used Prisma ORM 5, 6, or 7. Has a running app, a database with data in it, and a migration history. Arrived because `npx prisma` installed Prisma ORM 8 without them choosing it, or because they saw the announcement. Most of the complaints are from this reader.

What they need: first, a straight answer on whether to move now and how to stay on 7 if not. Second, the Prisma ORM 8 name for every Prisma ORM 7 thing they know, or a plain statement that it does not exist yet. Third, the exact sequence to bring an existing database under Prisma ORM 8 control and make the next migration work.

How they judge the docs: against the mental model they already have. Every page that explains contracts before answering "where did `findMany` go" costs trust.

## The Builder

Wants to ship a product on the Prisma platform: Composer, Compute, Postgres, Storage. May be technical, may lean on a coding agent. The ORM is one component. Happy to have tools scaffold the app and happy to hand a prompt to an agent.

The docs root, the framework guides, the agent prompts, and the full-stack tutorial serve this reader well. The problem is that their content occupies the entry points the Newcomer and the Upgrader land on.

## The Agent

Reads the shipped `prisma-8` skill, `llms.txt`, and the `.md` rendition of any page. Never complains. The skill is out of scope for the docs work except where the human pages feed into it; its own defects are in `brief-skill-staleness.md`.

## What this means for the docs

The ORM entry points must serve the Newcomer and the Upgrader before the Builder. Today the order is reversed: the root page is the Builder's, the ORM landing opens with an agent prompt, and the Upgrader gets a two-line note saying Prisma ORM 7 still exists.
