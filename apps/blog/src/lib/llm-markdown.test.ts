import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizePostMarkdown,
  resolvePostImage,
  resolvePostLink,
  type PostMarkdownContext,
} from "./llm-markdown";

const context: PostMarkdownContext = {
  baseUrl: "https://www.prisma.io",
  postSlugs: new Set([
    "app-hosting-platforms-with-managed-postgres-2026",
    "prisma-vs-netlify",
    "nestjs-prisma-authentication-7D056s1s0k3l",
  ]),
};

function normalize(markdown: string) {
  return normalizePostMarkdown(markdown, context);
}

test("a link to another post gets the /blog base path and keeps its anchor", () => {
  assert.equal(
    normalize("See [the comparison](/app-hosting-platforms-with-managed-postgres-2026#pricing)."),
    "See [the comparison](https://www.prisma.io/blog/app-hosting-platforms-with-managed-postgres-2026#pricing).",
  );
});

test("links to the blog's own pages get the /blog base path", () => {
  assert.equal(resolvePostLink("/", context), "https://www.prisma.io/blog");
  assert.equal(
    resolvePostLink("/series/prisma-compute", context),
    "https://www.prisma.io/blog/series/prisma-compute",
  );
  assert.equal(resolvePostLink("/tag/orm", context), "https://www.prisma.io/blog/tag/orm");
  assert.equal(
    resolvePostLink("/blog/prisma-vs-netlify", context),
    "https://www.prisma.io/blog/prisma-vs-netlify",
  );
  assert.equal(
    resolvePostLink("/prisma-vs-netlify.md", context),
    "https://www.prisma.io/blog/prisma-vs-netlify.md",
  );
});

test("links to the rest of the site keep their path and get only the origin", () => {
  assert.equal(
    resolvePostLink("/docs/postgres/database/connection-pooling", context),
    "https://www.prisma.io/docs/postgres/database/connection-pooling",
  );
  assert.equal(
    resolvePostLink("/pricing?plan=starter", context),
    "https://www.prisma.io/pricing?plan=starter",
  );
});

test("absolute, protocol-relative, relative and anchor-only links are left alone", () => {
  for (const href of [
    "https://neon.com/pricing",
    "//cdn.example.com/x.js",
    "./sibling",
    "#faq",
    "mailto:hello@prisma.io",
  ]) {
    assert.equal(resolvePostLink(href, context), href);
  }
});

test("a mis-cased link to a post is written with the post's own slug", () => {
  assert.equal(
    resolvePostLink("/nestjs-prisma-authentication-7d056s1s0k3l", context),
    "https://www.prisma.io/blog/nestjs-prisma-authentication-7D056s1s0k3l",
  );
});

test("an entity after the path stays after it", () => {
  assert.equal(
    resolvePostLink("/prisma-vs-netlify&#x29;", context),
    "https://www.prisma.io/blog/prisma-vs-netlify&#x29;",
  );
});

test("images are served from under /blog, as on the post page", () => {
  assert.equal(
    normalize("![Diagram](/prisma-vs-netlify/imgs/branch-databases.svg)"),
    "![Diagram](https://www.prisma.io/blog/prisma-vs-netlify/imgs/branch-databases.svg)",
  );
  assert.equal(
    resolvePostImage("/blog/posts/meetup.png", context),
    "https://www.prisma.io/blog/posts/meetup.png",
  );
  assert.equal(
    resolvePostImage("https://cdn.sanity.io/a.png", context),
    "https://cdn.sanity.io/a.png",
  );
});

test("a link wrapped around an image resolves both", () => {
  assert.equal(
    normalize("[![Logo](/prisma-vs-netlify/imgs/logo.svg)](/docs/compute)"),
    "[![Logo](https://www.prisma.io/blog/prisma-vs-netlify/imgs/logo.svg)](https://www.prisma.io/docs/compute)",
  );
});

test("link titles and reference definitions are resolved too", () => {
  assert.equal(
    normalize('[post](/prisma-vs-netlify "Netlify")\n\n[ref]: /docs/orm'),
    '[post](https://www.prisma.io/blog/prisma-vs-netlify "Netlify")\n\n[ref]: https://www.prisma.io/docs/orm',
  );
});

test("code is never rewritten", () => {
  const markdown = [
    "Use `[label](/prisma-vs-netlify)` in Markdown.",
    "",
    "```mdx",
    "[label](/prisma-vs-netlify)",
    '<Accordion title="Q">A</Accordion>',
    "{/* comment */}",
    "```",
  ].join("\n");

  assert.equal(normalize(markdown), markdown);
});

test("a callout becomes a blockquote with its title in bold", () => {
  const markdown = [
    '<CalloutContainer type="info">',
    "  <CalloutTitle>",
    "    How we compared",
    "  </CalloutTitle>",
    "",
    "  <CalloutDescription>",
    "    We checked every vendor page. See the [pricing](/docs/pricing).",
    "  </CalloutDescription>",
    "</CalloutContainer>",
  ].join("\n");

  assert.equal(
    normalize(markdown),
    [
      "> [!NOTE]",
      "> **How we compared**",
      ">",
      "> We checked every vendor page. See the [pricing](https://www.prisma.io/docs/pricing).",
    ].join("\n"),
  );
});

