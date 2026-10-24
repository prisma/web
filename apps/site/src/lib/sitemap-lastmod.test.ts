import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  collectLocalModules,
  getGitFileDates,
  getRouteLastModified,
  parseGitLog,
} from "./sitemap-lastmod";

const TOP = "/repo";

/**
 * `git log -z --format=commit:%H %cI --name-only` output for the given
 * commits, newest first: every header and path ends in NUL, and a newline
 * separates a header from its first path.
 */
function gitLog(commits: [header: string, paths: string[]][]): string {
  return commits
    .map(
      ([header, paths]) =>
        `commit:${header}\0` + paths.map((p, i) => `${i === 0 ? "\n" : ""}${p}\0`).join(""),
    )
    .join("");
}

test("parseGitLog keeps each file's newest commit date", () => {
  const log = gitLog([
    [
      "aaa 2026-10-22T10:00:00+02:00",
      ["apps/site/src/app/pricing/page.tsx", "apps/site/src/components/sections/pricing-hero.tsx"],
    ],
    [
      "bbb 2026-10-05T16:56:15+02:00",
      ["apps/site/src/app/pricing/page.tsx", "apps/site/src/app/orm/page.tsx"],
    ],
  ]);

  const dates = parseGitLog(log, TOP);
  assert.equal(dates.get("/repo/apps/site/src/app/pricing/page.tsx"), "2026-10-22");
  assert.equal(dates.get("/repo/apps/site/src/components/sections/pricing-hero.tsx"), "2026-10-22");
  assert.equal(dates.get("/repo/apps/site/src/app/orm/page.tsx"), "2026-10-05");
});

test("parseGitLog drops dates from a shallow clone's boundary commit", () => {
  const log = gitLog([
    ["aaa 2026-10-24T09:00:00+00:00", ["apps/site/src/app/pricing/page.tsx"]],
    [
      "boundary 2026-10-23T09:00:00+00:00",
      ["apps/site/src/app/pricing/page.tsx", "apps/site/src/app/orm/page.tsx"],
    ],
  ]);

  const dates = parseGitLog(log, TOP, new Set(["boundary"]));
  assert.equal(dates.get("/repo/apps/site/src/app/pricing/page.tsx"), "2026-10-24");
  assert.equal(dates.has("/repo/apps/site/src/app/orm/page.tsx"), false);
});

test("parseGitLog keeps a path with a quote or backslash as it is on disk", () => {
  const weird = 'apps/site/src/app/we"ird\\name/page.tsx';
  const log = gitLog([["aaa 2026-10-22T10:00:00+00:00", [weird]]]);
  assert.equal(parseGitLog(log, TOP).get(`/repo/${weird}`), "2026-10-22");
});

test("parseGitLog stores UTC days, so commits from different time zones compare in order", () => {
  const log = gitLog([
    // Newer instant (23:00Z on the 4th), recorded in UTC.
    ["later 2026-10-04T23:00:00+00:00", ["apps/site/src/components/b.tsx"]],
    // Older instant (20:00Z on the 4th), recorded in +05:00 as the 5th.
    ["earlier 2026-10-05T01:00:00+05:00", ["apps/site/src/components/a.tsx"]],
  ]);
  const dates = parseGitLog(log, TOP);
  assert.equal(dates.get("/repo/apps/site/src/components/a.tsx"), "2026-10-04");
  assert.equal(dates.get("/repo/apps/site/src/components/b.tsx"), "2026-10-04");
});

test("getGitFileDates reads real git output into UTC days", () => {
  const src = path.join(process.cwd(), "src");
  for (const [file, day] of getGitFileDates(src)) {
    assert.ok(path.isAbsolute(file), file);
    assert.match(day, /^\d{4}-\d{2}-\d{2}$/, file);
  }
});

test("a route's date is the newest among its page and the local modules it imports", () => {
  const src = mkdtempSync(path.join(tmpdir(), "sitemap-lastmod-"));
  try {
    mkdirSync(path.join(src, "app/pricing"), { recursive: true });
    mkdirSync(path.join(src, "components"), { recursive: true });
    const page = path.join(src, "app/pricing/page.tsx");
    const hero = path.join(src, "components/hero.tsx");
    const data = path.join(src, "components/data.ts");
    const unrelated = path.join(src, "components/unrelated.tsx");
    writeFileSync(
      page,
      'import { Hero } from "@/components/hero";\nimport { z } from "zod";\nexport default Hero;\n',
    );
    writeFileSync(hero, 'import { DATA } from "./data";\nexport const Hero = () => DATA;\n');
    writeFileSync(data, "export const DATA = 1;\n");
    writeFileSync(unrelated, "export const X = 1;\n");

    assert.deepEqual(collectLocalModules(page, src), new Set([page, hero, data]));

    const dates = new Map([
      [page, "2026-10-05"],
      [hero, "2026-10-12"],
      [data, "2026-10-22"],
      [unrelated, "2026-10-24"],
    ]);
    assert.equal(getRouteLastModified(page, src, dates), "2026-10-22");
    assert.equal(getRouteLastModified(page, src, new Map()), undefined);
  } finally {
    rmSync(src, { recursive: true, force: true });
  }
});

test("outside a git work tree there are no dates", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "sitemap-nogit-"));
  try {
    assert.equal(getGitFileDates(directory).size, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("the site sitemap takes TSX route dates from git, never from file modification times", () => {
  // sitemap.ts loads the changelog MDX collection, which node:test cannot
  // import, so this reads its source, as markdown-route-vary.test.ts does.
  const sitemapSource = readFileSync(new URL("./sitemap.ts", import.meta.url), "utf8");
  assert.doesNotMatch(sitemapSource, /\bmtime\b|\bstat\(/);
  assert.match(sitemapSource, /getRouteLastModified\(filePath, SRC_DIRECTORY, fileDates\)/);
});
