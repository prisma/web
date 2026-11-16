import { strict as assert } from "node:assert";
import { normalizeProcessedMarkdown } from "../src/lib/llm-markdown";

const rawComponentPattern =
  /<(?:APIPage|CodeBlockTabs|CodeBlockTab|Tabs|Tab|Cards|Card|Accordions|Accordion|Youtube|Button|SharedContent|Steps|Step|DeployCallout|CommandRows|CommandRow|SetupTabs|SetupPath|SetupPrompt|DocsIndex|IndexLink)\b/;

type SnapshotCase = {
  name: string;
  input: string;
  expected: string;
  /** anchor → toc depth, as getLLMText passes it for real pages */
  headingDepths?: Record<string, number>;
};

const snapshots: SnapshotCase[] = [
  {
    name: "APIPage",
    input: `<APIPage document={"rest-api"} operations={[{"path":"/v1/example","method":"get"}]} />`,
    expected: `## API reference

### GET /v1/example

\`GET /v1/example\``,
  },
  {
    name: "CodeBlockTabs",
    input: `<CodeBlockTabs groupId="package-manager">
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">npm</CodeBlockTabsTrigger>
    <CodeBlockTabsTrigger value="pnpm">pnpm</CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="npm">
    \`\`\`bash
    npm install @prisma/client
    \`\`\`
  </CodeBlockTab>

  <CodeBlockTab value="pnpm">
    \`\`\`bash
    pnpm add @prisma/client
    \`\`\`
  </CodeBlockTab>
</CodeBlockTabs>`,
    expected: `#### npm

\`\`\`bash
npm install @prisma/client
\`\`\`

#### pnpm

\`\`\`bash
pnpm add @prisma/client
\`\`\``,
  },
  {
    name: "manual Tabs",
    input: `<Tabs items={["TypeScript", "JavaScript"]}>
  <Tab value="TypeScript">
    1. Create \`seed.ts\`.

       \`\`\`ts
       console.log("seed");
       \`\`\`
  </Tab>

  <Tab value="JavaScript">
    1. Create \`seed.js\`.
  </Tab>
</Tabs>`,
    expected: `#### TypeScript

1. Create \`seed.ts\`.

   \`\`\`ts
   console.log("seed");
   \`\`\`

#### JavaScript

1. Create \`seed.js\`.`,
  },
  {
    name: "admonition",
    input: `<CalloutContainer type="warning">
  <CalloutTitle>Before you continue</CalloutTitle>

  Keep both paragraphs.

  - Parent item
    - Nested item
</CalloutContainer>`,
    expected: `> [!WARNING]
> Before you continue
> 
> Keep both paragraphs.
> 
> - Parent item
>   - Nested item`,
  },
  {
    name: "Accordion and Youtube",
    input: `<Accordions>
  <Accordion title="Watch video: Multi-file Prisma schema">
    <Youtube videoId="abc123" title="How to split your Prisma schema" />
  </Accordion>
</Accordions>`,
    expected: `### Watch video: Multi-file Prisma schema

[How to split your Prisma schema](https://www.youtube.com/watch?v=abc123)`,
  },
  {
    name: "Cards",
    input: `<Cards>
  <Card href="/postgres/npx-create-db" title="Create a temporary database" icon={<Database className="text-primary" />}>
    Provision a short-lived Prisma Postgres database.
  </Card>

  <Card href="/postgres/database/connecting-to-your-database" title="Connect to your database">
    Choose the right connection string.
  </Card>
</Cards>`,
    expected: `- [Create a temporary database](/postgres/npx-create-db): Provision a short-lived Prisma Postgres database.

- [Connect to your database](/postgres/database/connecting-to-your-database): Choose the right connection string.`,
  },
  {
    name: "Button",
    input: `<Button asChild variant="ppg">
  <a href="https://cursor.com/marketplace/prisma">Install the Prisma plugin for Cursor</a>
</Button>`,
    expected: `[Install the Prisma plugin for Cursor](https://cursor.com/marketplace/prisma)`,
  },
  {
    name: "SharedContent and Steps",
    input: `<SharedContent>
  Shared paragraph.
</SharedContent>

<Steps>
  <Step title="Install">
    Run the command.
  </Step>
</Steps>`,
    expected: `Shared paragraph.

### Install

Run the command.`,
  },
  {
    name: "DeployCallout",
    input: `<DeployCallout title="Deploy with one command" command="npx prisma deploy" href="/prisma-compute/deploy">
  Ships everything your app declares to production. Use \`--environment\` for an isolated copy.
</DeployCallout>`,
    expected: `**Deploy with one command**

\`\`\`bash
npx prisma deploy
\`\`\`

Ships everything your app declares to production. Use \`--environment\` for an isolated copy.

See the [Deploy guide](/prisma-compute/deploy).`,
  },
  {
    name: "CommandRows",
    input: `<CommandRows>
  <CommandRow label="New project" command="npx create-prisma@stable" href="/v7/prisma-orm/quickstart/prisma-postgres" linkLabel="5-min quickstart" />
  <CommandRow label="Existing project" command="npx prisma@prev init" href="/v7/getting-started" linkLabel="Setup paths" />
</CommandRows>`,
    expected: `- **New project:** \`npx create-prisma@stable\` ([5-min quickstart](/v7/prisma-orm/quickstart/prisma-postgres))
- **Existing project:** \`npx prisma@prev init\` ([Setup paths](/v7/getting-started))`,
  },
  {
    name: "SetupTabs",
    input: `<SetupTabs>

<SetupPath label="Postgres only" guideHref="/postgres/npx-create-db" guideTitle="create-db guide">

Create a Prisma Postgres database with \`npx create-db\`.

Using Kysely? Follow the [Kysely quickstart](/prisma-postgres/quickstart/kysely).

<SetupPrompt>

\`\`\`text
Create a Prisma Postgres database for this project.

1. Run \`npx create-db@latest\`.
\`\`\`

</SetupPrompt>

</SetupPath>

</SetupTabs>`,
    expected: `**Postgres only**

Create a Prisma Postgres database with \`npx create-db\`.

Using Kysely? Follow the [Kysely quickstart](/prisma-postgres/quickstart/kysely).

Follow the guide: [create-db guide](/postgres/npx-create-db)

\`\`\`text
Create a Prisma Postgres database for this project.

1. Run \`npx create-db@latest\`.
\`\`\``,
  },
  {
    name: "DocsIndex",
    input: `<DocsIndex>
  <IndexLink href="/orm" title="Prisma ORM" description="Prisma ORM 8 and 7 docs" icon={<Boxes />} />
  <IndexLink href="/cli" title="CLI reference" description="Every command and flag" icon={<Terminal />} />
</DocsIndex>`,
    expected: `- [Prisma ORM](/orm): Prisma ORM 8 and 7 docs
- [CLI reference](/cli): Every command and flag`,
  },
  {
    name: "Bullet markers",
    input: `* [Model your data](/orm/data-modeling): describe your models.
* **Bold** first word.
  * Nested item.

* * *

\`\`\`text
* stays as written in code
\`\`\``,
    expected: `- [Model your data](/orm/data-modeling): describe your models.
- **Bold** first word.
  - Nested item.

* * *

\`\`\`text
* stays as written in code
\`\`\``,
  },
  {
    name: "Steps",
    input: `<Steps>

  ### Get a database [#1-get-a-database]

Create one.

Run the app [#2-run-the-app]

Start it.

</Steps>`,
    headingDepths: { "1-get-a-database": 3, "2-run-the-app": 3 },
    expected: `### 1. Get a database [#1-get-a-database]

Create one.

### 2. Run the app [#2-run-the-app]

Start it.`,
  },
];

function stripFencedCodeBlocks(markdown: string) {
  return markdown.replace(/^([ \t]*)([`~]{3,})[^\n]*\n[\s\S]*?^\1\2\s*$/gm, "");
}

for (const snapshot of snapshots) {
  const actual = normalizeProcessedMarkdown(snapshot.input, {
    headingDepths: snapshot.headingDepths
      ? new Map(Object.entries(snapshot.headingDepths))
      : undefined,
  });
  assert.equal(actual, snapshot.expected, snapshot.name);
  assert.equal(
    rawComponentPattern.test(stripFencedCodeBlocks(actual)),
    false,
    `${snapshot.name} leaves raw MDX component JSX in markdown output`,
  );
}

const codeFenceInput = `\`\`\`tsx
<Card>Keep component examples intact inside code fences.</Card>
\`\`\``;

assert.equal(
  normalizeProcessedMarkdown(codeFenceInput),
  codeFenceInput,
  "code fences are preserved",
);

console.log(`LLM markdown fidelity snapshots passed (${snapshots.length + 1} cases).`);
