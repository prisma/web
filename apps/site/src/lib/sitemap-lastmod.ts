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
 * boundary get no date.
 */
export function parseGitLog(
  stdout: string,
  topLevel: string,
  boundaryCommits: ReadonlySet<string> = new Set(),
): Map<string, string> {
  const dates = new Map<string, string>();
  const seen = new Set<string>();
  let date: string | undefined;

  for (const record of stdout.split("\0")) {
    // git writes a newline between a commit's header and its first path.
    const entry = record.startsWith("\n") ? record.slice(1) : record;

    if (entry.startsWith(COMMIT_PREFIX)) {
      const [sha = "", committedAt = ""] = entry.slice(COMMIT_PREFIX.length).trim().split(" ");
      const instant = new Date(committedAt);
      const day = Number.isNaN(instant.getTime()) ? "" : instant.toISOString().slice(0, 10);
      date = boundaryCommits.has(sha) || !/^\d{4}-\d{2}-\d{2}$/.test(day) ? undefined : day;
      continue;
    }

    if (!entry) continue;
    const file = path.join(topLevel, entry);
    if (seen.has(file)) continue;
    seen.add(file);
    if (date) dates.set(file, date);
  }

  return dates;
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

interface GitOptions {
  timeout?: number;
  /** Merged over `process.env`; an `undefined` value removes that variable. */
  env?: Env;
  /** Called with git's first stderr line (or the spawn error) when the command fails. */
  onError?: (message: string) => void;
}

function git(cwd: string, args: string[], options: GitOptions = {}): string | undefined {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", options.onError ? "pipe" : "ignore"],
      timeout: options.timeout ?? 30_000,
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
function getShallowBoundary(cwd: string): ReadonlySet<string> | null | undefined {
  if (git(cwd, ["rev-parse", "--is-shallow-repository"])?.trim() !== "true") return undefined;

  const shallowFile = git(cwd, ["rev-parse", "--path-format=absolute", "--git-path", "shallow"]);
  try {
    return new Set(
      readFileSync(shallowFile?.trim() ?? "", "utf8")
        .split("\n")
        .filter(Boolean),
    );
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
function readFetchedLog(
  remote: string,
  commit: string,
  pathspec: string,
): { log: string } | { error: string } {
  const dir = mkdtempSync(path.join(tmpdir(), "site-sitemap-lastmod-"));
  let reason = "unknown error";
  const onError = (message: string) => {
    reason = message;
  };
  try {
    if (git(dir, ["init", "--quiet", "--bare"], { env: ISOLATED_GIT_ENV, onError }) === undefined) {
      return { error: `git init: ${reason}` };
    }
    // The sitemap is generated during `next build`; stay well inside its
    // 60-second static generation limit and go without dates instead.
    const fetched = git(
      dir,
      ["fetch", "--quiet", "--no-tags", "--filter=blob:none", remote, commit],
      { timeout: 40_000, env: ISOLATED_GIT_ENV, onError },
    );
    if (fetched === undefined) return { error: `git fetch: ${reason}` };
    // The log reads commits and trees only; never fetch file contents lazily.
    const log = git(dir, gitLogArgs(commit, pathspec), {
      env: { ...ISOLATED_GIT_ENV, GIT_NO_LAZY_FETCH: "1" },
      onError,
    });
    return log === undefined ? { error: `git log: ${reason}` } : { log };
  } finally {
    rmSync(dir, { recursive: true, force: true });
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
}

/** Last-commit dates for every file under `directory`, or an empty map without git history. */
export function getGitFileDates(
  directory: string,
  { fetchHistory = false, env = process.env, remote, report }: GitFileDatesOptions = {},
): Map<string, string> {
  const topLevel = git(directory, ["rev-parse", "--show-toplevel"])?.trim() || undefined;
  const boundary = topLevel ? getShallowBoundary(topLevel) : undefined;

  if (topLevel && boundary === undefined) {
    const log = git(topLevel, gitLogArgs("HEAD", directory));
    return log ? parseGitLog(log, topLevel) : new Map();
  }
  if (!fetchHistory) {
    if (!topLevel || !boundary) return new Map();
    const log = git(topLevel, gitLogArgs("HEAD", directory));
    return log ? parseGitLog(log, topLevel, boundary) : new Map();
  }

  const root = findRepositoryRoot(directory, topLevel);
  const commit = resolveCommit(env, topLevel ? git(topLevel, ["rev-parse", "HEAD"]) : undefined);
  const url =
    remote ??
    resolveRemote(env, topLevel ? git(topLevel, ["remote", "get-url", "origin"]) : undefined);

  let error: string;
  if (!root) error = "no repository root (no .git or pnpm-workspace.yaml)";
  else if (!commit)
    error = "no commit to fetch (no local HEAD, VERCEL_GIT_COMMIT_SHA or GITHUB_SHA)";
  else if (!url) {
    error = "no repository to fetch from (no VERCEL_GIT_* or GITHUB_* variables, no https origin)";
  } else {
    const pathspec = path.relative(root, directory).split(path.sep).join("/");
    const fetched = readFetchedLog(url, commit, pathspec);
    if ("log" in fetched) {
      const dates = parseGitLog(fetched.log, root);
      report?.(`${dates.size} file dates from git history fetched for ${commit.slice(0, 12)}`);
      return dates;
    }
    error = fetched.error;
  }

  if (topLevel && boundary) {
    const log = git(topLevel, gitLogArgs("HEAD", directory));
    const dates = log ? parseGitLog(log, topLevel, boundary) : new Map<string, string>();
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
 * `src/`. For `/` and `/pricing`, whose copy is literal JSX spread over shared
 * section components, it is the Markdown rendition, which is kept in step with
 * the page (see `lib/markdown/markdown-parity.test.ts`). A route that is not
 * listed gets no `<lastmod>`.
 */
export const ROUTE_CONTENT_FILES: Readonly<Record<string, readonly string[]>> = {
  "/": ["lib/markdown/home.ts"],
  "/pricing": ["lib/markdown/pricing.ts"],
  "/postgres": ["components/product/content/postgres.ts"],
  "/compute": ["components/product/content/compute.ts"],
  "/orm": ["components/product/content/orm.ts"],
  "/postgres/hipaa": ["app/postgres/hipaa/_content.ts"],
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
      (name) => [`/compare/${name}`, [`app/compare/${name}/_content.ts`]],
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
