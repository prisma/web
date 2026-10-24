import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * `<lastmod>` for the site's TSX page routes, which have no frontmatter date.
 *
 * A route's date is the last commit that changed its `page.tsx` or any module
 * under `src/` it imports, directly or through other modules: the page's copy
 * mostly lives in `src/components/**` and `src/lib/**`, so the page file alone
 * would miss most edits.
 *
 * Only imports that resolve under `src/` count. Modules from workspace
 * packages (for example `@prisma-docs/ui/data/extensions`, which holds the
 * `/extensions` listing) are not followed, so a change there does not move
 * the date of the routes that import it.
 *
 * When the date is not known, the route gets no `<lastmod>`. In particular a
 * file's modification time is never used: on a fresh checkout it is the build
 * time, which would stamp every route with the deploy date.
 *
 * Git history may be missing (no `.git`, no `git` binary) or shallow. In a
 * shallow clone the oldest commit available stands in for all older history,
 * so a file last changed before it would get that commit's date; those dates
 * are dropped.
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

function git(cwd: string, args: string[]): string | undefined {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return undefined;
  }
}

/** Commits a shallow clone cut its history at, or none for a full clone. */
function getShallowBoundary(cwd: string): Set<string> {
  if (git(cwd, ["rev-parse", "--is-shallow-repository"])?.trim() !== "true") return new Set();

  const shallowFile = git(cwd, ["rev-parse", "--path-format=absolute", "--git-path", "shallow"]);
  if (!shallowFile) return new Set();

  try {
    return new Set(readFileSync(shallowFile.trim(), "utf8").split("\n").filter(Boolean));
  } catch {
    return new Set();
  }
}

/** Last-commit dates for every file under `directory`, or an empty map without git history. */
export function getGitFileDates(directory: string): Map<string, string> {
  const topLevel = git(directory, ["rev-parse", "--show-toplevel"])?.trim();
  if (!topLevel) return new Map();

  const log = git(directory, [
    "log",
    "-z",
    // Committer date: when the change landed on the branch being built.
    "--format=commit:%H %cI",
    "--name-only",
    "--",
    directory,
  ]);
  if (!log) return new Map();

  return parseGitLog(log, topLevel, getShallowBoundary(directory));
}

const RESOLVE_SUFFIXES = ["", ".ts", ".tsx", ".js", ".mjs", ".json", "/index.ts", "/index.tsx"];

const IMPORT_SPECIFIER =
  /(?:import|export)\s[^"'`;]*?\sfrom\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/g;

/** Resolves a `@/` or relative specifier to a file under `srcDirectory`. Packages are skipped. */
function resolveLocalImport(
  specifier: string,
  fromFile: string,
  srcDirectory: string,
): string | undefined {
  let base: string;
  if (specifier.startsWith("@/")) base = path.join(srcDirectory, specifier.slice(2));
  else if (specifier.startsWith("./") || specifier.startsWith("../"))
    base = path.resolve(path.dirname(fromFile), specifier);
  else return undefined;

  for (const suffix of RESOLVE_SUFFIXES) {
    const candidate = base + suffix;
    if (!candidate.startsWith(srcDirectory + path.sep)) continue;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return undefined;
}

/** Local imports of each file, read once: page routes share most of their modules. */
const localImportsCache = new Map<string, string[]>();

function getLocalImports(file: string, srcDirectory: string): string[] {
  const cacheKey = `${srcDirectory}\0${file}`;
  const cached = localImportsCache.get(cacheKey);
  if (cached) return cached;

  let imports: string[] = [];
  try {
    const source = readFileSync(file, "utf8");
    imports = [...source.matchAll(IMPORT_SPECIFIER)]
      .map((match) => match[1] ?? match[2] ?? match[3])
      .filter((specifier): specifier is string => Boolean(specifier))
      .map((specifier) => resolveLocalImport(specifier, file, srcDirectory))
      .filter((resolved): resolved is string => Boolean(resolved));
  } catch {
    // An unreadable file contributes only its own date.
  }

  localImportsCache.set(cacheKey, imports);
  return imports;
}

/** `entryFile` and every module under `srcDirectory` it imports, transitively. */
export function collectLocalModules(entryFile: string, srcDirectory: string): Set<string> {
  const modules = new Set<string>();
  const pending = [entryFile];

  while (pending.length > 0) {
    const file = pending.pop()!;
    if (modules.has(file)) continue;
    modules.add(file);

    for (const imported of getLocalImports(file, srcDirectory)) {
      if (!modules.has(imported)) pending.push(imported);
    }
  }

  return modules;
}

/**
 * The newest date among a page file and its local modules, or undefined when
 * none has a known date. A date dropped at a shallow boundary is older than
 * every date that was kept, so the newest kept date is still the right one.
 */
export function getRouteLastModified(
  pageFile: string,
  srcDirectory: string,
  fileDates: FileDates,
): string | undefined {
  if (fileDates.size === 0) return undefined;

  let latest: string | undefined;
  for (const file of collectLocalModules(pageFile, srcDirectory)) {
    const date = fileDates.get(file);
    if (date && (!latest || date > latest)) latest = date;
  }
  return latest;
}
