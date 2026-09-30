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
  "Build type-safe TypeScript and Node.js apps with Prisma ORM and Prisma Postgres. Covers the core Prisma CLI workflow (init, migrate, generate, studio), connecting to a Prisma Postgres database, and the remote Prisma MCP server for managing databases, Compute deployments, and Object Storage from AI tools.";

/**
 * Tools exposed by the remote Prisma MCP server, as documented in
 * apps/docs/content/docs/ai/mcp-tools.mdx. Names and one-line
 * descriptions are copied from the docs; input schemas are not documented.
 */
export const MCP_TOOLS: { name: string; description: string }[] = [
  {
    name: "fetch_workspace_details",
    description: "Fetch the details of a Prisma Postgres workspace.",
  },
  {
    name: "list_prisma_postgres_databases",
    description: "Fetch a list of available Prisma Postgres databases for the user's workspace.",
  },
  {
    name: "create_prisma_postgres_database",
    description: "Create a managed Prisma Postgres database and a new project.",
  },
  {
    name: "delete_prisma_postgres_database",
    description:
      "Permanently delete a Prisma Postgres database by ID. This tool cannot delete a project's default database.",
  },
  {
    name: "list_prisma_postgres_connection_strings",
    description: "Fetch a list of available connection strings for the given database id.",
  },
  {
    name: "create_prisma_postgres_connection_string",
    description: "Create a new connection string for a Prisma Postgres database with the given id.",
  },
  {
    name: "delete_prisma_postgres_connection_string",
    description: "Delete a connection string with the given connection string id.",
  },
  {
    name: "list_prisma_postgres_backups",
    description: "List available automated backups for a Prisma Postgres database.",
  },
  {
    name: "create_prisma_postgres_recovery",
    description: "Restore a Prisma Postgres database to a new database with the given backup id.",
  },
  {
    name: "introspect_database_schema",
    description: "Read the schema of a Prisma Postgres database to show its structure.",
  },
  {
    name: "execute_sql_query",
    description:
      "Run SQL to read, modify, or delete data in a Prisma Postgres database, without changing its schema.",
  },
  {
    name: "execute_prisma_postgres_schema_update",
    description: "Execute a schema update on a Prisma Postgres database with the given id.",
  },
  {
    name: "list_object_store_buckets",
    description: "List object-store buckets in the workspace, optionally filtered by project id.",
  },
  {
    name: "create_object_store_bucket",
    description: "Create a new object-store bucket in the given project.",
  },
  {
    name: "delete_object_store_bucket",
    description:
      "Permanently delete an object-store bucket, all objects stored in it, and all its access keys.",
  },
  {
    name: "create_object_store_bucket_key",
    description: "Create an S3-compatible access key for an object-store bucket.",
  },
  {
    name: "delete_object_store_bucket_key",
    description: "Delete an object-store bucket access key. The key stops working immediately.",
  },
  {
    name: "search_prisma_documentation",
    description:
      "Answer a natural-language question about Prisma using the official Prisma documentation, returning a cited answer with links back to the docs.",
  },
  {
    name: "list_prisma_compute_apps",
    description:
      "List Prisma Compute apps in the selected workspace, optionally filtered by project.",
  },
  {
    name: "list_prisma_compute_builds",
    description: "List builds, newest first, with optional project, branch, and state filters.",
  },
  {
    name: "list_prisma_compute_deployments",
    description: "List deployments for a Prisma Compute app, newest first.",
  },
  {
    name: "get_prisma_compute_deployment_logs",
    description: "Read runtime logs for a deployment, one page at a time.",
  },
  {
    name: "promote_prisma_compute_deployment",
    description: "Make a running deployment the live version of an app.",
  },
  {
    name: "rollback_prisma_compute_app",
    description: "Make an existing deployment live, starting it first if it is stopped.",
  },
  {
    name: "start_prisma_compute_deployment",
    description:
      "Start an existing deployment from an already uploaded build. This tool does not build or upload the app.",
  },
  {
    name: "stop_prisma_compute_deployment",
    description:
      "Stop a deployment, disconnecting it from the app's public URL if it is the live version.",
  },
  {
    name: "delete_prisma_compute_deployment",
    description: "Permanently delete a deployment, stopping it first if needed.",
  },
  {
    name: "delete_prisma_compute_app",
    description:
      "Permanently delete an app. To stop and delete its deployments too, set `deleteDeployments` to true; otherwise, active deployments block deletion.",
  },
  {
    name: "set_prisma_compute_env_var",
    description:
      "Set an environment variable for a project's production or preview environment, or override it for one preview branch. Values are encrypted and never returned.",
  },
  {
    name: "delete_prisma_compute_env_var",
    description: "Permanently delete an environment variable by ID.",
  },
  {
    name: "get_prisma_composer_topology",
    description:
      "Show the saved connections between a project's Composer services and resources, with Console links and stored app URLs. The result may be out of date and does not check whether apps are running.",
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

Use this skill to model and query data with Prisma ORM, connect to Prisma
Postgres databases, and manage Prisma Compute apps and Object Storage buckets
through the [Prisma MCP server](${docsUrl}/ai/tools/mcp-server).

> Prisma changes frequently. Before implementing Prisma features, check the
> changelog at ${baseUrl}/changelog.md and the documentation at ${docsUrl}. Do not rely
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
   npm install prisma@7.9.1 @types/pg --save-dev
   npm install @prisma/client@7.9.1 @prisma/adapter-pg pg dotenv
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
manage Prisma Postgres databases, Prisma Compute deployments, and Object Storage
over Streamable HTTP. It authenticates with
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

The server can manage databases and connection strings, list and restore automated
backups, run SQL queries, inspect schemas, and manage Object Storage buckets and keys.
Compute tools list apps and builds, read runtime logs, manage existing deployments,
and set environment variables. The Composer topology tool shows how services connect
and returns Console links; it does not check live app health. The MCP server does
not build or upload source code.

The \`search_prisma_documentation\` tool answers Prisma questions with citations
from the official docs. Full tool list: ${docsUrl}/ai/mcp-tools.md

## Installable agent skills

Prisma publishes deeper, task-specific skills in the Agent Skills format
(https://agentskills.io/). Installing them into a project gives you
version-accurate command and API knowledge without re-reading the docs:

\`\`\`bash
npx skills add prisma/skills          # Prisma CLI, Prisma Client, Prisma Postgres, Prisma Compute, upgrade guides
npx skills add prisma/prisma/skills   # Prisma 8 (also installed automatically by \`npx prisma@latest orm init\`)
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
export function buildMcpServerCard(baseUrl = getBaseUrl()) {
  return {
    name: "Prisma MCP",
    title: "Prisma",
    description:
      "Manage Prisma Postgres databases, Prisma Compute deployments, and Object Storage. Run SQL queries, list and restore automated backups, read app logs, set environment variables, inspect Composer topology, and search Prisma documentation.",
    websiteUrl: baseUrl,
    icons: [
      {
        src: `${baseUrl}/icon.svg`,
        sizes: ["any"],
        mimeType: "image/svg+xml",
      },
      {
        src: `${baseUrl}/apple-icon.png`,
        sizes: ["180x180"],
        mimeType: "image/png",
      },
    ],
    version: "1.0.0",
    serverInfo: {
      name: "Prisma",
      version: "2.0.0",
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
