import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * `<lastmod>` for the site's TSX page routes, which have no frontmatter date.
 *
 * A route's date is the last commit that changed its `page.tsx` or one of the
 * files that hold its copy, listed in {@link ROUTE_CONTENT_FILES}. Shared
 * modules (layout, buttons, `page-metadata.ts`) do not count: a change there
 * is not a content change to every page that imports it. A route with no
 * listed content file gets no `<lastmod>`, since its page file alone would
 * miss most edits to its copy.
 *
 * Commits listed in `sitemap-lastmod-ignore-revs.txt` (next to `package.json`)
 * are skipped: they touched many pages without changing their copy (metadata
 * sweeps, copy moved word for word into a content file), so a file they touched
 * keeps the date of its previous commit.
 *
 * When the date is not known, the route gets no `<lastmod>`. In particular a
 * file's modification time is never used: on a fresh checkout it is the build
 * time, which would stamp every route with the deploy date.
 *
 * Git history may be missing (the Vercel build has no `.git`) or shallow
 * (GitHub Actions checks out one commit). The build then fetches the history
 * of the commit being built, without file contents (`--filter=blob:none`),
 * into a temporary repository, from the repository named by Vercel's or
 * GitHub Actions' variables, as the docs app does for its pages (see
 * `apps/docs/src/lib/last-modified.ts`). If that fails, a shallow clone keeps
 * only dates newer than its boundary: the oldest commit available stands in
 * for all older history, so a file last changed before it would get that
 * commit's date. With no history at all there are no dates.
 */

/** Calendar dates (YYYY-MM-DD) by absolute file path. */
export type FileDates = ReadonlyMap<string, string>;

const COMMIT_PREFIX = "commit:";

/**
 * Parses `git log -z --format=commit:%H %cI --name-only`, newest commit first,
 * into the date of the last commit that touched each file. With `-z` every
 * header and path ends in NUL and paths are not C-quoted, so a path with a
 * quote, backslash or control character comes through as it is on disk.
 * Dates are UTC calendar days, so days from commits made in different time
 * zones compare in commit order. Files whose last commit is a shallow-clone
 * boundary get no date. Commits in `ignoredCommits` are skipped, so the files
 * they touched take the date of their previous commit.
 */
export function parseGitLog(
  stdout: string,
  topLevel: string,
  boundaryCommits: ReadonlySet<string> = new Set(),
  ignoredCommits: ReadonlySet<string> = new Set(),
): Map<string, string> {
  const dates = new Map<string, string>();
  const seen = new Set<string>();
  let date: string | undefined;
  let ignored = false;

  for (const record of stdout.split("\0")) {
    // git writes a newline between a commit's header and its first path.
    const entry = record.startsWith("\n") ? record.slice(1) : record;

    if (entry.startsWith(COMMIT_PREFIX)) {
      const [sha = "", committedAt = ""] = entry.slice(COMMIT_PREFIX.length).trim().split(" ");
      const instant = new Date(committedAt);
      const day = Number.isNaN(instant.getTime()) ? "" : instant.toISOString().slice(0, 10);
      ignored = ignoredCommits.has(sha);
      date = boundaryCommits.has(sha) || !/^\d{4}-\d{2}-\d{2}$/.test(day) ? undefined : day;
      continue;
    }

    if (!entry || ignored) continue;
    const file = path.join(topLevel, entry);
    if (seen.has(file)) continue;
    seen.add(file);
    if (date) dates.set(file, date);
  }

  return dates;
}

/** The checked-in list of commits {@link getGitFileDates} skips, read from the app directory. */
export const IGNORE_REVS_FILE = path.join(process.cwd(), "sitemap-lastmod-ignore-revs.txt");

/**
 * Full commit SHAs from an ignore-revs file: one per line, `#` starts a
 * comment. Anything else on a line (an abbreviated SHA, a branch name) is not
 * a commit `git log` prints, so it is left out.
 */
