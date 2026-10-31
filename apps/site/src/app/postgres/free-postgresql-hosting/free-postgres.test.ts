import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createFaqStructuredData } from "@/lib/structured-data";
import { stripFaqAnswerMarkup } from "@/lib/faq-answer";
import { renderMarkdownForPath } from "@/lib/markdown-pages";
import { renderFreePostgresqlDatabaseMarkdown } from "@/lib/markdown/free-postgresql-database";
import {
  CONSOLE_SIGN_UP_URL,
  CREATE_DB_COMMAND,
  CREATE_DB_WEB_URL,
  DOCS_CONNECT,
  DOCS_CREATE_DB,
  DOCS_REGIONS,
  FREE_POSTGRES_HERO_SECONDARY_CTA,
  FREE_POSTGRES_DESCRIPTION,
  FREE_POSTGRES_FAQ,
  FREE_POSTGRES_H1,
  FREE_POSTGRES_HERO_CHECKS,
  FREE_POSTGRES_INCLUDED_CARDS,
  FREE_POSTGRES_INCLUDED_NOTES,
  FREE_POSTGRES_INCLUDED_ROWS,
  FREE_POSTGRES_LAST_MODIFIED,
  FREE_POSTGRES_CASES,
  FREE_POSTGRES_LIMIT,
  FREE_POSTGRES_HERO_PRIMARY_CTA,
  FREE_POSTGRES_PATH,
  FREE_POSTGRES_PRIMARY_CTA,
  FREE_POSTGRES_PROBLEM_HEADLINE,
  FREE_POSTGRES_MARKDOWN_SUBHEADLINE,
  FREE_POSTGRES_SUBHEADLINE,
  FREE_POSTGRES_CLAUDE,
  FREE_POSTGRES_CODEX,
  FREE_POSTGRES_COPILOT,
  FREE_POSTGRES_CURSOR,
  FREE_POSTGRES_CLI_CLAIM_URL,
  FREE_POSTGRES_CLI_CONNECTION,
  FREE_POSTGRES_TERMINAL_CLAIM,
  FREE_POSTGRES_TERMINAL_STATUS,
  FREE_POSTGRES_TERMINAL_TABS,
  FREE_POSTGRES_TITLE,
} from "./_content";

const DASHES = /[\u2013\u2014]/;

test("the Markdown rendition prints the page's last-modified date", () => {
  const markdown = renderMarkdownForPath(FREE_POSTGRES_PATH);
  assert.ok(markdown?.includes(`dateModified: ${FREE_POSTGRES_LAST_MODIFIED}`));
});

