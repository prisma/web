import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { after, before, describe } from "node:test";

import {
  getGitFileDates,
  getRouteLastModified,
  ROUTE_CONTENT_FILES,
  gitLogArgs,
  parseGitLog,
  resolveCommit,
  resolveRemote,
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

test("a route's date is the newest among its page and its content files, not shared modules", () => {
  const src = "/repo/apps/site/src";
  const page = `${src}/app/pricing/page.tsx`;
  const content = { "/pricing": ["lib/markdown/pricing.ts"] };
  const dates = new Map([
    [page, "2026-10-05"],
    [`${src}/lib/markdown/pricing.ts`, "2026-10-22"],
    // Imported by every page: a change here is not a change to /pricing.
    [`${src}/components/brand/prism-button.tsx`, "2026-10-27"],
  ]);
  assert.equal(getRouteLastModified("/pricing", page, src, dates, content), "2026-10-22");

  dates.set(page, "2026-10-24");
  assert.equal(getRouteLastModified("/pricing", page, src, dates, content), "2026-10-24");

  assert.equal(getRouteLastModified("/pricing", page, src, new Map(), content), undefined);
});

test("a route with no content file gets no date, even when its page has one", () => {
  const src = "/repo/apps/site/src";
  const page = `${src}/app/community/page.tsx`;
  const dates = new Map([[page, "2026-10-22"]]);
  assert.equal(getRouteLastModified("/community", page, src, dates, {}), undefined);
  assert.equal(getRouteLastModified("/community", page, src, dates), undefined);
  // Not a key inherited from Object.prototype either.
  assert.equal(getRouteLastModified("constructor", page, src, dates), undefined);
});

test("home, pricing, postgres and compute are dated by their content files", () => {
  assert.deepEqual(ROUTE_CONTENT_FILES["/"], ["lib/markdown/home.ts"]);
  assert.deepEqual(ROUTE_CONTENT_FILES["/pricing"], ["lib/markdown/pricing.ts"]);
  assert.deepEqual(ROUTE_CONTENT_FILES["/postgres"], ["components/product/content/postgres.ts"]);
  assert.deepEqual(ROUTE_CONTENT_FILES["/compute"], ["components/product/content/compute.ts"]);
  assert.deepEqual(ROUTE_CONTENT_FILES["/compare/neon"], ["app/compare/neon/_content.ts"]);
});

test("every route in ROUTE_CONTENT_FILES has a page and every content file exists", () => {
  // A renamed route or content file must fail here, not silently drop a date.
  const src = path.join(process.cwd(), "src");
  const appDirectory = path.join(src, "app");
  for (const [pathname, files] of Object.entries(ROUTE_CONTENT_FILES)) {
    const segments = pathname === "/" ? [] : pathname.slice(1).split("/");
    const pages = [
      path.join(appDirectory, ...segments, "page.tsx"),
      path.join(appDirectory, "(prisma-with)", ...segments, "page.tsx"),
    ];
    assert.ok(
      pages.some((page) => existsSync(page)),
      `${pathname} has no page.tsx`,
    );
    assert.ok(files.length > 0, pathname);
    for (const file of files) {
      assert.ok(existsSync(path.join(src, file)), `${pathname}: ${file} does not exist`);
    }
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
  assert.match(
    sitemapSource,
    /getRouteLastModified\(pathname, filePath, SRC_DIRECTORY, fileDates\)/,
  );
});

test("the production build may fetch git history for the sitemap dates", () => {
  const sitemapSource = readFileSync(new URL("./sitemap.ts", import.meta.url), "utf8");
  assert.match(sitemapSource, /fetchHistory: process\.env\.NODE_ENV === "production"/);
});

test("gitLogArgs follows the built branch and needs no file contents", () => {
  const args = gitLogArgs("abc", "apps/site/src");
  assert.deepEqual(args.slice(0, 2), ["log", "abc"]);
  for (const flag of ["--first-parent", "-m", "--no-renames", "-z", "--name-only"]) {
    assert.ok(args.includes(flag), flag);
  }
  assert.deepEqual(args.slice(-2), ["--", "apps/site/src"]);
});

test("resolveRemote uses Vercel's, then GitHub Actions', then an https origin", () => {
  assert.equal(
    resolveRemote({
      VERCEL_GIT_PROVIDER: "github",
      VERCEL_GIT_REPO_OWNER: "prisma",
      VERCEL_GIT_REPO_SLUG: "web",
      GITHUB_SERVER_URL: "https://github.com",
      GITHUB_REPOSITORY: "other/repo",
    }),
    "https://github.com/prisma/web.git",
  );
  assert.equal(
    resolveRemote({ GITHUB_SERVER_URL: "https://github.com/", GITHUB_REPOSITORY: "prisma/web" }),
    "https://github.com/prisma/web.git",
  );
  assert.equal(
    resolveRemote({}, "https://github.com/prisma/web.git\n"),
    "https://github.com/prisma/web.git",
  );
  assert.equal(resolveRemote({}, "git@github.com:prisma/web.git"), undefined);
  assert.equal(
    resolveRemote({
      VERCEL_GIT_PROVIDER: "github",
      VERCEL_GIT_REPO_OWNER: "prisma/../x",
      VERCEL_GIT_REPO_SLUG: "web",
    }),
    undefined,
  );
});

test("resolveCommit prefers the checked-out commit and accepts only full SHAs", () => {
  const head = "a".repeat(40);
  const vercel = "b".repeat(40);
  assert.equal(resolveCommit({ VERCEL_GIT_COMMIT_SHA: vercel }, `${head}\n`), head);
  assert.equal(resolveCommit({ VERCEL_GIT_COMMIT_SHA: vercel }), vercel);
  assert.equal(resolveCommit({ GITHUB_SHA: vercel }), vercel);
  assert.equal(resolveCommit({ VERCEL_GIT_COMMIT_SHA: "main" }), undefined);
});

describe("git history on each kind of build host", () => {
  let root: string;
  let origin: string;
  let originHead: string;

  const isolated = {
    GIT_DIR: undefined,
    GIT_WORK_TREE: undefined,
    GIT_INDEX_FILE: undefined,
    GIT_COMMON_DIR: undefined,
    GIT_OBJECT_DIRECTORY: undefined,
    GIT_ALTERNATE_OBJECT_DIRECTORIES: undefined,
  };
  const identity = {
    GIT_AUTHOR_NAME: "Site",
    GIT_AUTHOR_EMAIL: "site@example.com",
    GIT_COMMITTER_NAME: "Site",
    GIT_COMMITTER_EMAIL: "site@example.com",
  };

  function git(cwd: string, args: string[], date?: string): string {
    return execFileSync("git", ["-c", "commit.gpgsign=false", ...args], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      env: {
        ...process.env,
        // Run from a git hook, the tests must not act on the outer repository.
        ...isolated,
        ...identity,
        ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}),
      },
    });
  }

  function write(repo: string, files: Record<string, string>) {
    for (const [file, content] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
      writeFileSync(path.join(repo, file), content);
    }
  }

  function commit(repo: string, date: string) {
    git(repo, ["add", "-A"]);
    git(repo, ["commit", "-q", "-m", "change"], date);
  }

  const src = (repo: string) => path.join(repo, "apps", "site", "src");
  const relative = (repo: string, dates: Map<string, string>) =>
    Object.fromEntries(
      [...dates].map(([file, date]) => [
        path.relative(src(repo), file).split(path.sep).join("/"),
        date,
      ]),
    );

  // History, newest last:
  //   2026-01-01  add app/pricing/page.tsx and app/compute/page.tsx
  //   2026-02-01  edit app/pricing/page.tsx and a docs page
  //   2026-03-01  edit components/hero.tsx
  before(() => {
    // Real path: git reports its top level resolved (macOS /var is /private/var).
    root = realpathSync(mkdtempSync(path.join(tmpdir(), "site-sitemap-lastmod-test-")));
    origin = path.join(root, "origin");
    mkdirSync(origin);
    git(origin, ["init", "-q", "-b", "main"]);
    write(origin, {
      "pnpm-workspace.yaml": "packages:\n  - apps/*\n",
      "apps/site/src/app/pricing/page.tsx": "p1",
      "apps/site/src/app/compute/page.tsx": "c1",
    });
    commit(origin, "2026-01-01T10:00:00+00:00");
    write(origin, {
      "apps/site/src/app/pricing/page.tsx": "p2",
      "apps/docs/content/docs/a.mdx": "a",
    });
    commit(origin, "2026-02-01T10:00:00+00:00");
    write(origin, { "apps/site/src/components/hero.tsx": "h" });
    commit(origin, "2026-03-01T23:30:00-02:00");
    originHead = git(origin, ["rev-parse", "HEAD"]).trim();
  });

  after(() => rmSync(root, { recursive: true, force: true }));

  const fullHistory = {
    "app/compute/page.tsx": "2026-01-01",
    "app/pricing/page.tsx": "2026-02-01",
    "components/hero.tsx": "2026-03-02",
  };

  test("a full clone reads its own history and does not fetch", () => {
    const messages: string[] = [];
    const dates = getGitFileDates(src(origin), {
      fetchHistory: true,
      env: {},
      remote: `file://${path.join(root, "missing")}`,
      report: (message) => messages.push(message),
    });
    assert.deepEqual(relative(origin, dates), fullHistory);
    assert.deepEqual(messages, []);
  });

  test("a shallow clone keeps no boundary dates unless it may fetch", () => {
    const shallow = path.join(root, "shallow");
    git(root, ["clone", "-q", "--depth", "1", `file://${origin}`, shallow]);
    assert.equal(getGitFileDates(src(shallow), { env: {} }).size, 0);

    const dates = getGitFileDates(src(shallow), {
      fetchHistory: true,
      env: {},
      remote: `file://${origin}`,
    });
    assert.deepEqual(relative(shallow, dates), fullHistory);
  });

  test("a build without .git fetches the commit named by Vercel", () => {
    const exported = path.join(root, "exported");
    cpSync(origin, exported, {
      recursive: true,
      filter: (source) => path.basename(source) !== ".git",
    });
    const messages: string[] = [];
    const dates = getGitFileDates(src(exported), {
      fetchHistory: true,
      env: { VERCEL_GIT_COMMIT_SHA: originHead },
      remote: `file://${origin}`,
      report: (message) => messages.push(message),
    });
    assert.deepEqual(relative(exported, dates), fullHistory);
    assert.deepEqual(messages, [
      `3 file dates from git history fetched for ${originHead.slice(0, 12)}`,
    ]);

    // Without a commit to fetch there is no history, and no route gets a date.
    const none: string[] = [];
    const noDates = getGitFileDates(src(exported), {
      fetchHistory: true,
      env: {},
      remote: `file://${origin}`,
      report: (message) => none.push(message),
    });
    assert.equal(noDates.size, 0);
    assert.deepEqual(none, [
      "no file dates, no git history (history fetch failed: no commit to fetch (no local HEAD, VERCEL_GIT_COMMIT_SHA or GITHUB_SHA))",
    ]);
  });

  test("a failed fetch keeps only the shallow clone's dates newer than its boundary", () => {
    const shallow = path.join(root, "shallow-2");
    git(root, ["clone", "-q", "--depth", "2", `file://${origin}`, shallow]);
    const messages: string[] = [];
    const dates = getGitFileDates(src(shallow), {
      fetchHistory: true,
      env: {},
      remote: `file://${path.join(root, "missing")}`,
      report: (message) => messages.push(message),
    });
    // Depth 2: the 2026-02-01 commit is the boundary, so only hero.tsx is dated.
    assert.deepEqual(relative(shallow, dates), { "components/hero.tsx": "2026-03-02" });
    assert.equal(messages.length, 1);
    assert.match(
      messages[0]!,
      /^1 file dates from a shallow git history \(history fetch failed: git fetch: /,
    );
  });
});
