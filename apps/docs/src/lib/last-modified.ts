import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * Last-change dates for docs pages. They feed the sitemap `<lastmod>`, the
 * "Last updated" line and `dateModified` through the `lastModified` export
 * that fumadocs-mdx adds to each page (see `source.config.ts`).
 *
 * A page's date is the committer date of the last commit on the built
 * branch's first-parent history that changed its `.mdx` file, so a change is
 * dated when it landed on that branch. When a date is not known the page gets
 * none: neither a file's modification time nor the build time is ever used.
 *
 * Git history differs by build host:
 * - a full clone (local checkouts): read directly;
 * - a shallow clone (GitHub Actions checks out one commit by default): the
 *   oldest commit available stands in for all older history and would date
 *   every older file to it, so the history of the commit being built is
 *   fetched without file contents (`--filter=blob:none`, about 10 MB for this
 *   repository); if that fails, only dates newer than the shallow boundary
 *   are kept;
 * - no git history at all (the Vercel build has none): the same fetch, for
 *   the commit and repository named by Vercel's system environment variables.
 *
 * `pnpm run last-modified` (part of `build` and `build:composer`) writes the
 * result to `cache/last-modified.json` once per build, before MDX compiles.
 * Without that file (`next dev`, lint scripts), dates come from local history
 * only, with no fetch.
 */

/** Written by `scripts/write-last-modified.ts`, relative to the docs app. */
export const MANIFEST_FILE = path.join("cache", "last-modified.json");

/** Page sources, relative to the docs app. */
export const CONTENT_DIR = "content/docs";

export type HistorySource =
  /** Full local clone. */
  | "local"
  /** History of the built commit fetched from the repository's remote. */
  | "fetched"
  /** Shallow local clone, fetch unavailable: dates older than the boundary are dropped. */
  | "shallow"
  /** No git history: no dates. */
  | "none";

export interface LastModifiedManifest {
  /** Commit the dates were read at, when known. */
  commit?: string;
  history: HistorySource;
  /** ISO 8601 UTC committer dates by page source path relative to the docs app (`content/docs/...`). */
  files: Record<string, string>;
}

/** Environment variables, as `process.env` or a plain object in tests. */
export type Env = Readonly<Record<string, string | undefined>>;

export interface GitOptions {
  timeout?: number;
  /** Merged over `process.env`; an `undefined` value removes that variable. */
  env?: Env;
  /** Called with a one-line reason when the command fails. */
  onError?: (message: string) => void;
}

export type GitRunner = (cwd: string, args: string[], options?: GitOptions) => string | undefined;

/**
 * Variables that point git at another repository. Git sets some of them for
 * hooks, and a command run in a temporary repository must not inherit them.
 */
export const ISOLATED_GIT_ENV: Env = {
  GIT_DIR: undefined,
  GIT_WORK_TREE: undefined,
  GIT_INDEX_FILE: undefined,
  GIT_COMMON_DIR: undefined,
  GIT_OBJECT_DIRECTORY: undefined,
  GIT_ALTERNATE_OBJECT_DIRECTORIES: undefined,
};

/** The first line of git's stderr, or the spawn error (missing git, timeout). */
export function describeGitError(error: unknown): string {
  const { stderr, message } = error as { stderr?: unknown; message?: unknown };
  const line = String(stderr ?? "")
    .split("\n")
    .map((text) => text.trim())
    .find(Boolean);
  // A remote URL may carry credentials; build logs must not.
  return (line ?? String(message ?? error)).replace(/(\w+:\/\/)[^/@\s]+@/g, "$1***@");
}

/** Runs git and returns stdout, or undefined when git is missing or the command fails. */
export const runGit: GitRunner = (cwd, args, options = {}) => {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", options.onError ? "pipe" : "ignore"],
      timeout: options.timeout ?? 60_000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0", ...options.env },
    });
  } catch (error) {
    options.onError?.(describeGitError(error));
    return undefined;
  }
};

const COMMIT_PREFIX = "commit:";
const SHA = /^[0-9a-f]{40}$/;

/** `git log` arguments for {@link parseGitLog}: the revision's first-parent history, newest first. */
export function gitLogArgs(revision: string, pathspec: string): string[] {
  return [
    "log",
    revision,
    // Follow the branch itself; with -m a merge lists what it brought in,
    // dated when it landed rather than when the merged commits were made.
    "--first-parent",
    "-m",
    // A move dates the new path; rename detection would also need file
    // contents, which a history fetched with --filter=blob:none does not have.
    "--no-renames",
    "-z",
    "--format=commit:%H %cI",
    "--name-only",
    "--",
    pathspec,
  ];
}