test("title, meta and H1 match the brief", () => {
  assert.equal(FREE_POSTGRES_TITLE, "Free PostgreSQL Hosting | Prisma Postgres");
  assert.equal(
    FREE_POSTGRES_DESCRIPTION,
    "Free PostgreSQL hosting on Prisma Postgres. Managed PostgreSQL 17 with 2 GB of storage, 200,000 operations a month and up to 50 databases. No credit card and no time limit.",
  );
  assert.equal(FREE_POSTGRES_H1, "Free PostgreSQL hosting");
  assert.equal(FREE_POSTGRES_PATH, "/postgres/free-postgresql-hosting");
  assert.equal(
    FREE_POSTGRES_SUBHEADLINE,
    "A free PostgreSQL database with 2 GB of storage, 200,000 operations a month (one query each), and 50 databases. Prisma Postgres works with any Postgres client.",
  );
  assert.equal(
    FREE_POSTGRES_MARKDOWN_SUBHEADLINE,
    "A **free PostgreSQL database** with **2 GB** of storage, **200,000 operations** a month (one query each), and **50 databases**. Prisma Postgres works with any Postgres client.",
  );
  assert.deepEqual(
    [...FREE_POSTGRES_HERO_CHECKS],
    [
      "Instant databases are deleted in 24 hours unless claimed.",
      "A claimed database, and a database created in the Prisma Console, has no time limit.",
    ],
  );
  assert.ok(!FREE_POSTGRES_SUBHEADLINE.includes("Instant databases are deleted"));
  assert.ok(!FREE_POSTGRES_MARKDOWN_SUBHEADLINE.includes("Instant databases are deleted"));
  for (const line of FREE_POSTGRES_HERO_CHECKS) assert.ok(!DASHES.test(line));
  assert.deepEqual(
    FREE_POSTGRES_INCLUDED_CARDS.map((card) => card.title),
    ["2 GB", "200,000", "Up to 50"],
  );
  assert.deepEqual(
    FREE_POSTGRES_INCLUDED_ROWS.map((row) => row.label),
    [
      "Connections",
      "Data transfer",
      "Postgres",
      "Backups",
      "Extensions",
      "Regions",
      "Query Insights",
      "Prisma Studio",
      "Prisma Compute",
      "App outbound",
      "Prisma ORM",
    ],
  );
  assert.deepEqual(
    FREE_POSTGRES_INCLUDED_NOTES.map((note) => note.text),
    ["Operations reset on the 1st of every month."],
  );
  const includedCopy = [
    ...FREE_POSTGRES_INCLUDED_CARDS.flatMap((card) => [card.title, card.detail]),
    ...FREE_POSTGRES_INCLUDED_ROWS.flatMap((row) => [row.label, row.value]),
    ...FREE_POSTGRES_INCLUDED_NOTES.map((note) => note.text),
  ].join("\n");
  assert.ok(!DASHES.test(includedCopy));
  assert.match(includedCopy, /One query is one operation/);
  assert.match(includedCopy, /Shows which queries are slow and why/);
  assert.match(includedCopy, /A data browser for viewing and editing rows/);
  assert.match(includedCopy, /pooled for the app/);
  assert.match(includedCopy, /pg_dump/);
  assert.match(includedCopy, /similarity search/);
  assert.match(includedCopy, /1 million requests/);
  assert.match(includedCopy, /4 active vCPU-hours/);
  assert.match(includedCopy, /10 GB a month/);
  assert.match(includedCopy, /typed client/);
  assert.ok(!includedCopy.includes("PostGIS"));
  assert.match(includedCopy, /Daily backups start on Starter/);
  assert.match(includedCopy, /Operations reset/);
  assert.ok(!includedCopy.includes("read more"));
  assert.ok(!DASHES.test(FREE_POSTGRES_MARKDOWN_SUBHEADLINE));
  assert.deepEqual(FREE_POSTGRES_HERO_PRIMARY_CTA, {
    label: "Create an instant database",
    href: CREATE_DB_WEB_URL,
  });
  assert.deepEqual(FREE_POSTGRES_HERO_SECONDARY_CTA, {
    label: "Get started",
    href: CONSOLE_SIGN_UP_URL,
  });
  assert.deepEqual(FREE_POSTGRES_PRIMARY_CTA, {
    label: "Create an instant database",
    href: CREATE_DB_WEB_URL,
  });
});

test("FAQ answers strip cleanly and match FAQPage JSON-LD", () => {
  assert.equal(FREE_POSTGRES_FAQ.length, 12);

  const structured = createFaqStructuredData(
    FREE_POSTGRES_PATH,
    FREE_POSTGRES_FAQ.map(({ question, answer }) => ({ question, answer })),
    "Prisma Postgres Free plan FAQ",
  );

  assert.equal(structured["@type"], "FAQPage");
  assert.equal(structured.mainEntity.length, FREE_POSTGRES_FAQ.length);

  for (const [i, item] of FREE_POSTGRES_FAQ.entries()) {
    const plain = stripFaqAnswerMarkup(item.answer);
    assert.ok(!plain.includes("`"), `${item.question}: backtick leaked`);
    assert.ok(!/\[[^\]]+\]\(/.test(plain), `${item.question}: markdown link leaked`);
    assert.equal(structured.mainEntity[i]?.name, item.question);
    assert.equal(structured.mainEntity[i]?.acceptedAnswer.text, plain);
  }
});

