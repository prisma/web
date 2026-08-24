/**
 * The Prisma agent skill served by the docs app at /docs/skill.md.
 * Kept in a lib module so the agent-readiness guard can import and validate it
 * without importing the route handler. Keep the workflow commands in sync with
 * the Prisma Postgres quickstart and content/docs/ai/tools/mcp-server.mdx.
 */
export const agentSkillMarkdown = `---
name: prisma
description: Set up and use Prisma ORM with Prisma Postgres — define a schema, run migrations, generate Prisma Client, and query a PostgreSQL database in TypeScript. Includes the remote Prisma MCP server for managing Prisma Postgres databases.
license: Apache-2.0
compatibility: Node.js and TypeScript projects using Prisma ORM (Prisma Client) and Prisma Postgres.
metadata:
  product: Prisma ORM + Prisma Postgres
  version: "7"
  documentation: https://www.prisma.io/docs
  llms_txt: https://www.prisma.io/docs/llms.txt
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
---

# Prisma

Prisma is a next-generation TypeScript ORM and a managed PostgreSQL database:

- **Prisma ORM** — a type-safe database toolkit. You define your data model in a Prisma Schema, Prisma Migrate turns it into SQL migrations, and Prisma Client gives you a fully typed query API.
- **Prisma Postgres** — a fully managed PostgreSQL database that scales to zero and integrates with Prisma ORM and Prisma Studio.

Prisma changes between versions. Before implementing a feature, verify against the current docs at https://www.prisma.io/docs and the changelog at https://www.prisma.io/changelog.md. Do not rely on training data for Prisma APIs, configuration, or conventions.

## Golden workflow

These are the core commands for a new TypeScript project (copied from the Prisma Postgres quickstart). Run the CLI with \`npx\`:

1. **Initialize the project and install dependencies**

   \`\`\`bash
   npm init -y
   npm install typescript tsx @types/node --save-dev
   npx tsc --init
   npm install prisma @types/pg --save-dev
   npm install @prisma/client @prisma/adapter-pg pg dotenv
   \`\`\`

2. **Configure ESM support.** Update \`tsconfig.json\`:

   \`\`\`json
   {
     "compilerOptions": {
       "module": "ESNext",
       "moduleResolution": "bundler",
       "target": "ES2023",
       "strict": true,
       "esModuleInterop": true,
       "ignoreDeprecations": "6.0"
     }
   }
   \`\`\`

   Then enable ESM in \`package.json\`:

   \`\`\`json
   {
     "type": "module"
   }
   \`\`\`

3. **Scaffold Prisma ORM.** This creates \`prisma/schema.prisma\`, a \`.env\` with \`DATABASE_URL\`, and \`prisma.config.ts\`:

   \`\`\`bash
   npx prisma init --output ../generated/prisma
   \`\`\`

4. **Provision a Prisma Postgres database.** Ask the user for approval before provisioning a hosted Prisma Postgres database — \`npx create-db\` creates a cloud resource. After approval, run it and replace \`DATABASE_URL\` in \`.env\` with the \`postgres://...\` connection string from the CLI output:

   \`\`\`bash
   npx create-db
   \`\`\`

5. **Define your data model** in \`prisma/schema.prisma\`, for example:

   \`\`\`prisma
   generator client {
     provider = "prisma-client"
     output   = "../generated/prisma"
   }

   datasource db {
     provider = "postgresql"
   }

   model User {
     id    Int     @id @default(autoincrement())
     email String  @unique
     name  String?
     posts Post[]
   }

   model Post {
     id        Int     @id @default(autoincrement())
     title     String
     content   String?
     published Boolean @default(false)
     author    User    @relation(fields: [authorId], references: [id])
     authorId  Int
   }
   \`\`\`

6. **Create and apply a migration**, then **generate Prisma Client**:

   \`\`\`bash
   npx prisma migrate dev --name init
   npx prisma generate
   \`\`\`

7. **Instantiate Prisma Client** with the driver adapter and query your database:

   \`\`\`typescript
   import "dotenv/config";
   import { PrismaPg } from "@prisma/adapter-pg";
   import { PrismaClient } from "../generated/prisma/client";

   const connectionString = \`\${process.env.DATABASE_URL}\`;
   const adapter = new PrismaPg({ connectionString });
   const prisma = new PrismaClient({ adapter });

   const user = await prisma.user.create({
     data: { name: "Alice", email: "alice@prisma.io" },
   });
   const users = await prisma.user.findMany({ include: { posts: true } });
   \`\`\`

8. **Explore your data** visually with Prisma Studio:

   \`\`\`bash
   npx prisma studio
   \`\`\`

When you change your schema later, re-run \`npx prisma migrate dev\` to create a new migration and \`npx prisma generate\` to update Prisma Client.

### Safety with destructive commands

Prisma ORM detects when it is invoked by AI coding agents and blocks destructive commands such as \`prisma migrate reset --force\`. Do not bypass this guardrail: stop, tell the user exactly which command you want to run and that it irreversibly destroys all data, and proceed only after explicit user consent.

## Prisma MCP server

Prisma provides a remote MCP server that lets AI tools manage Prisma Postgres databases (create databases, connection strings, and backups; run and introspect SQL) and search the Prisma documentation. It authenticates with Prisma Console via OAuth on first use.

Add it with the standard MCP configuration:

\`\`\`json
{
  "mcpServers": {
    "Prisma": {
      "url": "https://mcp.prisma.io/mcp"
    }
  }
}
\`\`\`

The server exposes a \`search_prisma_documentation\` tool that returns cited answers grounded in the official Prisma docs — prefer it over training data for Prisma questions.

## Installable agent skills

Prisma publishes deeper, task-specific skills in the Agent Skills format (https://agentskills.io/). Installing them into a project gives you version-accurate command and API knowledge without re-reading the docs:

\`\`\`bash
npx skills add prisma/skills          # Prisma CLI, Prisma Client, Prisma Postgres, Prisma Compute, upgrade guides
npx skills add prisma/prisma/skills   # Prisma 8 (also installed automatically by \`npx prisma@next orm init\`)
npx skills add prisma/composer        # Prisma Composer
\`\`\`

The catalog of skills and what each one teaches: https://www.prisma.io/docs/ai/tools/skills.md

## Documentation for agents

- **Index:** https://www.prisma.io/docs/llms.txt — links to per-area indexes (Prisma ORM, Prisma Postgres, Guides, CLI, Studio, Platform, and more).
- **Full content feed:** https://www.prisma.io/docs/llms-full.txt — the current docs as a single machine-readable file.
- **Any page as Markdown:** append \`.md\` to any docs URL, e.g. https://www.prisma.io/docs/orm/prisma-client.md.
- **Changelog:** https://www.prisma.io/changelog.md — check before implementing to catch breaking changes.
`;