/**
 * Parses `git log -z --format=commit:%H %cI --name-only` output, newest
 * commit first, into the date of the last commit that touched each path
 * (repository-relative, as git prints them). With `-z` every header and path
 * ends in NUL and paths are not C-quoted; git writes a newline between a
 * header and its first path. Files whose last commit is a shallow-clone
 * boundary get no date, since that commit stands in for all older history.
 */
export function parseGitLog(
  stdout: string,
  boundaryCommits: ReadonlySet<string> = new Set(),
): Map<string, string> {
  const dates = new Map<string, string>();
  const seen = new Set<string>();
  let date: string | undefined;

  for (const record of stdout.split("\0")) {
    const entry = record.startsWith("\n") ? record.slice(1) : record;

    if (entry.startsWith(COMMIT_PREFIX)) {
      const [sha = "", committedAt = ""] = entry.slice(COMMIT_PREFIX.length).trim().split(" ");
      const instant = new Date(committedAt);
      date =
        boundaryCommits.has(sha) || Number.isNaN(instant.getTime())
          ? undefined
          : instant.toISOString();
      continue;
    }

    if (!entry || seen.has(entry)) continue;
    seen.add(entry);
    if (date) dates.set(entry, date);
  }

  return dates;
}

/**
 * The repository URL to fetch history from: Vercel's system environment
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
    if (candidate && SHA.test(candidate)) return candidate;
  }
  return undefined;
}

/** The docs app's path inside the repository, with a trailing slash (`apps/docs/`). */
function findAppPrefix(appDir: string, git: GitRunner): string | undefined {
  const prefix = git(appDir, ["rev-parse", "--show-prefix"]);
  if (prefix !== undefined) return prefix.trim();

  // No git work tree (the Vercel build): the workspace root marks the repository root.
  for (let dir = appDir; ; dir = path.dirname(dir)) {
    if (existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
      const relative = path.relative(dir, appDir).split(path.sep).join("/");
      return relative ? `${relative}/` : "";
    }
    if (path.dirname(dir) === dir) return undefined;
  }
}

/**
 * Commits a shallow clone cut its history at; `undefined` for a full clone and
 * `null` for a shallow one whose boundary cannot be read (no date is trusted).
 */