test("user-visible content and FAQ schema have no em or en dashes", () => {
  for (const item of FREE_POSTGRES_FAQ) {
    assert.ok(!DASHES.test(item.question), `${item.question}: dash in question`);
    assert.ok(!DASHES.test(item.answer), `${item.question}: dash in answer`);
    assert.ok(
      !DASHES.test(stripFaqAnswerMarkup(item.answer)),
      `${item.question}: dash after strip`,
    );
  }
  assert.ok(!DASHES.test(FREE_POSTGRES_TITLE));
  assert.ok(!DASHES.test(FREE_POSTGRES_DESCRIPTION));
  assert.ok(!DASHES.test(FREE_POSTGRES_H1));
  assert.ok(!DASHES.test(FREE_POSTGRES_SUBHEADLINE));
  assert.ok(!DASHES.test(FREE_POSTGRES_MARKDOWN_SUBHEADLINE));
  assert.ok(!DASHES.test(FREE_POSTGRES_HERO_PRIMARY_CTA.label));
  assert.ok(!DASHES.test(FREE_POSTGRES_HERO_SECONDARY_CTA.label));
  assert.ok(!DASHES.test(FREE_POSTGRES_TERMINAL_STATUS));
  assert.ok(!DASHES.test(FREE_POSTGRES_TERMINAL_CLAIM));
  assert.ok(!DASHES.test(FREE_POSTGRES_CLI_CONNECTION));
  assert.ok(!DASHES.test(FREE_POSTGRES_CLI_CLAIM_URL));
  for (const line of Object.values(FREE_POSTGRES_CLAUDE)) assert.ok(!DASHES.test(line));
  for (const line of Object.values(FREE_POSTGRES_CODEX)) assert.ok(!DASHES.test(line));
  for (const line of Object.values(FREE_POSTGRES_CURSOR)) assert.ok(!DASHES.test(line));
  for (const line of Object.values(FREE_POSTGRES_COPILOT)) assert.ok(!DASHES.test(line));
  for (const line of Object.values(FREE_POSTGRES_LIMIT)) assert.ok(!DASHES.test(line));
  for (const item of FREE_POSTGRES_CASES) {
    const text = `${item.name} ${item.body} ${item.count} ${item.plan} ${item.linkLabel}`;
    assert.ok(!DASHES.test(text));
    assert.ok(!/\bapp\b/i.test(text));
    assert.ok(item.count.startsWith("about "), `${item.name} is marked approximate`);
    assert.ok(item.plan === "Stays on Free" || item.plan.startsWith("Needs "));
  }
  assert.ok(!/\bapp\b/i.test(Object.values(FREE_POSTGRES_LIMIT).join(" ")));
});

