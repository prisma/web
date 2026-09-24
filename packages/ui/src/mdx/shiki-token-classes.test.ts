import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import { hastToHtml } from "shiki/core";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { rehypeCodeOptions } from "./rehype-code-options.ts";
import {
  parseShikiTokenStyle,
  shikiTokenClassGroups,
  transformerShikiTokenClasses,
  // @ts-expect-error Node's TypeScript test runner requires the explicit extension.
} from "./shiki-token-classes.ts";
import {
  generateShikiTokenCss,
  shikiTokenCssRules,
  SHIKI_TOKEN_CSS_PATH,
  // @ts-expect-error Node's TypeScript test runner requires the explicit extension.
} from "../../scripts/generate-shiki-token-css.ts";

/** A `<pre><code class="language-…">` tree, exactly what `PreParser` expects. */
function codeBlockTree(lang: string, code: string, meta = "") {
  return {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "pre",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "code",
            properties: { className: [`language-${lang}`], metastring: meta },
            children: [{ type: "text", value: code }],
          },
        ],
      },
    ],
  };
}

/**
 * `rehypeCode` is typed as a unified plugin, so calling it outside a processor
 * needs the `this` context dropped. The transformer it returns is a plain
 * function of the tree.
 */
const createTransform = rehypeCode as unknown as (
  options: unknown,
) => (tree: unknown, file: unknown) => Promise<void>;
const transform = createTransform(rehypeCodeOptions);

async function highlight(lang: string, code: string, meta = "") {
  const tree = codeBlockTree(lang, code, meta);
  await transform(tree, {});
  return hastToHtml(tree as never);
}

/**
 * A corpus wide enough to exercise most of the two themes' palettes plus every
 * notation the docs content uses.
 */
const SNIPPETS: [lang: string, code: string, meta?: string][] = [
  ["ts", `const answer: number = 42; // a comment\nexport function go() { return "x" }`],
  ["tsx", `export const App = () => (\n  <div className="x" data-y={1}>{/* hi */}text</div>\n);`],
  [
    "prisma",
    `model User {\n  id    Int    @id @default(autoincrement())\n  email String @unique\n}`,
  ],
  ["bash", `npx prisma migrate dev --name init # run it\necho "done" | tee log.txt`],
  ["json", `{ "a": 1, "b": [true, null, "c"] }`],
  ["sql", `SELECT id, email FROM "User" WHERE id = 1 ORDER BY email DESC;`],
  ["yaml", `services:\n  db:\n    image: postgres:17\n    ports: ["5432:5432"]`],
  ["md", `# Heading\n\n*italic* **bold** ~~strike~~ [link](https://prisma.io)\n\n\`code\``],
  ["diff", `- const a = 1\n+ const a = 2`],
  ["ts", `const a = 1 // [!code highlight]\nconst b = 2`],
  ["ts", `const a = 1 // [!code focus]\nconst b = 2`],
  ["ts", `const kept = 1 // [!code ++]\nconst gone = 2 // [!code --]`],
  ["ts", `const needle = haystack // [!code word:haystack]`],
  ["ts", `const a = 1\nconst b = 2`, 'title="example.ts" lineNumbers'],
];

async function highlightCorpus() {
  const out: string[] = [];
  for (const [lang, code, meta] of SNIPPETS) out.push(await highlight(lang, code, meta));
  return out;
}

const TOKEN_CLASS_RE = /\bsk[cs][0-9a-z]{4}\b/g;

test("emits no per-token inline Shiki style, and token classes instead", async () => {
  for (const html of await highlightCorpus()) {
    const tokenStyles = html.match(/<span [^>]*style="--shiki/g) ?? [];
    assert.deepEqual(tokenStyles, [], `inline token style survived in: ${html.slice(0, 240)}`);

    const classes = html.match(TOKEN_CLASS_RE) ?? [];
    assert.ok(classes.length > 0, `no token classes in: ${html.slice(0, 240)}`);
  }
});

test("keeps the code block's own background variables for keepBackground", async () => {
  const html = await highlight("ts", "const a = 1");

  // packages/eclipse codeblock.tsx reads these with bg-(--shiki-light-bg).
  assert.match(html, /<pre [^>]*style="[^"]*--shiki-light-bg:/);
  assert.match(html, /<pre [^>]*style="[^"]*--shiki-dark-bg:/);
  assert.match(html, /<pre class="shiki shiki-themes github-light github-dark"/);
});

test("leaves the notation transformers' output intact", async () => {
  const highlighted = await highlight("ts", `const a = 1 // [!code highlight]\nconst b = 2`);
  assert.match(highlighted, /class="line highlighted"/);
  assert.match(highlighted, /has-highlighted/);

  const focused = await highlight("ts", `const a = 1 // [!code focus]\nconst b = 2`);
  assert.match(focused, /class="line focused"/);
  assert.match(focused, /has-focused/);

  const diffed = await highlight("ts", `const a = 1 // [!code ++]\nconst b = 2 // [!code --]`);
  assert.match(diffed, /class="line diff add"/);
  assert.match(diffed, /class="line diff remove"/);
  assert.match(diffed, /has-diff/);

  const word = await highlight("ts", `const needle = haystack // [!code word:haystack]`);
  // The word transformer splits a token and adds a class; the split halves keep
  // their colour, so the class list has both.
  assert.match(word, /class="[^"]*highlighted-word[^"]*"/);
  assert.match(word, /class="highlighted-word skc[0-9a-z]{4}"/);
});