function getShallowBoundary(cwd: string, git: GitRunner): ReadonlySet<string> | null | undefined {
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
 * Dates for the docs pages from a full history of `commit` fetched from
 * `remote` into a temporary repository, or why that failed.
 */
function readFetchedHistory(
  remote: string,
  commit: string,
  pathspec: string,
  git: GitRunner,
): { dates: Map<string, string> } | { error: string } {
  const dir = mkdtempSync(path.join(tmpdir(), "docs-last-modified-"));
  let reason = "unknown error";
  const onError = (message: string) => {
    reason = message;
  };
  try {
    if (git(dir, ["init", "--quiet", "--bare"], { env: ISOLATED_GIT_ENV, onError }) === undefined) {
      return { error: `git init: ${reason}` };
    }
    const fetched = git(
      dir,
      ["fetch", "--quiet", "--no-tags", "--filter=blob:none", remote, commit],
      { timeout: 180_000, env: ISOLATED_GIT_ENV, onError },
    );
    if (fetched === undefined) return { error: `git fetch: ${reason}` };
    // The log reads commits and trees only; never fetch file contents lazily.
    const log = git(dir, gitLogArgs(commit, pathspec), {
      env: { ...ISOLATED_GIT_ENV, GIT_NO_LAZY_FETCH: "1" },
      onError,
    });
    return log === undefined ? { error: `git log: ${reason}` } : { dates: parseGitLog(log) };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export interface CollectOptions {
  /** Absolute path of the docs app. */
  appDir: string;
  env?: Env;
  /** Fetch the built commit's history when the local one is missing or shallow. */
  fetchHistory?: boolean;
  /** Overrides the remote resolved from the environment (tests). */
  remote?: string;
  git?: GitRunner;
}

export interface CollectedManifest extends LastModifiedManifest {
  /** Why the history fetch failed, when one was needed; for the build log, not the manifest file. */
  fetchError?: string;
}

/** Last-change dates for every page under `content/docs`, from the best history available. */
export function collectLastModified({
  appDir,
  env = process.env,
  fetchHistory = false,
  remote,
  git = runGit,
}: CollectOptions): CollectedManifest {
  const prefix = findAppPrefix(appDir, git);
  if (prefix === undefined) return { history: "none", files: {} };
  const pathspec = `${prefix}${CONTENT_DIR}`;

  const toManifest = (
    history: HistorySource,
    commit: string | undefined,
    dates: Map<string, string>,
  ): LastModifiedManifest => {
    const files: Record<string, string> = {};
    for (const [file, date] of [...dates].sort(([a], [b]) => a.localeCompare(b))) {
      if (!file.startsWith(`${pathspec}/`) || !/\.mdx?$/.test(file)) continue;
      const relative = file.slice(prefix.length);
      // History also names files that were deleted or moved away.
      if (existsSync(path.join(appDir, relative))) files[relative] = date;
    }
    return { ...(commit ? { commit } : {}), history, files };
  };

  const topLevel = git(appDir, ["rev-parse", "--show-toplevel"])?.trim();
  const commit = resolveCommit(env, topLevel ? git(appDir, ["rev-parse", "HEAD"]) : undefined);
  const boundary = topLevel ? getShallowBoundary(topLevel, git) : undefined;

  if (topLevel && boundary === undefined) {
    const log = git(topLevel, gitLogArgs("HEAD", pathspec));
    if (log !== undefined) return toManifest("local", commit, parseGitLog(log));
  }

  let fetchError: string | undefined;
  if (fetchHistory && !commit) {
    fetchError = "no commit to fetch (no local HEAD, VERCEL_GIT_COMMIT_SHA or GITHUB_SHA)";
  } else if (fetchHistory && commit) {
    const origin = topLevel ? git(topLevel, ["remote", "get-url", "origin"]) : undefined;
    const url = remote ?? resolveRemote(env, origin);
    const fetched = url
      ? readFetchedHistory(url, commit, pathspec, git)
      : {
          error:
            "no repository to fetch from (no VERCEL_GIT_* or GITHUB_* variables, no https origin)",
        };
    if ("dates" in fetched) return toManifest("fetched", commit, fetched.dates);
    fetchError = fetched.error;
  }
  const fallback = (manifest: LastModifiedManifest): CollectedManifest =>
    fetchError ? { ...manifest, fetchError } : manifest;

  if (topLevel && boundary) {
    const log = git(topLevel, gitLogArgs("HEAD", pathspec));
    if (log !== undefined) {
      return fallback(toManifest("shallow", commit, parseGitLog(log, boundary)));
    }
  }

  return fallback(toManifest("none", commit, new Map()));
}

/** Reads a manifest written by `scripts/write-last-modified.ts`, or undefined if absent or invalid. */
export function readManifest(file: string): LastModifiedManifest | undefined {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<LastModifiedManifest>;
    if (!parsed || typeof parsed.files !== "object" || parsed.files === null) return undefined;
    return { history: parsed.history ?? "none", commit: parsed.commit, files: parsed.files };
  } catch {
    return undefined;
  }
}

/** The page's date from `manifest`, for an absolute or app-relative source path. */
export function lookupLastModified(
  manifest: LastModifiedManifest,
  appDir: string,
  filePath: string,
): Date | undefined {
  const relative = path.relative(appDir, path.resolve(appDir, filePath)).split(path.sep).join("/");
  const value = manifest.files[relative];
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * The manifest written for this build, or, when there is none or it was
 * written at another commit than the checked-out one (a stale file in a dev
 * checkout), dates from local history without fetching.
 */
export function loadManifest(appDir: string, git: GitRunner = runGit): LastModifiedManifest {
  const manifest = readManifest(path.join(appDir, MANIFEST_FILE));
  const head = git(appDir, ["rev-parse", "HEAD"])?.trim();
  if (manifest && (!head || !manifest.commit || manifest.commit === head)) return manifest;
  return collectLastModified({ appDir, fetchHistory: false, git });
}

let manifestPromise: Promise<LastModifiedManifest> | undefined;

/** fumadocs-mdx `versionControl` function: the page's last-change date, if known. */
export async function docsLastModified(filePath: string): Promise<Date | undefined> {
  const appDir = process.cwd();
  manifestPromise ??= Promise.resolve().then(() => loadManifest(appDir));
  return lookupLastModified(await manifestPromise, appDir, filePath);
}
