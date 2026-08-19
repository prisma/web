import { getBaseUrl } from "@/lib/url";

/**
 * Shared content for agent-facing discovery endpoints:
 * - Agent skill discovery (skill.md + /.well-known/agent-skills/*)
 * - MCP server discovery (/.well-known/mcp*)
 *
 * All content is grounded in the official Prisma documentation. Do not invent
 * commands, flags, tools, or APIs here — keep this in sync with the docs.
 */

export const SKILL_NAME = "prisma";
export const MCP_SERVER_URL = "https://mcp.prisma.io/mcp";

const SKILL_DESCRIPTION =
  "Build type-safe TypeScript and Node.js apps with Prisma ORM and Prisma Postgres. Covers the core Prisma CLI workflow (init, migrate, generate, studio), connecting to a Prisma Postgres database, and the remote Prisma MCP server for managing databases from AI tools.";

/**
 * Tools exposed by the remote Prisma MCP server, as documented in
 * apps/docs/content/docs/ai/tools/mcp-server.mdx. Names and one-line
 * descriptions are copied from the docs; input schemas are not documented.
 */
export const MCP_TOOLS: { name: string; description: string }[] = [
  {
    name: "CreateBackupTool",
    description: "Create a new managed Prisma Postgres Backup.",
  },
  {
    name: "CreateConnectionStringTool",
    description: "Create a new Connection String for a Prisma Postgres database with the given id.",
  },
  {
    name: "CreateRecoveryTool",
    description: "Restore a Prisma Postgres Database to a new database with the given Backup id.",
  },
  {
    name: "DeleteConnectionStringTool",
    description: "Delete a Connection String with the given connection string id.",
  },
  {
    name: "DeleteDatabaseTool",
    description: "Delete a Prisma Postgres database with the given id.",
  },
  {
    name: "ListBackupsTool",
    description:
      "Fetch a list of available Prisma Postgres Backups for the given database id and environment id.",
  },
  {
    name: "ListConnectionStringsTool",
    description:
      "Fetch a list of available Prisma Postgres Database Connection Strings for the given database id and environment id.",
  },
  {
    name: "ListDatabasesTool",
    description: "Fetch a list of available Prisma Postgres Databases for user's workspace.",
  },
  {
    name: "ExecuteSqlQueryTool",
    description: "Execute a SQL query on a Prisma Postgres database with the given id.",
  },
  {
    name: "IntrospectSchemaTool",
    description: "Introspect the schema of a Prisma Postgres database with the given id.",
  },
  {
    name: "search_prisma_documentation",
    description:
      "Answer a natural-language question about Prisma using the official Prisma documentation, returning a cited answer with links back to the docs.",
  },
];

/**
 * The Prisma agent skill in agentskills.io format: YAML frontmatter followed by
 * a markdown body. Served at /skill.md and /.well-known/agent-skills/prisma/SKILL.md.
 */
