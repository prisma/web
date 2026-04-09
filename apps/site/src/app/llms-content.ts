import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/site-metadata";
import { getBaseUrl } from "@/lib/url";
import { plans, usagePricing } from "./pricing/pricing-data";

type LlmsPage = {
  path: string;
  title: string;
  description: string;
};

const sitePages: LlmsPage[] = [
  {
    path: "/",
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
  },
  {
    path: "/postgres",
    title: "Prisma Postgres | Instant Global Databases",
    description:
      "Managed Postgres with zero setup, connection pooling, backups, and enterprise-grade security.",
  },
  {
    path: "/orm",
    title: "Prisma | Next-generation ORM for Node.js & TypeScript",
    description:
      "Type-safe database access, schema modeling, migrations, and intuitive workflows for modern application development.",
  },
  {
    path: "/studio",
    title: "Prisma Studio — Visual Database Browser & Editor",
    description:
      "Visual database browsing and editing for Prisma projects, available locally and in Prisma Console.",
  },
  {
    path: "/mcp",
    title: "Prisma MCP Server — AI-Powered Database Management",
    description:
      "Manage Prisma Postgres databases with natural language in AI tools like Cursor, Claude Code, ChatGPT, and VS Code.",
  },
  {
    path: "/pricing",
    title: "Pricing — Prisma Postgres Plans & Features",
    description:
      "Prisma Postgres plan details, included usage, database limits, support levels, and compliance coverage.",
  },
  {
    path: "/enterprise",
    title: "Streamline your enterprise development workflow with Prisma",
    description:
      "Enterprise-focused Prisma ORM support and workflow improvements for larger teams and solution providers.",
  },
  {
    path: "/stack",
    title: "Prisma in your stack | Prisma",
    description:
      "Framework, language, and database integrations for teams building with Prisma across modern stacks.",
  },
  {
    path: "/ecosystem",
    title: "Prisma ORM Ecosystem",
    description:
      "Community-built tools, generators, middleware, and integrations around Prisma.",
  },
];

function toAbsoluteUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl).toString();
}

function paidPlanYearlyPrice(monthlyPrice: number, yearlyDiscount: number) {
  return monthlyPrice * (1 - yearlyDiscount);
}

export function buildLlmsIndexContent(baseUrl = getBaseUrl()) {
  const pagesList = sitePages
    .map((page) => {
      const url = toAbsoluteUrl(baseUrl, page.path);
      return `- [\`${page.title}\`](${url}): ${page.description}`;
    })
    .join("\n");

  return `# Prisma Website

Prisma provides Prisma ORM, Prisma Postgres, Prisma Studio, and the Prisma MCP Server.

## Key Pages

${pagesList}

## Options

- [Full website content](${toAbsoluteUrl(baseUrl, "/llms-full.txt")})
`;
}

