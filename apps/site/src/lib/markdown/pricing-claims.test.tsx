import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { providersLanding } from "@/components/landing/content";
import {
  ALTERNATIVES,
  PRISMA,
  SAVINGS_MULTIPLE,
  WIDEST,
} from "@/components/sections/pricing-comparison";
import { GROUPS } from "@/components/sections/pricing-spec-table";
import { renderHomeMarkdown } from "@/lib/markdown/home";
import { renderPricingMarkdown } from "@/lib/markdown/pricing";

// Pins the cost comparison, the connection pool rows and the Free plan's
// spend limit on home, /pricing and /lp/providers, in the HTML data and in
// the Markdown renditions, so the two cannot drift apart again. The figures
// and their basis are documented in pricing-comparison.tsx and
// pricing-scale.tsx.

const siteRoot = new URL("../../..", import.meta.url).pathname;
const pricingScaleSource = readFileSync(
  join(siteRoot, "src/components/sections/pricing-scale.tsx"),
  "utf8",
);

const RETIRED = [
  /5x/,
  /\$385/,
  /\$2,800/,
  /\$70-90/,
  /Credit card required up front/,
  /Auto-scaling/,
];

test("the /pricing comparison uses the recomputed Neon + Vercel figure", () => {
  const neonVercel = ALTERNATIVES.find((alt) => alt.id === "neon-vercel");
  assert.ok(neonVercel);
  assert.equal(neonVercel.cost, "$130–270");
  assert.equal(PRISMA.cost, "$72–90");
  assert.equal(WIDEST.id, "neon-vercel");
  assert.equal(SAVINGS_MULTIPLE, 2);
  assert.ok(
    neonVercel.rows.every((row) => row.value !== "Not standard"),
    "Neon + Vercel spend controls are described, not dismissed",
  );
});

test("the /pricing Markdown matches the comparison data", () => {
  const markdown = renderPricingMarkdown();
  assert.ok(markdown.includes(`Up to ${SAVINGS_MULTIPLE}x less vs ${WIDEST.shortName}`));
  assert.ok(markdown.includes("can cost less than half as much as a typical"));
  for (const alt of ALTERNATIVES) assert.ok(markdown.includes(alt.cost), alt.cost);
  assert.ok(markdown.includes(PRISMA.cost));
  for (const pattern of RETIRED) assert.doesNotMatch(markdown, pattern);
});

test("the home scenario cards and their Markdown agree, with Prisma Pro at /pricing's figure", () => {
  const typical = [...pricingScaleSource.matchAll(/typicalCost: "([^"]+)"/g)].map((m) => m[1]);
  const prisma = [...pricingScaleSource.matchAll(/prismaCost: "([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(typical, ["$20-35", "$130-270"]);
  assert.deepEqual(prisma, ["$0-22", "$72-90"]);
  // Same figures as /pricing, written with a hyphen as on the rest of the card.
  assert.equal(prisma[1], PRISMA.cost.replace("–", "-"));
  assert.equal(typical[1], ALTERNATIVES[0].cost.replace("–", "-"));

  const markdown = renderHomeMarkdown();
  for (const cost of typical) {
    assert.ok(markdown.includes(`Typical stack (Neon + Vercel): ${cost} per month`), cost);
  }
  for (const cost of prisma) assert.ok(markdown.includes(`Prisma: ${cost} per month`), cost);
  assert.doesNotMatch(markdown, /At scale \(~500K MAU\)/);
  for (const pattern of RETIRED) assert.doesNotMatch(markdown, pattern);
});

test("/lp/providers carries no 5x claim", () => {
  assert.doesNotMatch(providersLanding.hero.subheadline ?? "", /5x/);
  assert.match(providersLanding.hero.subheadline ?? "", /less than half as much/);
});

function specRow(group: string, label: string) {
  return GROUPS.find((g) => g.label === group)?.rows.find((r) => r.label === label);
}

test("the plan table shows the pool mode, pooled query limit and Free spend limit", () => {
  assert.equal(specRow("Managed connection pool", "Auto-scaling"), undefined);
  assert.deepEqual(specRow("Managed connection pool", "Pool mode")?.values, [
    "Transaction",
    "Transaction",
    "Transaction",
    "Transaction",
  ]);
  assert.deepEqual(
    specRow("Managed connection pool", "Operation duration (db queries)")?.values,
    Array(4).fill("10 min pooled, unlimited direct"),
  );
  assert.equal(
    specRow("Prisma Postgres", "Spend limits")?.values[0],
    "Fixed at $0, no card required",
  );

  const markdown = renderPricingMarkdown();
  assert.match(
    markdown,
    /\| Pool mode \| Transaction \| Transaction \| Transaction \| Transaction \|/,
  );
  assert.match(
    markdown,
    /\| Operation duration \(db queries\) \| 10 min pooled, unlimited direct \| 10 min pooled, unlimited direct \| 10 min pooled, unlimited direct \| 10 min pooled, unlimited direct \|/,
  );
  assert.match(markdown, /\| Spend limits \| Fixed at \$0, no card required \| Included \|/);
});
