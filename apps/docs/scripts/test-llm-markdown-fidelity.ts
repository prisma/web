import { strict as assert } from "node:assert";
import { normalizeProcessedMarkdown } from "../src/lib/llm-markdown";

const rawComponentPattern =
  /<(?:APIPage|CodeBlockTabs|CodeBlockTab|Tabs|Tab|Cards|Card|Accordions|Accordion|Youtube|Button|SharedContent|Steps|Step)\b/;

type SnapshotCase = {
  name: string;
  input: string;
  expected: string;
};

const snapshots: SnapshotCase[] = [
  {
    name: "APIPage",
    input: `<APIPage document={"management-api"} operations={[{"path":"/v1/example","method":"get"}]} />`,
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
];

function stripFencedCodeBlocks(markdown: string) {
  return markdown.replace(/^([ \t]*)([`~]{3,})[^\n]*\n[\s\S]*?^\1\2\s*$/gm, "");
}

for (const snapshot of snapshots) {
  const actual = normalizeProcessedMarkdown(snapshot.input);
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
