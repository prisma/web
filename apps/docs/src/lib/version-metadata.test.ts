import assert from "node:assert/strict";
import test from "node:test";
import {
  getPageVersion,
  getPageVersionLabel,
  mentionsVersion,
  withVersionDescription,
  withVersionTitle,
} from "./version-metadata";

test("labels ORM pages with their version", () => {
  assert.equal(getPageVersionLabel("/orm/v6/reference/supported-databases"), "Prisma ORM v6");
  assert.equal(getPageVersionLabel("/orm/v7/reference/supported-databases"), "Prisma ORM v7");
});

test("labels CLI and guides pages", () => {
  assert.equal(getPageVersionLabel("/cli/v7/commands"), "Prisma CLI v7");
  assert.equal(getPageVersionLabel("/guides/v7/nextjs"), "Prisma ORM v7");
});

test("labels the versioned getting-started tree", () => {
  assert.equal(getPageVersionLabel("/v7"), "Prisma ORM v7");
  assert.equal(getPageVersionLabel("/v7/getting-started"), "Prisma ORM v7");
});

test("returns null for latest and unversioned pages", () => {
  for (const url of [
    "/",
    "/orm",
    "/orm/reference/supported-databases",
    "/cli/commands",
    "/guides/nextjs",
    "/getting-started",
    "/postgres/database/query-insights",
    "/ai/tools/mcp-server",
  ]) {
    assert.equal(getPageVersionLabel(url), null, url);
  }
});

test("accepts URLs that carry the /docs base path", () => {
  assert.equal(getPageVersionLabel("/docs/orm/v6/more/troubleshooting/nuxt"), "Prisma ORM v6");
  assert.equal(getPageVersionLabel("/docs/orm/reference/error-reference"), null);
});

test("ignores query strings, hashes, and trailing slashes", () => {
  assert.equal(getPageVersionLabel("/orm/v6/reference/#errors"), "Prisma ORM v6");
  assert.equal(getPageVersionLabel("/orm/v7/reference?page=2"), "Prisma ORM v7");
});

test("exposes the raw version segment alongside the label", () => {
  assert.deepEqual(getPageVersion("/orm/v6/more/troubleshooting/nuxt"), {
    version: "v6",
    label: "Prisma ORM v6",
  });
  assert.equal(getPageVersion("/orm/reference"), null);
});

test("appends the label to a title", () => {
  const version = getPageVersion("/orm/v6/reference/supported-databases");
  assert.equal(
    withVersionTitle("Supported databases", version),
    "Supported databases (Prisma ORM v6)",
  );
});

test("leaves a title that already names the version alone", () => {
  const version = getPageVersion("/orm/v6/upgrade-guides/upgrading-to-prisma-6");
  assert.equal(withVersionTitle("Upgrade to Prisma ORM v6", version), "Upgrade to Prisma ORM v6");
  assert.equal(withVersionTitle("What is new in v6", version), "What is new in v6");
  assert.equal(
    withVersionTitle("Prisma ORM V6 release notes", version),
    "Prisma ORM V6 release notes",
  );
});

test("leaves a title that names the version without the v alone", () => {
  assert.equal(
    withVersionTitle("What is Prisma 7?", getPageVersion("/orm/v7/overview")),
    "What is Prisma 7?",
  );
  assert.equal(
    withVersionTitle(
      "What is Prisma ORM? (Prisma 6 overview)",
      getPageVersion("/orm/v6/overview/introduction/what-is-prisma"),
    ),
    "What is Prisma ORM? (Prisma 6 overview)",
  );
  assert.equal(
    withVersionDescription("Upgrade to Prisma ORM 6.16.", getPageVersion("/orm/v6/upgrade")),
    "Upgrade to Prisma ORM 6.16.",
  );
});

test("does not treat a lookalike token as the version", () => {
  const version = getPageVersion("/orm/v6/reference");
  assert.equal(
    withVersionTitle("Migrate from v65 tooling", version),
    "Migrate from v65 tooling (Prisma ORM v6)",
  );
  assert.equal(withVersionTitle("Upgrading to v7", version), "Upgrading to v7 (Prisma ORM v6)");
  assert.equal(
    withVersionTitle("Prisma 60 features", version),
    "Prisma 60 features (Prisma ORM v6)",
  );
  assert.equal(withVersionTitle("What is Prisma 7?", version), "What is Prisma 7? (Prisma ORM v6)");
});

test("leaves latest titles and descriptions untouched", () => {
  assert.equal(withVersionTitle("Supported databases", null), "Supported databases");
  assert.equal(withVersionDescription("A description.", null), "A description.");
});

test("appends an Applies to sentence to a description", () => {
  const version = getPageVersion("/orm/v7/reference/supported-databases");
  assert.equal(
    withVersionDescription("Databases supported by Prisma ORM.", version),
    "Databases supported by Prisma ORM. Applies to Prisma ORM v7.",
  );
});

test("adds the missing sentence stop before the Applies to sentence", () => {
  const version = getPageVersion("/cli/v7/commands");
  assert.equal(
    withVersionDescription("Every Prisma CLI command", version),
    "Every Prisma CLI command. Applies to Prisma CLI v7.",
  );
});

test("leaves a description that already names the version alone", () => {
  const version = getPageVersion("/orm/v6/reference");
  assert.equal(
    withVersionDescription("How to upgrade to Prisma ORM v6.", version),
    "How to upgrade to Prisma ORM v6.",
  );
});

test("handles empty and missing values", () => {
  const version = getPageVersion("/orm/v6/reference");
  assert.equal(withVersionDescription(undefined, version), undefined);
  assert.equal(withVersionDescription("", version), "");
  assert.equal(withVersionTitle("", version), "");
});

test("mentionsVersion matches the label and the bare segment", () => {
  const version = getPageVersion("/guides/v7/nextjs");
  assert.ok(version);
  assert.ok(mentionsVersion("Getting started with Prisma 7", version));
  assert.ok(mentionsVersion("Install the v7 CLI", version));
  assert.ok(!mentionsVersion("Getting started with Prisma Postgres", version));
  assert.ok(mentionsVersion("Prisma ORM 7 release notes", version));
  assert.ok(mentionsVersion("Prisma CLI 7 commands", version));
  assert.ok(!mentionsVersion("Prisma 6 release notes", version));
});