export function buildSkillMarkdown(baseUrl = getBaseUrl()): string {
  const docsUrl = `${baseUrl}/docs`;

  return `---
name: ${SKILL_NAME}
description: ${SKILL_DESCRIPTION}
license: Apache-2.0
compatibility: ">=0.1.0"
metadata:
  homepage: ${baseUrl}
  documentation: ${docsUrl}
  vendor: Prisma
  version: "1.0.0"
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
---

# Prisma

Prisma is agent infrastructure for TypeScript and Node.js. This skill covers two
products:

- **Prisma ORM** — a type-safe ORM for Node.js and TypeScript with schema
  modeling, automated migrations, and an intuitive query API. It supports
  PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, and CockroachDB.
- **Prisma Postgres** — a fully managed PostgreSQL database that scales to zero
  and integrates with Prisma ORM and Prisma Studio.

> Prisma changes frequently. Before implementing Prisma features, check the
> changelog at ${baseUrl}/changelog.md and the current documentation. Do not rely
> solely on training data for Prisma APIs, configuration, or conventions — these
> can change between versions.

## Core workflow (Prisma CLI)

Run the Prisma CLI with \`npx prisma\`. The typical workflow for a new project:

1. **Set up a TypeScript project with ESM.** Initialize the project, install
   dependencies, and enable ESM before scaffolding Prisma:

   \`\`\`bash
   npm init -y
   npm install typescript tsx @types/node --save-dev
   npx tsc --init
   npm install prisma @types/pg --save-dev
   npm install @prisma/client @prisma/adapter-pg pg dotenv
   \`\`\`

   Set \`"module": "ESNext"\` (along with \`"moduleResolution": "bundler"\`,
   \`"target": "ES2023"\`, \`"strict": true\`, \`"esModuleInterop": true\`, and
   \`"ignoreDeprecations": "6.0"\`) in \`tsconfig.json\`, and add
   \`"type": "module"\` to \`package.json\`.

2. **Initialize Prisma ORM.** Creates the \`prisma/\` directory with a
   \`schema.prisma\` file, a \`.env\` file, and a \`prisma.config.ts\` file:

   \`\`\`bash
   npx prisma init --output ../generated/prisma
   \`\`\`

3. **Create a Prisma Postgres database.** Ask the user for approval before
   provisioning a hosted Prisma Postgres database — \`npx create-db\` creates a
   cloud resource. After approval, run it and copy the \`postgres://...\`
   connection string into \`DATABASE_URL\` in your \`.env\` file:

   \`\`\`bash
   npx create-db
   \`\`\`

4. **Create and apply a migration** after defining models in
   \`prisma/schema.prisma\`. This creates the database tables based on your schema:

   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

5. **Generate Prisma Client** for type-safe database access:

   \`\`\`bash
   npx prisma generate
   \`\`\`

6. **Explore your data** in Prisma Studio, a visual database editor:

   \`\`\`bash
   npx prisma studio
   \`\`\`

### Example schema

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

## Remote MCP server

Prisma runs a remote Model-Context-Protocol (MCP) server that lets AI tools
manage Prisma Postgres databases over HTTP transport. It authenticates with
Prisma Console on first use so your AI tool can access the workspace you choose.

Endpoint: \`${MCP_SERVER_URL}\`

Standard MCP configuration:

\`\`\`json
{
  "mcpServers": {
    "Prisma": {
      "url": "${MCP_SERVER_URL}"
    }
  }
}
\`\`\`

The server exposes tools for creating and listing databases, connection strings,
and backups; restoring backups; running SQL queries; introspecting schemas; and
\`search_prisma_documentation\`, which answers Prisma questions grounded in the
official docs with citations. Once connected, you can prompt your agent to
"List the Prisma tools" for the latest supported tools.

## Installable agent skills

Prisma publishes deeper, task-specific skills in the Agent Skills format
(https://agentskills.io/). Installing them into a project gives you
version-accurate command and API knowledge without re-reading the docs:

\`\`\`bash
npx skills add prisma/skills          # Prisma CLI, Prisma Client, Prisma Postgres, Prisma Compute, upgrade guides
npx skills add prisma/prisma/skills   # Prisma 8 (also installed automatically by \`npx prisma@next orm init\`)
npx skills add prisma/composer        # Prisma Composer
\`\`\`

The catalog of skills and what each one teaches: ${docsUrl}/ai/tools/skills.md

## Where to read the docs

- Docs index (machine-readable): ${baseUrl}/docs/llms.txt
- Full docs corpus: ${baseUrl}/docs/llms-full.txt
- Any docs page as markdown: append \`.md\` to the URL (e.g. ${baseUrl}/docs/getting-started.md)
- Changelog (machine-readable): ${baseUrl}/changelog.md
`;
}

/**
 * Index of available agent skills, served at
 * /.well-known/agent-skills/index.json.
 */
export function buildAgentSkillsIndex(baseUrl = getBaseUrl()) {
  return {
    version: "1.0.0",
    skills: [
      {
        name: SKILL_NAME,
        description: SKILL_DESCRIPTION,
        url: `${baseUrl}/.well-known/agent-skills/${SKILL_NAME}/SKILL.md`,
      },
    ],
  };
}

/**
 * MCP discovery document, served at /.well-known/mcp and /.well-known/mcp.json.
 */
export function buildMcpDiscovery() {
  return {
    version: "1.0.0",
    transport: "http",
    url: MCP_SERVER_URL,
    servers: [
      {
        name: "prisma",
        url: MCP_SERVER_URL,
        transport: "http",
        authentication: "oauth",
      },
    ],
  };
}

/**
 * MCP server card, served at /.well-known/mcp/server-card.json.
 */
export function buildMcpServerCard() {
  return {
    name: "Prisma MCP",
    description:
      "Manage Prisma Postgres databases using natural language. Create and list databases, connection strings, and backups; run SQL queries; introspect schemas; and search the Prisma documentation.",
    version: "1.0.0",
    serverInfo: {
      name: "prisma",
      version: "1.0.0",
    },
    url: MCP_SERVER_URL,
    transport: "http",
    capabilities: {
      tools: true,
    },
    authentication: "oauth",
    tools: MCP_TOOLS,
  };
}

/**
 * MCP server cards collection, served at /.well-known/mcp/server-cards.json.
 */
export function buildMcpServerCards() {
  return [buildMcpServerCard()];
}
