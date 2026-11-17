import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, test } from "node:test";

import {
  collectLastModified,
  describeGitError,
  gitLogArgs,
  ISOLATED_GIT_ENV,
  loadManifest,
  lookupLastModified,
  MANIFEST_FILE,
  parseGitLog,
  resolveCommit,
  resolveRemote,
} from "./last-modified";

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

test("parseGitLog keeps each file's newest commit date, in UTC", () => {
  const dates = parseGitLog(
    gitLog([
      ["aaa 2026-10-25T03:18:39+02:00", ["apps/docs/content/docs/compute/faq.mdx"]],
      [
        "bbb 2026-10-23T19:12:31+02:00",
        [
          "apps/docs/content/docs/compute/faq.mdx",
          "apps/docs/content/docs/compute/deploy-on-push.mdx",
        ],
      ],
    ]),
  );
  assert.equal(dates.get("apps/docs/content/docs/compute/faq.mdx"), "2026-10-25T01:18:39.000Z");
  assert.equal(
    dates.get("apps/docs/content/docs/compute/deploy-on-push.mdx"),
    "2026-10-23T17:12:31.000Z",
  );
});

test("parseGitLog drops dates from a shallow clone's boundary commit", () => {
  const dates = parseGitLog(
    gitLog([
      ["aaa 2026-10-24T09:00:00+00:00", ["apps/docs/content/docs/a.mdx"]],
      [
        "boundary 2026-10-23T09:00:00+00:00",
        ["apps/docs/content/docs/a.mdx", "apps/docs/content/docs/b.mdx"],
      ],
    ]),
    new Set(["boundary"]),
  );
  assert.equal(dates.get("apps/docs/content/docs/a.mdx"), "2026-10-24T09:00:00.000Z");
  assert.equal(dates.has("apps/docs/content/docs/b.mdx"), false);
});

test("parseGitLog keeps paths with quotes and spaces as they are on disk", () => {
  const dates = parseGitLog(gitLog([["aaa 2026-10-24T09:00:00Z", ['content/docs/a "b" c.mdx']]]));
  assert.equal(dates.get('content/docs/a "b" c.mdx'), "2026-10-24T09:00:00.000Z");
});

test("gitLogArgs follows the built branch and needs no file contents", () => {
  const args = gitLogArgs("HEAD", "apps/docs/content/docs");
  for (const flag of ["--first-parent", "-m", "--no-renames", "-z", "--name-only"]) {
    assert.ok(args.includes(flag), flag);
  }
  assert.deepEqual(args.slice(-2), ["--", "apps/docs/content/docs"]);
});

test("resolveRemote uses Vercel's, then GitHub Actions', then an https origin", () => {
  assert.equal(
    resolveRemote({
      VERCEL_GIT_PROVIDER: "github",
      VERCEL_GIT_REPO_OWNER: "prisma",
      VERCEL_GIT_REPO_SLUG: "web",
      GITHUB_SERVER_URL: "https://github.com",
      GITHUB_REPOSITORY: "someone/else",
    }),
    "https://github.com/prisma/web.git",
  );
  assert.equal(
    resolveRemote({ GITHUB_SERVER_URL: "https://github.com", GITHUB_REPOSITORY: "prisma/web" }),
    "https://github.com/prisma/web.git",
  );
  assert.equal(
    resolveRemote({}, "https://github.com/prisma/web\n"),
    "https://github.com/prisma/web",
  );
  // A build must not wait for SSH credentials, and other providers are not mapped.
  assert.equal(resolveRemote({}, "git@github.com:prisma/web.git"), undefined);
  assert.equal(
    resolveRemote({
      VERCEL_GIT_PROVIDER: "gitlab",
      VERCEL_GIT_REPO_OWNER: "prisma",
      VERCEL_GIT_REPO_SLUG: "web",
    }),
    undefined,
  );
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
  assert.equal(resolveCommit({ GITHUB_SHA: "c".repeat(40) }), "c".repeat(40));
  assert.equal(resolveCommit({ VERCEL_GIT_COMMIT_SHA: "main" }), undefined);
});

test("describeGitError keeps git's first stderr line and hides URL credentials", () => {
  const error = Object.assign(new Error("Command failed: git fetch"), {
    stderr:
      "\nfatal: unable to access 'https://x-access-token:secret@github.com/prisma/web.git/': " +
      "Could not resolve host: github.com\nmore\n",
  });
  assert.equal(
    describeGitError(error),
    "fatal: unable to access 'https://***@github.com/prisma/web.git/': Could not resolve host: github.com",
  );
  // No stderr (git missing, timeout): the spawn error.
  assert.equal(
    describeGitError(Object.assign(new Error("spawnSync git ETIMEDOUT"), { stderr: "" })),
    "spawnSync git ETIMEDOUT",
  );
});