test("the hero window is a plain terminal plus light agent sessions", () => {
  assert.equal(CREATE_DB_COMMAND, "npx create-db");
  assert.equal(CREATE_DB_COMMAND.length, 13);
  assert.deepEqual(
    [...FREE_POSTGRES_TERMINAL_TABS],
    ["Terminal", "Claude", "Codex", "Cursor", "Copilot"],
  );
  assert.equal(FREE_POSTGRES_TERMINAL_TABS[0], "Terminal");
  assert.equal(FREE_POSTGRES_TERMINAL_STATUS, "Setting up a database");
  assert.equal(
    FREE_POSTGRES_TERMINAL_CLAIM,
    "The database is deleted after 24 hours unless you claim it.",
  );
  assert.equal(
    FREE_POSTGRES_CLI_CONNECTION,
    "postgres://demo:sample@db.prisma.io:5432/postgres?sslmode=require",
  );
  assert.equal(
    FREE_POSTGRES_CLI_CLAIM_URL,
    "https://create-db.prisma.io/claim?projectID=proj_sample",
  );
  assert.equal(FREE_POSTGRES_CLAUDE.product, "Claude Code");
  assert.equal(FREE_POSTGRES_CLAUDE.model, "Opus");
  assert.equal(FREE_POSTGRES_CLAUDE.directory, "~/app");
  assert.equal(FREE_POSTGRES_CLAUDE.tool, "Ran a shell command");
  assert.equal(FREE_POSTGRES_CLAUDE.claim, FREE_POSTGRES_TERMINAL_CLAIM);
  assert.equal(FREE_POSTGRES_CLAUDE.region, "eu-central-1 (Frankfurt)");
  assert.equal(FREE_POSTGRES_CODEX.product, "OpenAI Codex");
  assert.equal(FREE_POSTGRES_CODEX.model, "CLI");
  assert.equal(FREE_POSTGRES_CODEX.tool, "Ran a shell command");
  assert.equal(FREE_POSTGRES_CURSOR.product, "Cursor");
  assert.equal(FREE_POSTGRES_CURSOR.mode, "Agent");
  assert.equal(FREE_POSTGRES_CURSOR.tool, "Terminal");
  assert.equal(FREE_POSTGRES_COPILOT.product, "GitHub Copilot");
  assert.equal(FREE_POSTGRES_COPILOT.mode, "Chat");
  assert.equal(FREE_POSTGRES_COPILOT.tool, "Ran a terminal command");

  const css = readFileSync(new URL("./_terminal.module.css", import.meta.url), "utf8");
  const source = readFileSync(new URL("./_terminal.tsx", import.meta.url), "utf8");
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(css, /steps\(13, end\)/);
  assert.ok(!css.includes("#262624"));
  assert.match(source, /role="tablist"/);
  assert.match(source, /\$ /);
  assert.match(source, /❯/);
  assert.match(source, /ClaudeMascot/);
  assert.match(source, /viewBox="0 0 12 8"/);
  assert.match(source, /#111111/);
  assert.ok(!source.includes("m11.744"));
  assert.ok(!source.includes("#F6C9AA"));
  assert.ok(!source.includes("<circle"));
  assert.ok(!source.includes("<table"));
  assert.match(source, /CodexSession/);
  assert.match(source, /CursorSession/);
  assert.match(source, /CopilotSession/);
  assert.match(source, /OpenAILogo/);
  assert.ok(!source.includes("┌"));
  assert.ok(!source.includes("◇"));
  assert.ok(!source.includes("◆"));
  assert.ok(!DASHES.test(css));
  assert.ok(!DASHES.test(source));

  const markdown = renderFreePostgresqlDatabaseMarkdown();
  assert.ok(
    markdown.includes(
      [
        `$ ${CREATE_DB_COMMAND}`,
        "Creating",
        FREE_POSTGRES_TERMINAL_STATUS,
        "Connection string",
        FREE_POSTGRES_CLI_CONNECTION,
        "Example. Not a live database.",
        "Claim",
        FREE_POSTGRES_TERMINAL_CLAIM,
        FREE_POSTGRES_CLI_CLAIM_URL,
      ].join("\n"),
    ),
    "terminal transcript names creating, the connection string, and the claim",
  );
  for (const line of [
    ...FREE_POSTGRES_TERMINAL_TABS,
    `$ ${CREATE_DB_COMMAND}`,
    FREE_POSTGRES_TERMINAL_STATUS,
    FREE_POSTGRES_CLI_CONNECTION,
    FREE_POSTGRES_TERMINAL_CLAIM,
    FREE_POSTGRES_CLAUDE.product,
    FREE_POSTGRES_CLAUDE.model,
    FREE_POSTGRES_CLAUDE.directory,
    `❯ ${CREATE_DB_COMMAND}`,
    FREE_POSTGRES_CLAUDE.tool,
    FREE_POSTGRES_CLAUDE.created,
    FREE_POSTGRES_CLAUDE.connectionLabel,
    `Region: ${FREE_POSTGRES_CLAUDE.region}`,
    FREE_POSTGRES_CLI_CLAIM_URL,
    FREE_POSTGRES_CODEX.product,
    FREE_POSTGRES_CODEX.model,
    `› ${CREATE_DB_COMMAND}`,
    FREE_POSTGRES_CURSOR.product,
    FREE_POSTGRES_CURSOR.mode,
    FREE_POSTGRES_CURSOR.tool,
    FREE_POSTGRES_COPILOT.product,
    FREE_POSTGRES_COPILOT.mode,
    FREE_POSTGRES_COPILOT.tool,
  ]) {
    assert.ok(markdown.includes(line), `markdown missing: ${line}`);
  }
  assert.ok(!markdown.includes("┌"));
  assert.ok(!markdown.includes("Database created successfully!"));
  assert.ok(!markdown.includes("Runs the command, gets the URL, and can use it."));
  assert.ok(!markdown.includes("postgres://USER:PASSWORD@HOST"));

  for (const gone of [
    "Prisma Postgres at a glance",
    "A Postgres database and its connection string, with pooling built in.",
    "Browse and edit rows in the browser with Prisma Studio.",
    "See which queries are slow with Query Insights.",
    "Create a database. Run npx create-db, or create one in the Console.",
    "Paste it into your app. Set it as DATABASE_URL.",
    "Claim it within 24 hours. Open the claim link and sign in. The database moves into your Free workspace",
  ]) {
    assert.ok(!markdown.includes(gone), `old hero copy still in markdown: ${gone}`);
  }
  assert.ok(!markdown.includes("[Prisma Postgres works with any Postgres client.](/postgres)"));
  assert.ok(!markdown.includes("A connection string in seconds."));
  assert.ok(!markdown.includes("No credit card and no time limit."));
  const instantLink = markdown.indexOf(`[Create an instant database](${CREATE_DB_WEB_URL})`);
  const accountLink = markdown.indexOf(`[Get started](${CONSOLE_SIGN_UP_URL})`);
  const firstCheck = markdown.indexOf(FREE_POSTGRES_HERO_CHECKS[0]);
  const secondCheck = markdown.indexOf(FREE_POSTGRES_HERO_CHECKS[1]);
  assert.ok(
    instantLink >= 0 && accountLink > instantLink,
    "instant database is the first hero button",
  );
  assert.ok(accountLink > instantLink && firstCheck > accountLink && secondCheck > firstCheck);
  const includedCards = markdown.indexOf(
    "**2 GB.** of [storage](/docs/full-stack-tutorial#prisma-postgres)",
  );
  const includedTable = markdown.indexOf("| Connections |");
  const resetNote = markdown.indexOf("1. Operations reset on the 1st of every month.");
  const backupRow = markdown.indexOf(
    "| Backups | No backups. Daily backups start on Starter and are kept for 7 days. |",
  );
  assert.ok(
    includedCards > secondCheck &&
      includedTable > includedCards &&
      backupRow > includedTable &&
      resetNote > backupRow,
  );
  assert.ok(!markdown.includes("2. No backups."));
  assert.ok(!markdown.includes("### What you get"));
  assert.ok(!markdown.includes("**No backups.**"));
  assert.ok(markdown.includes("[operations](/docs/postgres/faq#what-is-an-operation)"));
  assert.ok(!markdown.includes("[storage](/pricing)"));
  assert.ok(!markdown.includes("[operations](/pricing)"));
  assert.ok(markdown.includes("[databases](/pricing)"));
  assert.ok(markdown.includes(`[npx create-db](${DOCS_CREATE_DB})`));
  assert.ok(markdown.includes(`[connection string](${DOCS_CONNECT})`));
  assert.ok(markdown.includes(`[one of six](${DOCS_REGIONS})`));
  assert.ok(!markdown.includes("Last updated: 21 October 2026"));
  assert.ok(!markdown.includes("workspace you can keep"));
  assert.ok(
    markdown.includes(
      "**What developers build on it:** Side projects, agent experiments, and small apps. Prototypes, tests, and coding agents too.",
    ),
  );
  assert.ok(
    markdown.includes(
      "**When to upgrade:** Backups, a spend limit, or compliance. Paid plans take a daily snapshot on days the database is used. [HIPAA](/postgres/hipaa), SOC 2, and ISO 27001 are on Business. The plan grid is on [pricing](/pricing).",
    ),
  );
  const limitHeading = markdown.indexOf(`## ${FREE_POSTGRES_PROBLEM_HEADLINE}`);
  const blogCase = markdown.indexOf("### A personal blog");
  const useHeading = markdown.indexOf("## Build on it, then upgrade");
  const buildCard = markdown.indexOf("**What developers build on it:**");
  assert.ok(
    resetNote < limitHeading &&
      limitHeading < blogCase &&
      blogCase < useHeading &&
      useHeading < buildCard,
    "the three cards follow the limit, before the two feature cards",
  );
  assert.ok(!markdown.includes("Roughly, in a day"));
  assert.ok(!markdown.includes("The catch is stated here"));
  assert.ok(!markdown.includes("Queries stop at 200,000"));
  assert.equal(markdown.split("Queries stop").length - 1, 3);
  assert.ok(markdown.includes("**200,000**<sup>1</sup>."));
  assert.ok(markdown.includes("### What counts"));
  assert.ok(markdown.includes("One query is one operation: a simple read, a write, or a join."));
  assert.ok(markdown.includes("200,000 operations a month"));
  assert.ok(markdown.includes("about 6,600 queries a day"));
  assert.ok(markdown.includes("Idle time is not billed."));
  assert.ok(!markdown.includes("divided by 30"));
  assert.ok(markdown.includes("### Idle databases scale to zero"));
  assert.ok(markdown.includes("The next query wakes them. You do not wake one by hand."));
  assert.ok(markdown.includes("### Queries stop at the monthly limit"));
  assert.ok(markdown.includes("Until the 1st of the next month, or until you upgrade."));
  assert.ok(markdown.includes("### A 24 hour restore, once"));
  assert.ok(markdown.includes("Once per workspace, in the Console. It lets you export first."));
  assert.ok(markdown.includes("Queries stop when the spend limit is reached."));
  assert.ok(!markdown.includes("never stop"));
  assert.ok(markdown.includes("### A personal blog"));
  assert.ok(markdown.includes("A visit loads the list of posts, then the post."));
  assert.ok(markdown.includes("about 40 queries a day. Stays on Free."));
  assert.ok(markdown.includes("### A feedback board"));
  assert.ok(markdown.includes("about 400 queries a day. Stays on Free."));
  assert.ok(markdown.includes("### A team chat"));
  assert.ok(markdown.includes("[Needs Starter at $10 a month](/pricing)"));
  assert.ok(markdown.includes("[See pricing](/pricing)"));
  assert.ok(markdown.includes("about 20,000 queries a day."));
  assert.ok(markdown.includes("1 GB for 15 days"));
  assert.ok(markdown.includes("4 hours of one CPU while the app is working"));
  assert.ok(!markdown.includes("Built to work with the rest of Prisma"));
  assert.ok(!markdown.includes("Best together. Swappable when needed."));
  assert.ok(markdown.includes("## FAQ"));
  assert.ok(markdown.includes("Trusted by 500K+ TypeScript developers"));
  assert.ok(markdown.includes("## Create your free database"));
  assert.ok(!markdown.includes("Host your app for free, too"));
  assert.ok(markdown.includes("Free tiers differ in storage, databases, and the limit."));
  assert.ok(!markdown.includes("Comparing free Postgres options?"));
  assert.ok(!markdown.includes("App hosting platforms with managed Postgres"));
  assert.ok(markdown.includes("[Prisma Postgres vs Neon](/compare/neon):"));
  assert.ok(markdown.includes("[Prisma Postgres vs Supabase](/compare/supabase):"));
  assert.ok(
    markdown.includes(
      "[Serverless Postgres compared (2026): Neon, Supabase, Amazon RDS/Aurora and Prisma Postgres](/blog/serverless-postgres):",
    ),
  );
  assert.ok(!markdown.includes("hair salon"));
  assert.ok(!markdown.includes("Restaurant orders"));
  assert.ok(!markdown.includes("visits times a few queries"));
  assert.ok(!markdown.includes("For evaluation only"));
  assert.ok(!markdown.includes("Whether upgrading a workspace keeps the same connection string"));
  assert.ok(!markdown.includes("embedding demo"));
  assert.ok(!markdown.includes("Starter, $10 a month"));
  assert.ok(!markdown.includes("TO CONFIRM WITH ENGINEERING"));
  assert.ok(!markdown.includes("What happens when a database reaches 2 GB"));

  const sections = readFileSync(new URL("./_sections.tsx", import.meta.url), "utf8");
  assert.match(sections, /one\s+query each/);
  assert.match(sections, /checks=\{FREE_POSTGRES_HERO_CHECKS\}/);
  assert.ok(!sections.includes("Instant databases are deleted in 24 hours unless claimed."));
  assert.ok(
    !sections.includes(
      "A claimed database, and a database created in the Prisma Console, has no time limit.",
    ),
  );
  assert.ok(!sections.includes("No card, no time limit on the Free workspace"));
  assert.ok(!sections.includes("Create an instant database is deleted after 24 hours unless you"));
  assert.ok(!sections.includes("No credit card and no time limit."));
  assert.ok(!sections.includes("FREE_POSTGRES_MICROLINE"));
  assert.ok(!sections.includes("microline:"));
  assert.match(sections, /FreePostgresSubtitle/);
  assert.match(sections, /CardTitle/);
  assert.match(sections, /TableHeader/);
  assert.ok(!sections.includes("Alert"));
  assert.ok(!sections.includes("ProductPlatform"));
  assert.ok(sections.includes("TestimonialsReveal"));
  assert.ok(sections.includes("<Faq"));
  assert.ok(sections.includes("ProductCta"));
  assert.ok(!sections.includes("lead={<FreePostgresIncluded />}"));
  assert.match(sections, /<strong className="font-semibold text-foreground">2 GB<\/strong>/);
  assert.ok(!sections.includes("FREE_POSTGRES_RELATED"));
  assert.ok(!sections.includes("related:"));
});