export function parseIgnoreRevs(text: string): Set<string> {
  const revs = new Set<string>();
  for (const line of text.split("\n")) {
    const rev = line.replace(/#.*/, "").trim();
    if (/^[0-9a-f]{40}$/.test(rev)) revs.add(rev);
  }
  return revs;
}

/** {@link parseIgnoreRevs} of `file`, or an empty set when it cannot be read. */
export function readIgnoreRevs(file: string = IGNORE_REVS_FILE): Set<string> {
  try {
    return parseIgnoreRevs(readFileSync(file, "utf8"));
  } catch {
    return new Set();
  }
}

/** Environment variables, as `process.env` or a plain object in tests. */
export type Env = Readonly<Record<string, string | undefined>>;

/** Variables that point git at another repository; a temporary repository must not inherit them. */
const ISOLATED_GIT_ENV: Env = {
  GIT_DIR: undefined,
  GIT_WORK_TREE: undefined,
  GIT_INDEX_FILE: undefined,
  GIT_COMMON_DIR: undefined,
  GIT_OBJECT_DIRECTORY: undefined,
  GIT_ALTERNATE_OBJECT_DIRECTORIES: undefined,
};

/**
 * `next build` gives up on a page whose static generation takes more than 60
 * seconds, and the sitemap is generated there. All git commands for one
 * sitemap share this budget, so a slow fetch costs the dates, not the build.
 */
const GIT_BUDGET_MS = 50_000;

/** Longest single runs: init and log are local, the fetch is the network. */
const GIT_TIMEOUT_MS = { local: 10_000, init: 5_000, fetch: 35_000 } as const;

/** Milliseconds a command may run: its own limit, cut to what is left before `deadline`. */
function timeLeft(deadline: number, limit: number): number {
  return Math.min(limit, deadline - Date.now());
}

interface GitOptions {
  /** Milliseconds; at or below 0 the command is not run. */
  timeout?: number;
  /** Merged over `process.env`; an `undefined` value removes that variable. */
  env?: Env;
  /** Called with git's first stderr line (or the spawn error) when the command fails. */
  onError?: (message: string) => void;
}

function git(cwd: string, args: string[], options: GitOptions = {}): string | undefined {
  const timeout = options.timeout ?? GIT_TIMEOUT_MS.local;
  if (timeout <= 0) {
    options.onError?.("out of time (sitemap git budget spent)");
    return undefined;
  }
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", options.onError ? "pipe" : "ignore"],
      timeout,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0", ...options.env },
    });
  } catch (error) {
    if (options.onError) {
      const { stderr, message } = error as { stderr?: unknown; message?: unknown };
      const line = String(stderr ?? "")
        .split("\n")
        .map((text) => text.trim())
        .find(Boolean);
      // A remote URL may carry credentials; build logs must not.
      options.onError((line ?? String(message ?? error)).replace(/(\w+:\/\/)[^/@\s]+@/g, "$1***@"));
    }
    return undefined;
  }
}

/** `git log` arguments for {@link parseGitLog}: the revision's first-parent history, newest first. */
export function gitLogArgs(revision: string, pathspec: string): string[] {
  return [
    "log",
    revision,
    // Follow the branch itself; with -m a merge lists what it brought in,
    // dated when it landed rather than when the merged commits were made.
    "--first-parent",
    "-m",
    // Rename detection would need file contents, which a history fetched
    // with --filter=blob:none does not have; a move dates the new path.
    "--no-renames",
    "-z",
    // Committer date: when the change landed on the branch being built.
    "--format=commit:%H %cI",
    "--name-only",
    "--",
    pathspec,
  ];
}

/**
 * Commits a shallow clone cut its history at; `undefined` for a full clone and
 * `null` for a shallow one whose boundary cannot be read (no date is trusted).
 */
function getShallowBoundary(cwd: string, deadline: number): ReadonlySet<string> | null | undefined {
  const timeout = () => timeLeft(deadline, GIT_TIMEOUT_MS.local);
  const shallow = git(cwd, ["rev-parse", "--is-shallow-repository"], { timeout: timeout() });
  if (shallow?.trim() !== "true") return undefined;

  const shallowFile = git(cwd, ["rev-parse", "--path-format=absolute", "--git-path", "shallow"], {
    timeout: timeout(),
  });
  // Keep the path a plain variable: an expression with a literal fallback
  // makes Turbopack trace the whole project into the sitemap route.
  if (!shallowFile) return null;
  try {
    return new Set(readFileSync(shallowFile.trim(), "utf8").split("\n").filter(Boolean));
  } catch {
    return null;
  }
}

/**
 * The repository to fetch history from: Vercel's system environment
 * variables, then GitHub Actions', then an `https` `origin` remote. Other
 * remotes (SSH) are skipped, since a build must not wait for credentials.
 */
export function resolveRemote(env: Env, originUrl?: string): string | undefined {
  const name = /^[A-Za-z0-9_.-]+$/;
  const { VERCEL_GIT_PROVIDER, VERCEL_GIT_REPO_OWNER, VERCEL_GIT_REPO_SLUG } = env;
  if (
    VERCEL_GIT_PROVIDER === "github" &&
    VERCEL_GIT_REPO_OWNER &&
    VERCEL_GIT_REPO_SLUG &&
    name.test(VERCEL_GIT_REPO_OWNER) &&
    name.test(VERCEL_GIT_REPO_SLUG)
  ) {
    return `https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}.git`;
  }

  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY } = env;
  if (
    GITHUB_SERVER_URL?.startsWith("https://") &&
    GITHUB_REPOSITORY &&
    /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(GITHUB_REPOSITORY)
  ) {
    return `${GITHUB_SERVER_URL.replace(/\/+$/, "")}/${GITHUB_REPOSITORY}.git`;
  }

  const origin = originUrl?.trim();
  return origin?.startsWith("https://") ? origin : undefined;
}