test("FAQ accordions become headings with unindented answers", () => {
  const markdown = [
    "## FAQ",
    "",
    '<Accordions type="single">',
    '  <Accordion title="Is Prisma a replacement for Netlify?">',
    "    Prisma replaces part of what Netlify does.",
    "    Read [the comparison](/app-hosting-platforms-with-managed-postgres-2026).",
    "  </Accordion>",
    "",
    '  <Accordion title="How do I deploy?">',
    "    Run this:",
    "",
    "    ```bash",
    "    npx prisma deploy",
    "      --stage preview",
    "    ```",
    "  </Accordion>",
    "</Accordions>",
  ].join("\n");

  assert.equal(
    normalize(markdown),
    [
      "## FAQ",
      "",
      "### Is Prisma a replacement for Netlify?",
      "",
      "Prisma replaces part of what Netlify does.",
      "Read [the comparison](https://www.prisma.io/blog/app-hosting-platforms-with-managed-postgres-2026).",
      "",
      "### How do I deploy?",
      "",
      "Run this:",
      "",
      "```bash",
      "npx prisma deploy",
      "  --stage preview",
      "```",
    ].join("\n"),
  );
});

test("code block tabs become one labelled block per file", () => {
  const markdown = [
    '<CodeBlockTabs defaultValue="service.ts">',
    "  <CodeBlockTabsList>",
    '    <CodeBlockTabsTrigger value="service.ts">',
    "      service.ts",
    "    </CodeBlockTabsTrigger>",
    "  </CodeBlockTabsList>",
    "",
    '  <CodeBlockTab value="service.ts">',
    "    ```ts",
    "    export default compute({",
    '      name: "storefront",',
    "    });",
    "    ```",
    "  </CodeBlockTab>",
    "</CodeBlockTabs>",
  ].join("\n");

  assert.equal(
    normalize(markdown),
    [
      "#### service.ts",
      "",
      "```ts",
      "export default compute({",
      '  name: "storefront",',
      "});",
      "```",
    ].join("\n"),
  );
});

test("embeds become links and quotes keep their speaker", () => {
  const markdown = [
    '<Youtube videoId="0moGjrpNDm8" />',
    "",
    "<TweetEmbedComp tweets=\"['2019435347374150085']\" />",
    "",
    '<Quotes speakerName="Will Madden" position="Engineering Manager" companyName="Prisma">',
    "  Prisma 8 is designed to make advanced database capabilities feel native.",
    "</Quotes>",
    "",
    '<Image src="/blog/accelerate-ga/imgs/logo-cal.svg" alt="The logo of Cal.com" className="mx-auto" />',
  ].join("\n");

  assert.equal(
    normalize(markdown),
    [
      "[Watch the video on YouTube](https://www.youtube.com/watch?v=0moGjrpNDm8)",
      "",
      "[Post on X](https://x.com/i/status/2019435347374150085)",
      "",
      "> Prisma 8 is designed to make advanced database capabilities feel native.",
      ">",
      "> Will Madden, Engineering Manager at Prisma",
      "",
      "![The logo of Cal.com](https://www.prisma.io/blog/accelerate-ga/imgs/logo-cal.svg)",
    ].join("\n"),
  );
});

test("an agent prompt keeps the prompt and the command", () => {
  const markdown =
    '<AgentPrompt prompt="Deploy this branch with its own database." skill="prisma-cli" terminalCommand="npx @prisma/cli@latest app deploy --db" terminalLines="lines" />';

  assert.equal(
    normalize(markdown),
    [
      "> Prompt for your coding agent (skill: prisma-cli): Deploy this branch with its own database.",
      "",
      "```bash",
      "npx @prisma/cli@latest app deploy --db",
      "```",
    ].join("\n"),
  );
});

test("attribute values are decoded, so a Mermaid chart is valid Mermaid", () => {
  const markdown = [
    "<Mermaid",
    '  chart="flowchart LR',
    "    S[&#x22;Sentry issue&#x22;] --> B[&#x22;Gather context&#x22;]",
    '    B --> C[&#x22;Makers & agents&#x22;]"',
    "/>",
    "",
    '<Accordion title="What does &#x22;one plan&#x22; mean?">',
    "  The answer.",
    "</Accordion>",
  ].join("\n");

  assert.equal(
    normalize(markdown),
    [
      "```mermaid",
      "flowchart LR",
      '    S["Sentry issue"] --> B["Gather context"]',
      '    B --> C["Makers & agents"]',
      "```",
      "",
      '### What does "one plan" mean?',
      "",
      "The answer.",
    ].join("\n"),
  );
});

test("other components are unwrapped, widgets without text and MDX comments are dropped", () => {
  const markdown = [
    "Before.",
    "",
    '{/* <Video src="/blog/posts/pick-two.mp4" /> */}',
    "",
    "<ServerlessPostgresChooser />",
    "",
    '<Steps variant="vertical">',
    '  <Step variant="vertical">',
    "    ### Create the project",
    "",
    "    Run the command.",
    "  </Step>",
    "</Steps>",
    "",
    'The <Hex color="#7F9CF5" label="Blue" /> bar is the query.',
    "",
    "<SomeFutureWidget>",
    "  Text inside a component nobody formats yet.",
    "</SomeFutureWidget>",
  ].join("\n");

  assert.equal(
    normalize(markdown),
    [
      "Before.",
      "",
      "### Create the project",
      "",
      "Run the command.",
      "",
      "The Blue bar is the query.",
      "",
      "Text inside a component nobody formats yet.",
    ].join("\n"),
  );
});
