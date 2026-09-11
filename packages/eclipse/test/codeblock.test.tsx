import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "../src/components/codeblock";
import { Tab, Tabs } from "../src/components/tabs";
import { escapeTabValue } from "../src/lib/tab-value";

// MDX authors label code fences with prose ("```ts tab=\"Relational databases\"").
// Radix builds `id`, `aria-controls` and `aria-labelledby` out of the tab value,
// so anything but an id-safe token produces IDREFs that reference nothing.
const LABELS = ["Relational databases", "Prompt to seed the database"];

function idrefAttributes(html: string): string[] {
  return [...html.matchAll(/(?:id|aria-controls|aria-labelledby)="([^"]*)"/g)].map((m) => m[1]);
}

function renderCodeBlockTabs() {
  return renderToStaticMarkup(
    <CodeBlockTabs defaultValue={LABELS[0]}>
      <CodeBlockTabsList>
        {LABELS.map((label) => (
          <CodeBlockTabsTrigger key={label} value={label}>
            {label}
          </CodeBlockTabsTrigger>
        ))}
      </CodeBlockTabsList>
      {LABELS.map((label) => (
        <CodeBlockTab key={label} value={label}>
          <pre>{label} example</pre>
        </CodeBlockTab>
      ))}
    </CodeBlockTabs>,
  );
}

test("CodeBlockTabs emits no id or IDREF containing whitespace", () => {
  const html = renderCodeBlockTabs();
  const values = idrefAttributes(html);

  assert.ok(values.length > 0, "expected the tabs to render ids");
  for (const value of values) {
    assert.doesNotMatch(value, /\s/, `attribute value "${value}" contains whitespace`);
  }
});

test("CodeBlockTabs keeps the human label as visible trigger text", () => {
  const html = renderCodeBlockTabs();
  for (const label of LABELS) {
    assert.ok(html.includes(`>${label}</`), `expected "${label}" to stay visible`);
  }
});

test("CodeBlockTabs still activates the tab named by defaultValue", () => {
  const html = renderCodeBlockTabs();
  const activeTriggers = [...html.matchAll(/<button[^>]*data-state="active"[^>]*>/g)];

  assert.equal(activeTriggers.length, 1);
  assert.ok(
    activeTriggers[0][0].includes(`aria-controls="`),
    "the active trigger should point at its panel",
  );
  const controls = /aria-controls="([^"]+)"/.exec(activeTriggers[0][0])?.[1] ?? "";
  assert.ok(html.includes(`id="${controls}"`), "aria-controls must reference a rendered element");
});

test("Tabs in items mode escapes labels the same way", () => {
  const html = renderToStaticMarkup(
    <Tabs items={LABELS}>
      {LABELS.map((label) => (
        <Tab key={label} value={label}>
          {label} body
        </Tab>
      ))}
    </Tabs>,
  );

  for (const value of idrefAttributes(html)) {
    assert.doesNotMatch(value, /\s/, `attribute value "${value}" contains whitespace`);
  }
  for (const label of LABELS) {
    assert.ok(html.includes(`>${label}</`), `expected "${label}" to stay visible`);
  }
});

test("escapeTabValue is idempotent, id-safe and keeps distinct labels distinct", () => {
  const cases = [
    "Relational databases",
    "relational databases",
    "Relational  databases",
    "Relational (databases)",
    "Prompt to seed the database",
    "npm",
    "日本語",
  ];

  const seen = new Map<string, string>();
  for (const label of cases) {
    const token = escapeTabValue(label);
    assert.doesNotMatch(token, /\s/, `"${label}" escaped to "${token}"`);
    assert.match(token, /^[a-z0-9_-]+$/, `"${label}" escaped to "${token}"`);
    assert.equal(escapeTabValue(token), token, "escaping must be idempotent");
    assert.equal(seen.get(token), undefined, `"${label}" collides with "${seen.get(token)}"`);
    seen.set(token, label);
  }

  // Values that are already id-safe are left alone, which keeps persisted
  // package-manager selections (groupId + sessionStorage) stable.
  assert.equal(escapeTabValue("npm"), "npm");
  assert.equal(escapeTabValue(""), "");
});

test("the variant axis still matches tabs whose labels contain whitespace", () => {
  const html = renderToStaticMarkup(
    <CodeBlockTabs
      defaultValue="Relational databases"
      variants={["TypeScript", "Python"]}
      defaultVariant="TypeScript"
    >
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="Relational databases">
          Relational databases
        </CodeBlockTabsTrigger>
        <CodeBlockTabsTrigger value="MongoDB">MongoDB</CodeBlockTabsTrigger>
      </CodeBlockTabsList>
      <CodeBlockTab value="Relational databases" variant="TypeScript">
        <pre>relational typescript</pre>
      </CodeBlockTab>
      <CodeBlockTab value="MongoDB" variant="Python">
        <pre>mongo python</pre>
      </CodeBlockTab>
    </CodeBlockTabs>,
  );

  const triggers = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map(
    ([, attributes, inner]) => ({
      attributes,
      label: inner.replace(/<[^>]*>/g, "").trim(),
    }),
  );

  const relational = triggers.find((t) => t.label === "Relational databases");
  const mongo = triggers.find((t) => t.label === "MongoDB");

  // "Relational databases" has TypeScript content, "MongoDB" does not: the
  // availability lookup has to escape both sides or every tab reads as missing.
  assert.ok(relational, "expected the whitespace-labelled trigger");
  assert.doesNotMatch(relational.attributes, /disabled/);
  assert.match(mongo?.attributes ?? "", /disabled/);
});
