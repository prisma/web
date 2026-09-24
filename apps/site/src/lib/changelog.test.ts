import assert from "node:assert/strict";
import test from "node:test";
import { getChangelogEntries, getChangelogNeighbours } from "./changelog";

test("changelog entries are sorted newest first", () => {
  const entries = getChangelogEntries();
  assert.ok(entries.length > 1, "expected more than one changelog entry");

  for (let i = 1; i < entries.length; i++) {
    const newer = new Date(entries[i - 1].frontmatter.date).getTime();
    const older = new Date(entries[i].frontmatter.date).getTime();
    assert.ok(newer >= older, `${entries[i - 1].slug} should not be older than ${entries[i].slug}`);
  }
});

test("every entry has a neighbour to link to, and neighbours are adjacent", () => {
  const entries = getChangelogEntries();

  for (const [index, entry] of entries.entries()) {
    const { newer, older } = getChangelogNeighbours(entry.slug);

    assert.equal(newer?.slug, entries[index - 1]?.slug);
    assert.equal(older?.slug, entries[index + 1]?.slug);
    assert.ok(newer || older, `${entry.slug} has no neighbouring entry to link to`);
  }
});

test("neighbour links have a headline or title to use as anchor text", () => {
  for (const entry of getChangelogEntries()) {
    const anchorText = entry.frontmatter.headline ?? entry.frontmatter.title;
    assert.ok(
      typeof anchorText === "string" && anchorText.trim().length > 0,
      `${entry.slug} has no headline or title`,
    );
  }
});

test("an unknown slug has no neighbours", () => {
  assert.deepEqual(getChangelogNeighbours("not-a-real-entry"), {
    newer: undefined,
    older: undefined,
  });
});