test("every class the pipeline emits has a rule in the generated stylesheet", async () => {
  const css = await readFile(SHIKI_TOKEN_CSS_PATH, "utf8");
  const emitted = new Set<string>();

  for (const html of await highlightCorpus()) {
    for (const className of html.match(TOKEN_CLASS_RE) ?? []) emitted.add(className);
  }

  assert.ok(emitted.size > 10, `expected a broad sample, got ${emitted.size}`);
  for (const className of emitted) {
    assert.ok(
      css.includes(`.${className}{`),
      `${className} has no rule in shiki-tokens.css — run pnpm --filter @prisma-docs/ui generate:shiki-tokens`,
    );
  }
});

test("the committed stylesheet is what the generator produces", async () => {
  const [committed, generated] = await Promise.all([
    readFile(SHIKI_TOKEN_CSS_PATH, "utf8"),
    generateShikiTokenCss(),
  ]);

  assert.equal(
    committed,
    generated,
    "shiki-tokens.css is stale — run pnpm --filter @prisma-docs/ui generate:shiki-tokens",
  );
});

test("the stylesheet only declares Shiki custom properties", async () => {
  const rules = shikiTokenCssRules(await readFile(SHIKI_TOKEN_CSS_PATH, "utf8"));

  assert.ok(rules.length > 100, `expected the full palette, got ${rules.length} rules`);
  for (const rule of rules) {
    // Declarations are matched one at a time with a mandatory `;` between
    // them. Making the separator optional would let `[^;}]+` also swallow the
    // next `--shiki-…:` prefix, which CodeQL (js/redos) flags as exponential
    // backtracking on inputs with many repeated declarations.
    assert.match(
      rule,
      /^\.sk[cs][0-9a-z]{4}\{--shiki-[a-z-]+:[^;}]+(?:;--shiki-[a-z-]+:[^;}]+)*;?\}$/,
      rule,
    );
  }
});

test("covers every colour pair and font-style pair the themes can resolve", async () => {
  const css = await readFile(SHIKI_TOKEN_CSS_PATH, "utf8");

  // The Markdown case that a naive (colour + font style together) enumeration
  // misses: theme foreground from one scope, strikethrough from another.
  for (const declaration of [
    "--shiki-light:#24292E;--shiki-dark:#E1E4E8",
    "--shiki-light-text-decoration:line-through;--shiki-dark-text-decoration:line-through",
    "--shiki-light-text-decoration:underline;--shiki-dark-text-decoration:inherit",
    "--shiki-light-font-style:italic;--shiki-dark-font-style:italic",
    "--shiki-light-font-weight:bold;--shiki-dark-font-weight:bold",
  ]) {
    for (const group of shikiTokenClassGroups(parseShikiTokenStyle(declaration)!)) {
      assert.ok(css.includes(`${group.rule}`), `missing rule: ${group.rule}`);
    }
  }
});

test("parses a Shiki token style and rejects anything else", () => {
  assert.deepEqual(
    [...parseShikiTokenStyle("--shiki-light:#D73A49;--shiki-dark:#F97583")!],
    [
      ["--shiki-light", "#d73a49"],
      ["--shiki-dark", "#f97583"],
    ],
  );

  assert.equal(parseShikiTokenStyle("color:red"), null, "a real property is not ours");
  assert.equal(
    parseShikiTokenStyle("--shiki-light:#fff;color:red"),
    null,
    "a mixed declaration is not ours",
  );
  assert.equal(
    parseShikiTokenStyle("--shiki-light:#fff;--shiki-light-bg:#000"),
    null,
    "a token background is left inline",
  );
  assert.equal(parseShikiTokenStyle(""), null);
  assert.equal(parseShikiTokenStyle("--shiki-light"), null, "a valueless property is not ours");
});

test("splits a declaration into a colour class and a font-style class", () => {
  const colorOnly = shikiTokenClassGroups(
    parseShikiTokenStyle("--shiki-light:#D73A49;--shiki-dark:#F97583")!,
  );
  assert.equal(colorOnly.length, 1, "a colour-only token costs one class");
  assert.match(colorOnly[0].className, /^skc[0-9a-z]{4}$/);
  assert.equal(
    colorOnly[0].rule,
    `.${colorOnly[0].className}{--shiki-dark:#f97583;--shiki-light:#d73a49}`,
  );

  const styled = shikiTokenClassGroups(
    parseShikiTokenStyle(
      "--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic",
    )!,
  );
  assert.deepEqual(
    styled.map((group) => group.className.slice(0, 3)),
    ["skc", "sks"],
  );
});

test("class names ignore declaration order and hex case", () => {
  const a = shikiTokenClassGroups(
    parseShikiTokenStyle("--shiki-light:#D73A49;--shiki-dark:#F97583")!,
  );
  const b = shikiTokenClassGroups(
    parseShikiTokenStyle("--shiki-dark:#f97583;--shiki-light:#d73a49")!,
  );

  assert.deepEqual(a, b);
});

test("falls back to the inline style when the class has no rule", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "span",
        properties: { style: "--shiki-light:#123456;--shiki-dark:#654321" },
        children: [{ type: "text", value: "x" }],
      },
    ],
  };

  // An empty allowlist stands in for a stylesheet that does not cover the pair.
  transformerShikiTokenClasses({ knownClasses: new Set() }).root!.call({} as never, tree as never);

  assert.equal(
    (tree.children[0] as { properties: Record<string, unknown> }).properties.style,
    "--shiki-light:#123456;--shiki-dark:#654321",
  );
});

test("appends to an existing class list rather than replacing it", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "span",
        properties: { class: "highlighted-word", style: "--shiki-light:#123456" },
        children: [{ type: "text", value: "x" }],
      },
    ],
  };

  transformerShikiTokenClasses().root!.call({} as never, tree as never);

  const properties = (tree.children[0] as { properties: Record<string, unknown> }).properties;
  assert.equal(properties.style, undefined);
  assert.match(String(properties.class), /^highlighted-word skc[0-9a-z]{4}$/);
});