test("lookupLastModified resolves absolute and app-relative paths", () => {
  const manifest = {
    history: "local" as const,
    files: { "content/docs/compute/faq.mdx": "2026-10-25T01:18:39.000Z" },
  };
  const appDir = path.join(path.sep, "repo", "apps", "docs");
  const expected = new Date("2026-10-25T01:18:39.000Z");
  assert.deepEqual(
    lookupLastModified(manifest, appDir, path.join(appDir, "content/docs/compute/faq.mdx")),
    expected,
  );
  assert.deepEqual(lookupLastModified(manifest, appDir, "content/docs/compute/faq.mdx"), expected);
  assert.equal(lookupLastModified(manifest, appDir, "content/docs/compute/index.mdx"), undefined);
});

describe("collectLastModified against real repositories", () => {
  let root: string;
  let origin: string;
  let originHead: string;

  const identity = {
    GIT_AUTHOR_NAME: "Docs",
    GIT_AUTHOR_EMAIL: "docs@example.com",
    GIT_COMMITTER_NAME: "Docs",
    GIT_COMMITTER_EMAIL: "docs@example.com",
  };

  function git(cwd: string, args: string[], date?: string): string {
    return execFileSync("git", ["-c", "commit.gpgsign=false", ...args], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      env: {
        ...process.env,
        // Run from a git hook, the tests must not act on the outer repository.
        ...ISOLATED_GIT_ENV,
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

  function commit(repo: string, date: string, message: string) {
    git(repo, ["add", "-A"]);
    git(repo, ["commit", "-q", "-m", message], date);
  }

  const docs = (repo: string) => path.join(repo, "apps", "docs");
  const noEnv = {};

  // History (first parent, newest last):
  //   2026-01-01  add a.mdx, b.mdx, old.mdx, meta.json
  //   2026-02-01  edit a.mdx and a blog post
  //   2026-03-01  delete old.mdx, edit meta.json
  //   2026-04-01  merge a branch that edited b.mdx on 2026-03-15
  before(() => {
    root = mkdtempSync(path.join(tmpdir(), "docs-last-modified-test-"));
    origin = path.join(root, "origin");
    mkdirSync(origin);
    git(origin, ["init", "-q", "-b", "main"]);
    write(origin, {
      "pnpm-workspace.yaml": "packages:\n  - apps/*\n",
      "apps/docs/content/docs/a.mdx": "a1",
      "apps/docs/content/docs/b.mdx": "b1",
      "apps/docs/content/docs/old.mdx": "old",
      "apps/docs/content/docs/meta.json": "{}",
    });
    commit(origin, "2026-01-01T10:00:00+00:00", "add pages");
    write(origin, { "apps/docs/content/docs/a.mdx": "a2", "apps/blog/content/post.mdx": "p" });
    commit(origin, "2026-02-01T10:00:00+00:00", "edit a");
    rmSync(path.join(origin, "apps/docs/content/docs/old.mdx"));
    write(origin, { "apps/docs/content/docs/meta.json": '{"pages":[]}' });
    commit(origin, "2026-03-01T10:00:00+00:00", "remove old");
    git(origin, ["checkout", "-q", "-b", "edit-b", "HEAD~1"]);
    write(origin, { "apps/docs/content/docs/b.mdx": "b2" });
    commit(origin, "2026-03-15T10:00:00+00:00", "edit b");
    git(origin, ["checkout", "-q", "main"]);
    git(
      origin,
      ["merge", "-q", "--no-ff", "-m", "merge edit-b", "edit-b"],
      "2026-04-01T10:00:00+00:00",
    );
    originHead = git(origin, ["rev-parse", "HEAD"]).trim();
  });

  after(() => rmSync(root, { recursive: true, force: true }));

  const fullHistory = {
    "content/docs/a.mdx": "2026-02-01T10:00:00.000Z",
    "content/docs/b.mdx": "2026-04-01T10:00:00.000Z",
  };

  test("a full clone dates each existing page by its last change on the branch", () => {
    const manifest = collectLastModified({ appDir: docs(origin), env: noEnv });
    assert.equal(manifest.history, "local");
    assert.equal(manifest.commit, originHead);
    // b.mdx is dated when its branch was merged; old.mdx is gone; meta.json
    // and the blog post are not docs pages.
    assert.deepEqual(manifest.files, fullHistory);
  });

  test("a shallow clone never dates pages with its boundary commit", () => {
    const shallow = path.join(root, "shallow");
    git(root, ["clone", "-q", "--depth", "1", `file://${origin}`, shallow]);
    const manifest = collectLastModified({ appDir: docs(shallow), env: noEnv });
    assert.equal(manifest.history, "shallow");
    assert.deepEqual(manifest.files, {});
  });

  test("a shallow clone fetches the commit's full history when allowed", () => {
    const shallow = path.join(root, "shallow-fetch");
    git(root, ["clone", "-q", "--depth", "1", `file://${origin}`, shallow]);
    const manifest = collectLastModified({
      appDir: docs(shallow),
      env: noEnv,
      fetchHistory: true,
      remote: `file://${origin}`,
    });
    assert.equal(manifest.history, "fetched");
    assert.equal(manifest.commit, originHead);
    assert.deepEqual(manifest.files, fullHistory);
  });

  test("a build without .git fetches the commit named by Vercel", () => {
    const exported = path.join(root, "exported");
    cpSync(origin, exported, {
      recursive: true,
      filter: (source) => path.basename(source) !== ".git",
    });
    const vercel = {
      VERCEL_GIT_PROVIDER: "github",
      VERCEL_GIT_REPO_OWNER: "prisma",
      VERCEL_GIT_REPO_SLUG: "web",
      VERCEL_GIT_COMMIT_SHA: originHead,
    };
    const manifest = collectLastModified({
      appDir: docs(exported),
      env: vercel,
      fetchHistory: true,
      remote: `file://${origin}`,
    });
    assert.equal(manifest.history, "fetched");
    assert.deepEqual(manifest.files, fullHistory);

    // Without a commit to fetch there is no history, and no page gets a date.
    const none = collectLastModified({
      appDir: docs(exported),
      env: noEnv,
      fetchHistory: true,
      remote: `file://${origin}`,
    });
    assert.deepEqual(none, {
      history: "none",
      files: {},
      fetchError: "no commit to fetch (no local HEAD, VERCEL_GIT_COMMIT_SHA or GITHUB_SHA)",
    });
  });

  test("a failed fetch keeps the shallow dates and reports git's reason", () => {
    const shallow = path.join(root, "shallow-unreachable");
    git(root, ["clone", "-q", "--depth", "1", `file://${origin}`, shallow]);
    const manifest = collectLastModified({
      appDir: docs(shallow),
      env: noEnv,
      fetchHistory: true,
      remote: `file://${path.join(root, "missing")}`,
    });
    assert.equal(manifest.history, "shallow");
    assert.deepEqual(manifest.files, {});
    assert.match(manifest.fetchError ?? "", /^git fetch: fatal: .*missing/);
  });

  test("the fetch ignores GIT_DIR and GIT_WORK_TREE set by a caller", () => {
    const exported = path.join(root, "exported-git-dir");
    cpSync(origin, exported, {
      recursive: true,
      filter: (source) => path.basename(source) !== ".git",
    });
    const outer = path.join(root, "outer.git");
    const saved = { GIT_DIR: process.env.GIT_DIR, GIT_WORK_TREE: process.env.GIT_WORK_TREE };
    process.env.GIT_DIR = outer;
    process.env.GIT_WORK_TREE = exported;
    try {
      const manifest = collectLastModified({
        appDir: docs(exported),
        env: { VERCEL_GIT_COMMIT_SHA: originHead },
        fetchHistory: true,
        remote: `file://${origin}`,
      });
      assert.equal(manifest.history, "fetched");
      assert.deepEqual(manifest.files, fullHistory);
    } finally {
      for (const [key, value] of Object.entries(saved)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
    // The temporary repository was created where intended, not at GIT_DIR.
    assert.equal(existsSync(outer), false);
  });

  test("loadManifest uses the build's manifest only for the checked-out commit", () => {
    const appDir = docs(origin);
    const manifestPath = path.join(appDir, MANIFEST_FILE);
    mkdirSync(path.dirname(manifestPath), { recursive: true });
    const written = {
      commit: originHead,
      history: "fetched",
      files: { "content/docs/a.mdx": "2026-02-01T10:00:00.000Z" },
    };
    writeFileSync(manifestPath, JSON.stringify(written));
    assert.deepEqual(loadManifest(appDir), written);

    writeFileSync(manifestPath, JSON.stringify({ ...written, commit: "f".repeat(40) }));
    const stale = loadManifest(appDir);
    assert.equal(stale.history, "local");
    assert.deepEqual(stale.files, fullHistory);
    assert.match(readFileSync(manifestPath, "utf8"), /f{40}/);
    rmSync(path.dirname(manifestPath), { recursive: true, force: true });
  });
});