export function buildLlmsFullContent(baseUrl = getBaseUrl()) {
  const starterYearly = paidPlanYearlyPrice(
    usagePricing.starter.baseMonthlyPrice,
    usagePricing.starter.yearlyDiscount,
  );
  const proYearly = paidPlanYearlyPrice(
    usagePricing.pro.baseMonthlyPrice,
    usagePricing.pro.yearlyDiscount,
  );
  const businessYearly = paidPlanYearlyPrice(
    usagePricing.business.baseMonthlyPrice,
    usagePricing.business.yearlyDiscount,
  );

  return `# Prisma

Base URL: ${baseUrl}
Primary website: ${toAbsoluteUrl(baseUrl, "/")}
Documentation: ${toAbsoluteUrl(baseUrl, "/docs")}
Blog: ${toAbsoluteUrl(baseUrl, "/blog")}

## Company and product overview

Prisma builds developer tools for working with application data. The main products on this website are Prisma ORM, Prisma Postgres, Prisma Studio, and the Prisma MCP Server.

Prisma focuses on simpler database workflows, type safety, schema management, migrations, visual data browsing, and AI-assisted database operations.

## Prisma homepage

URL: ${toAbsoluteUrl(baseUrl, "/")}
Title: ${SITE_HOME_TITLE}
Description: ${SITE_HOME_DESCRIPTION}

## Prisma ORM

URL: ${toAbsoluteUrl(baseUrl, "/orm")}
Title: Prisma | Next-generation ORM for Node.js & TypeScript
Description: Prisma is a next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, and CockroachDB. It provides type safety, automated migrations, and an intuitive data model.

Key Prisma ORM features:
- Type-safe database access for Node.js and TypeScript applications
- Schema modeling and automated migrations
- Support for PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, and CockroachDB
- Developer workflows designed to reduce boilerplate and query errors
- Integration with Prisma Studio for visual data browsing and editing

## Prisma Postgres

URL: ${toAbsoluteUrl(baseUrl, "/postgres")}
Title: Prisma Postgres | Instant Global Databases
Description: Free to start, no setup, no commitments. Easily grow your database as your app scales.

Key Prisma Postgres features:
- Managed Postgres with zero configuration
- Standard SQL and PostgreSQL wire protocol
- Compatibility with Postgres extensions such as pgvector
- Automatic connection pooling
- Automated backups
- Encryption at rest and in transit
- Full tenant isolation
- Built for production workloads from day one

## Prisma Studio

URL: ${toAbsoluteUrl(baseUrl, "/studio")}
Title: Prisma Studio — Visual Database Browser & Editor
Description: The easiest way to explore and manipulate your data in all of your Prisma projects.

Key Prisma Studio features:
- Visual database browser and editor
- Filtering and search for records and tables
- Local development workflow support
- Team-oriented workflow through Prisma Console
- Multi-tab data exploration and editing
- Embedded data editing experience for Prisma Postgres use cases

## Prisma MCP Server

URL: ${toAbsoluteUrl(baseUrl, "/mcp")}
Title: Prisma MCP Server — AI-Powered Database Management
Description: Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT and other AI agents. Works great with Prisma Postgres.

Key Prisma MCP Server capabilities:
- Natural-language database operations
- Support for AI tools including Cursor, Claude Code, VS Code, Warp, Windsurf, Gemini CLI, and ChatGPT
- Database management and provisioning workflows
- Data analysis through conversational prompts
- Schema and migration workflows
- Enterprise-grade security and OAuth support

## Pricing

URL: ${toAbsoluteUrl(baseUrl, "/pricing")}
Title: Pricing — Prisma Postgres Plans & Features
Description: Get started for free with Prisma Postgres. Choose the right plan for your workspace based on your project requirements.

Pricing summary:
- Free plan: ${plans.free.price.USD}/month, 100,000 operations included, 500 MB storage, 5 databases, no credit card required
- Starter plan: ${plans.starter.price.USD}/month, 1,000,000 operations included, then $0.008 per 1,000 operations, 10 GB storage included, then $2 per GB, 10 databases, daily backups stored for 7 days
- Pro plan: ${plans.pro.price.USD}/month, 10,000,000 operations included, then $0.002 per 1,000 operations, 50 GB storage included, then $1.50 per GB, 100 databases, daily backups stored for 7 days
- Business plan: ${plans.business.price.USD}/month, 50,000,000 operations included, then $0.001 per 1,000 operations, 100 GB storage included, then $1 per GB, 1000 databases, daily backups stored for 30 days

Annual billing note:
- Paid plans include a 25% yearly discount based on the current pricing data
- Starter yearly equivalent: $${starterYearly.toFixed(2)} per month
- Pro yearly equivalent: $${proYearly.toFixed(2)} per month
- Business yearly equivalent: $${businessYearly.toFixed(2)} per month

Support and compliance summary:
- Free: Community support, GDPR
- Starter: Community support, GDPR
- Pro: Standard support, GDPR / HIPAA
- Business: Premium support, GDPR / HIPAA / SOC2 / ISO:27001

## Enterprise

URL: ${toAbsoluteUrl(baseUrl, "/enterprise")}
Title: Streamline your enterprise development workflow with Prisma
Description: Learn how Prisma ORM can improve your team's productivity and explore our tailored ORM support solutions for enterprises and solution providers.

Enterprise page highlights:
- Prisma ORM support for larger teams
- Productivity and workflow improvements
- Tailored support for enterprises and solution providers
- Positioning around build, fortify, and grow application lifecycle workflows

## Stack and ecosystem

Stack URL: ${toAbsoluteUrl(baseUrl, "/stack")}
Stack description: Prisma integrates with popular databases, frameworks, and modern development stacks.

Ecosystem URL: ${toAbsoluteUrl(baseUrl, "/ecosystem")}
Ecosystem description: Prisma has a wider ecosystem of community-built tools, generators, middleware, CLIs, and integrations.

## Key page index

${sitePages
  .map((page) => `- ${page.title}: ${toAbsoluteUrl(baseUrl, page.path)}`)
  .join("\n")}
`;
}