/** The commit being built: local HEAD, else the one Vercel or GitHub Actions names. */
export function resolveCommit(env: Env, localHead?: string): string | undefined {
  for (const candidate of [localHead?.trim(), env.VERCEL_GIT_COMMIT_SHA, env.GITHUB_SHA]) {
    if (candidate && /^[0-9a-f]{40}$/.test(candidate)) return candidate;
  }
  return undefined;
}

/** The repository root: git's top level, else the directory holding `pnpm-workspace.yaml`. */
function findRepositoryRoot(directory: string, topLevel?: string): string | undefined {
  if (topLevel) return topLevel;
  for (let dir = directory; ; dir = path.dirname(dir)) {
    if (existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    if (path.dirname(dir) === dir) return undefined;
  }
}

/** `git log` output for `commit`'s full history, fetched from `remote` into a temporary repository. */
export function readFetchedLog(
  remote: string,
  commit: string,
  pathspec: string,
  deadline: number,
  tempRoot: string = tmpdir(),
): { log: string } | { error: string } {
  let dir: string | undefined;
  let reason = "unknown error";
  const onError = (message: string) => {
    reason = message;
  };
  try {
    try {
      dir = mkdtempSync(path.join(tempRoot, "site-sitemap-lastmod-"));
    } catch (error) {
      const { code, message } = error as { code?: unknown; message?: unknown };
      return { error: `mkdtemp: ${String(code ?? message ?? error)}` };
    }
    const init = git(dir, ["init", "--quiet", "--bare"], {
      timeout: timeLeft(deadline, GIT_TIMEOUT_MS.init),
      env: ISOLATED_GIT_ENV,
      onError,
    });
    if (init === undefined) return { error: `git init: ${reason}` };
    const fetched = git(
      dir,
      ["fetch", "--quiet", "--no-tags", "--filter=blob:none", remote, commit],
      { timeout: timeLeft(deadline, GIT_TIMEOUT_MS.fetch), env: ISOLATED_GIT_ENV, onError },
    );
    if (fetched === undefined) return { error: `git fetch: ${reason}` };
    // The log reads commits and trees only; never fetch file contents lazily.
    const log = git(dir, gitLogArgs(commit, pathspec), {
      timeout: timeLeft(deadline, GIT_TIMEOUT_MS.local),
      env: { ...ISOLATED_GIT_ENV, GIT_NO_LAZY_FETCH: "1" },
      onError,
    });
    return log === undefined ? { error: `git log: ${reason}` } : { log };
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

export interface GitFileDatesOptions {
  /** Fetch the built commit's history when the local one is missing or shallow (the build). */
  fetchHistory?: boolean;
  env?: Env;
  /** Overrides the repository resolved from the environment (tests). */
  remote?: string;
  /** Called once when a fetch was needed, with where the dates came from, for the build log. */
  report?: (message: string) => void;
  /** Commits to skip; defaults to {@link readIgnoreRevs} of {@link IGNORE_REVS_FILE}. */
  ignoreRevs?: ReadonlySet<string>;
}

/** Last-commit dates for every file under `directory`, or an empty map without git history. */
export function getGitFileDates(
  directory: string,
  {
    fetchHistory = false,
    env = process.env,
    remote,
    report,
    ignoreRevs = readIgnoreRevs(),
  }: GitFileDatesOptions = {},
): Map<string, string> {
  const deadline = Date.now() + GIT_BUDGET_MS;
  const local = (cwd: string, args: string[]) =>
    git(cwd, args, { timeout: timeLeft(deadline, GIT_TIMEOUT_MS.local) });

  const topLevel = local(directory, ["rev-parse", "--show-toplevel"])?.trim() || undefined;
  const boundary = topLevel ? getShallowBoundary(topLevel, deadline) : undefined;

  if (topLevel && boundary === undefined) {
    const log = local(topLevel, gitLogArgs("HEAD", directory));
    return log ? parseGitLog(log, topLevel, undefined, ignoreRevs) : new Map();
  }
  if (!fetchHistory) {
    if (!topLevel || !boundary) return new Map();
    const log = local(topLevel, gitLogArgs("HEAD", directory));
    return log ? parseGitLog(log, topLevel, boundary, ignoreRevs) : new Map();
  }

  const root = findRepositoryRoot(directory, topLevel);
  const commit = resolveCommit(env, topLevel ? local(topLevel, ["rev-parse", "HEAD"]) : undefined);
  const url =
    remote ??
    resolveRemote(env, topLevel ? local(topLevel, ["remote", "get-url", "origin"]) : undefined);

  let error: string;
  if (!root) error = "no repository root (no .git or pnpm-workspace.yaml)";
  else if (!commit)
    error = "no commit to fetch (no local HEAD, VERCEL_GIT_COMMIT_SHA or GITHUB_SHA)";
  else if (!url) {
    error = "no repository to fetch from (no VERCEL_GIT_* or GITHUB_* variables, no https origin)";
  } else {
    const pathspec = path.relative(root, directory).split(path.sep).join("/");
    const fetched = readFetchedLog(url, commit, pathspec, deadline);
    if ("log" in fetched) {
      const dates = parseGitLog(fetched.log, root, undefined, ignoreRevs);
      report?.(`${dates.size} file dates from git history fetched for ${commit.slice(0, 12)}`);
      return dates;
    }
    error = fetched.error;
  }

  if (topLevel && boundary) {
    const log = local(topLevel, gitLogArgs("HEAD", directory));
    const dates = log
      ? parseGitLog(log, topLevel, boundary, ignoreRevs)
      : new Map<string, string>();
    report?.(
      `${dates.size} file dates from a shallow git history (history fetch failed: ${error})`,
    );
    return dates;
  }
  report?.(`no file dates, no git history (history fetch failed: ${error})`);
  return new Map();
}

/**
 * The files besides `page.tsx` that hold each TSX route's copy, relative to
 * `src/`. `/` and `/pricing` keep their copy as literal JSX spread over
 * section components shared with other pages, so they are dated by their
 * Markdown rendition, plus `/pricing`'s own FAQ section. Only the rendition's
 * headings are checked against the page (`lib/markdown/markdown-parity.test.ts`),
 * so a body-text edit that skips the rendition does not move the date. A
 * route that is not listed gets no `<lastmod>`.
 */
export const ROUTE_CONTENT_FILES: Readonly<Record<string, readonly string[]>> = {
  "/": ["lib/markdown/home.ts"],
  "/pricing": ["lib/markdown/pricing.ts", "components/sections/pricing-faq.tsx"],
  "/postgres": ["components/product/content/postgres.ts"],
  "/compute": ["components/product/content/compute.ts"],
  "/orm": ["components/product/content/orm.ts"],
  "/postgres/hipaa": ["app/postgres/hipaa/_content.ts", "app/postgres/hipaa/_sections.tsx"],
  "/stack": ["app/stack/content.ts"],
  "/studio": ["app/studio/studio-content.ts"],
  "/mcp": ["app/mcp/mcp-content.ts"],
  "/enterprise": ["app/enterprise/enterprise-content.ts"],
  "/events": ["app/events/events-data.ts"],
  "/ecosystem": ["data/ecosystem.json"],
  "/brand-kit": ["components/brand-kit/content.ts"],
  "/compare": ["app/compare/comparisons.ts"],
  ...Object.fromEntries(
    ["convex", "kysely", "mongoose", "neon", "planetscale", "supabase", "vercel-neon-drizzle"].map(
      (name) => [
        `/compare/${name}`,
        [`app/compare/${name}/_content.ts`, `app/compare/${name}/_sections.tsx`],
      ],
    ),
  ),
  "/legal/privacy": ["lib/legal/privacy.tsx"],
  "/legal/terms": ["lib/legal/terms.tsx"],
  "/legal/sla": ["lib/legal/sla.tsx"],
  "/legal/baa": ["app/legal/baa/_baa-text.ts"],
  "/legal/dpa": ["app/legal/dpa/_dpa-text.ts"],
  "/support-policy": ["data/support-policy.ts"],
  "/event-code-of-conduct": ["data/event-code-of-conduct.tsx"],
  ...Object.fromEntries(
    [
      "apollo",
      "cockroachdb",
      "express",
      "fastify",
      "graphql",
      "hapi",
      "mongodb",
      "nestjs",
      "nextjs",
      "planetscale",
      "react",
      "typescript",
    ].map((name) => [`/${name}`, [`data/prisma-with/${name}.json`]]),
  ),
};

/**
 * The newest date among a route's page file and its content files, or
 * undefined when the route has no listed content file or none of its files has
 * a known date. A date dropped at a shallow boundary is older than every date
 * that was kept, so the newest kept date is still the right one.
 */
export function getRouteLastModified(
  pathname: string,
  pageFile: string,
  srcDirectory: string,
  fileDates: FileDates,
  contentFiles: Readonly<Record<string, readonly string[]>> = ROUTE_CONTENT_FILES,
): string | undefined {
  if (!Object.hasOwn(contentFiles, pathname)) return undefined;

  let latest: string | undefined;
  for (const file of [
    pageFile,
    ...contentFiles[pathname]!.map((f) => path.join(srcDirectory, f)),
  ]) {
    const date = fileDates.get(file);
    if (date && (!latest || date > latest)) latest = date;
  }
  return latest;
}
