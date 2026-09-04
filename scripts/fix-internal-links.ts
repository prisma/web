/**
 * Rewrites internal links in blog and changelog content so they point at the
 * URL that actually answers, with no redirect hop and no tracking parameters.
 *
 * What it touches
 *   apps/blog/content/**\/*.mdx and apps/site/content/**\/*.mdx — markdown
 *   links `](...)` and `href="..."` attributes, in frontmatter and body.
 *   `src` is out of scope: those are assets, not navigation.
 *
 * What it leaves alone
 *   Anything inside a fenced code block or an inline code span. Blog posts are
 *   full of JSX and shell samples containing `href="/api/auth/login"` and the
 *   like; rewriting those would corrupt the example.
 *
 *   apps/docs/content is deliberately not walked. Docs pages use root-relative
 *   `/orm/...` paths that the docs app prefixes with `/docs` at render time,
 *   so they are already correct and would be mangled by a site-wide resolver.
 *
 * How a target is chosen
 *   Each candidate is normalised to https://www.prisma.io + path, stripped of
 *   `utm_*` and `via` parameters, then resolved against production following
 *   redirects. A link is rewritten only when the final URL differs AND returns
 *   200. A 404 or a redirect loop is reported, never rewritten — those need a
 *   human to pick a destination.
 *
 * Usage
 *   pnpm links:fix              # rewrite in place
 *   pnpm links:fix -- --dry-run # report only
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
/**
 * Each content root plus the URL a root-relative href in it actually resolves
 * to. apps/blog runs with `basePath: "/blog"`, and MDX anchors render through
 * next/link, so `](/foo)` in a blog post is served as /blog/foo — not /foo.
 * Treating those as site-root paths would resolve every one of them against
 * the wrong page. apps/site is the www zone and has no basePath.
 */
const CONTENT_ROOTS = [
  { dir: path.join(ROOT, "apps/blog/content"), base: "/blog" },
  { dir: path.join(ROOT, "apps/site/content"), base: "" },
];
const CACHE_DIR = path.join(ROOT, "node_modules/.cache/fix-internal-links");
const CACHE_FILE = path.join(CACHE_DIR, "resolved.json");

const SITE = "https://www.prisma.io";
const DRY_RUN = process.argv.includes("--dry-run");
const CONCURRENCY = 8;

/** Query parameters that carry no meaning for the destination page. */
const TRACKING_PARAMS = (name: string) => name.startsWith("utm_") || name === "via";

interface Resolution {
  /** Final URL after following redirects, or null when the request failed. */
  finalUrl: string | null;
  status: number;
  /** Set when the chain never terminated. */
  looped?: boolean;
}

// ---------------------------------------------------------------------------
// Masking: never rewrite inside code
// ---------------------------------------------------------------------------

/**
 * Replaces `[start, end)` with spaces, keeping newlines and — crucially — the
 * exact length. `[^\n]` without the `u` flag matches single UTF-16 code units,
 * so a surrogate pair becomes two spaces and every later offset still lines up.
 * (Splitting with `[...text]` would iterate code points instead and silently
 * shift every index after the first emoji.)
 */
function blankRange(text: string, start: number, end: number): string {
  return text.slice(0, start) + text.slice(start, end).replace(/[^\n]/g, " ") + text.slice(end);
}

/**
 * Returns a copy of `text` with every code region replaced by spaces, so index
 * positions still line up with the original but no match can start inside one.
 *
 * Blog posts are full of JSX and shell samples containing things like
 * `href="/api/auth/login"`; rewriting those would corrupt the example.
 */
function maskCode(text: string): string {
  let masked = text;

  // Fenced blocks: ``` or ~~~, optionally longer, optionally indented.
  const fence = /^[ \t]*(`{3,}|~{3,}).*$/gm;
  let open: { index: number; marker: string } | null = null;
  const ranges: [number, number][] = [];
  for (const match of text.matchAll(fence)) {
    const marker = match[1];
    if (open === null) {
      open = { index: match.index, marker: marker[0].repeat(3) };
    } else if (marker.startsWith(open.marker)) {
      ranges.push([open.index, match.index + match[0].length]);
      open = null;
    }
  }
  // An unterminated fence masks to end of file.
  if (open !== null) ranges.push([open.index, text.length]);
  for (const [from, to] of ranges) masked = blankRange(masked, from, to);

  // Inline code spans, on what is left. Bounded to a single line: an unbalanced
  // backtick must not swallow the rest of the document.
  const inline = /(?<!`)(`+)(?!`)[^\n]*?(?<!`)\1(?!`)/g;
  const spans: [number, number][] = [];
  for (const match of masked.matchAll(inline)) {
    spans.push([match.index, match.index + match[0].length]);
  }
  for (const [from, to] of spans) masked = blankRange(masked, from, to);

  return masked;
}

// ---------------------------------------------------------------------------
// Candidate extraction
// ---------------------------------------------------------------------------

interface Candidate {
  /** The raw href exactly as it appears in the file. */
  raw: string;
  /** Offset of `raw` within the file. */
  start: number;
}

// The leading `(?<!!)` keeps image syntax — `![alt](src)` — out: `src` is an
// asset reference, not navigation, and is explicitly out of scope.
const MARKDOWN_LINK = /(?<!!)\]\(\s*(<[^>]*>|[^()\s]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;
const HREF_ATTR = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

function findCandidates(text: string): Candidate[] {
  const masked = maskCode(text);
  const found: Candidate[] = [];

  for (const match of masked.matchAll(MARKDOWN_LINK)) {
    let target = match[1];
    // Offset of the target inside the whole match.
    let offset = match[0].indexOf(target);
    if (target.startsWith("<") && target.endsWith(">")) {
      offset += 1;
      target = target.slice(1, -1);
    }
    found.push({ raw: text.slice(match.index + offset, match.index + offset + target.length), start: match.index + offset });
  }

  for (const match of masked.matchAll(HREF_ATTR)) {
    const value = match[1] ?? match[2] ?? "";
    if (value === "") continue;
    const offset = match[0].lastIndexOf(value);
    found.push({ raw: text.slice(match.index + offset, match.index + offset + value.length), start: match.index + offset });
  }

  return found;
}

/**
 * Decides whether a raw href is an internal link this tool owns, and if so
 * returns it split into the parts we care about.
 */
function classify(
  raw: string,
  /** URL prefix a root-relative href in this file resolves against. */
  base: string,
): { pathname: string; search: string; hash: string; wasRelative: boolean } | null {
  const value = raw.trim();
  if (value === "") return null;
  if (value.startsWith("#")) return null; // same-page anchor
  if (/^(mailto:|tel:|data:|javascript:)/i.test(value)) return null;
  if (value.includes("%PUBLIC_URL%") || value.includes("{") || value.includes("$")) return null;
  // The Data Guide is served from a separate repository whose redirect map is
  // not visible here, so its chains cannot be resolved correctly from this one.
  if (/^\/dataguide(\/|$)/.test(value) || /^https?:\/\/(www\.)?prisma\.io\/dataguide(\/|$)/i.test(value)) {
    return null;
  }

  let url: URL;
  let wasRelative = false;
  if (value.startsWith("//")) {
    return null; // protocol-relative; not ours to interpret
  } else if (value.startsWith("/")) {
    // Resolved through the app's basePath, not the bare site root.
    url = new URL(base + value, SITE);
    wasRelative = true;
  } else if (/^https?:\/\//i.test(value)) {
    try {
      url = new URL(value);
    } catch {
      return null;
    }
    if (!/^(www\.)?prisma\.io$/i.test(url.hostname)) return null;
  } else {
    return null; // relative path, or another scheme
  }

  return { pathname: url.pathname, search: url.search, hash: url.hash, wasRelative };
}

/** Normalised absolute URL with tracking parameters removed. */
function canonicalise(parts: { pathname: string; search: string }): string {
  const url = new URL(parts.pathname + parts.search, SITE);
  for (const name of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS(name)) url.searchParams.delete(name);
  }
  return url.toString();
}

// ---------------------------------------------------------------------------
// The repository's own redirect tables
// ---------------------------------------------------------------------------

/**
 * Redirects added on a branch are not live yet, so resolving purely against
 * production would report their sources as 404 and refuse to rewrite them.
 * Applying the repository's tables first models what production will do once
 * the branch ships — and doubles as the offline fallback when the sandbox has
 * no outbound network.
 */
interface RepoRedirect {
  source: string;
  destination: string;
  hasConditions: boolean;
}

/**
 * Each zone's app directory and the path prefix it owns on www.prisma.io.
 *
 * Scoping matters: the docs and blog apps each carry a `basePath: false`
 * redirect sending their *origin host* root (docs.prisma.io/, blog.prisma.io/)
 * to /docs and /blog. On www.prisma.io, `/` is the homepage and those rules do
 * not apply — merging them unscoped would rewrite every link to the homepage
 * into a link to /docs.
 */
const ZONES: { name: string; dir: string; prefix: string }[] = [
  { name: "site", dir: path.join(ROOT, "apps/site"), prefix: "" },
  { name: "docs", dir: path.join(ROOT, "apps/docs"), prefix: "/docs" },
  { name: "blog", dir: path.join(ROOT, "apps/blog"), prefix: "/blog" },
];

async function loadRepoRedirects(): Promise<RepoRedirect[]> {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const run = promisify(execFile);

  const all: RepoRedirect[] = [];
  for (const zone of ZONES) {
    try {
      const { stdout } = await run(
        process.execPath,
        [path.join(ROOT, "scripts/load-redirects.mjs"), zone.name],
        { cwd: zone.dir, maxBuffer: 64 * 1024 * 1024 },
      );
      for (const entry of JSON.parse(stdout) as RepoRedirect[]) {
        // `has`/`missing` entries are gated on host, header or cookie, so they
        // do not apply to a plain request for that path.
        if (entry.hasConditions) continue;
        if (typeof entry.source !== "string" || typeof entry.destination !== "string") continue;
        // A zone only governs paths under the prefix it serves on www.
        if (zone.prefix !== "" && !entry.source.startsWith(zone.prefix)) continue;
        all.push(entry);
      }
    } catch (error) {
      console.warn(`  (could not load ${zone.name} redirects: ${(error as Error).message.split("\n")[0]})`);
    }
  }
  return all;
}

/** Compiles a Next.js/Vercel source pattern into a matcher with named params. */
function compileSource(source: string): { regex: RegExp; params: string[] } {
  const params: string[] = [];
  const body = source
    .split("/")
    .map((segment) => {
      const wildcard = /^:([A-Za-z0-9_]+)([*+])?$/.exec(segment);
      if (wildcard) {
        params.push(wildcard[1]);
        if (wildcard[2] === "*") return "(.*)";
        if (wildcard[2] === "+") return "(.+)";
        return "([^/]+)";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  // `/a/:path*` must also match a bare `/a`.
  const withOptionalTail = body.replace(/\/\(\.\*\)$/, "(?:/(.*))?");
  return { regex: new RegExp(`^${withOptionalTail}$`), params };
}

const compiled = new WeakMap<RepoRedirect, { regex: RegExp; params: string[] }>();

/** Applies repo redirects repeatedly; returns the path they settle on. */
function applyRepoRedirects(pathname: string, table: RepoRedirect[]): string {
  let current = pathname;
  const seen = new Set<string>();

  for (let hop = 0; hop < 10; hop += 1) {
    if (seen.has(current)) return current; // loop inside the repo tables
    seen.add(current);

    let moved = false;
    for (const entry of table) {
      let matcher = compiled.get(entry);
      if (!matcher) {
        matcher = compileSource(entry.source);
        compiled.set(entry, matcher);
      }
      const match = matcher.regex.exec(current);
      if (!match) continue;

      let destination = entry.destination;
      matcher.params.forEach((name, index) => {
        const value = match[index + 1] ?? "";
        destination = destination.split(`:${name}*`).join(value);
        destination = destination.split(`:${name}+`).join(value);
        destination = destination.split(`:${name}`).join(value);
      });
      if (!destination.startsWith("/")) return destination; // left the site
      if (destination === current) return current;
      current = destination;
      moved = true;
      break; // first match wins, same as the platform
    }
    if (!moved) return current;
  }
  return current;
}

// ---------------------------------------------------------------------------
// Resolution against production
// ---------------------------------------------------------------------------

async function loadCache(): Promise<Record<string, Resolution>> {
  if (!existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(await readFile(CACHE_FILE, "utf8")) as Record<string, Resolution>;
  } catch {
    return {};
  }
}

async function saveCache(cache: Record<string, Resolution>): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`);
}

/**
 * Follows the redirect chain by hand rather than with `redirect: "follow"`, so
 * a loop is reported as a loop instead of surfacing as a generic fetch error.
 */
async function resolve(url: string): Promise<Resolution> {
  const seen = new Set<string>();
  let current = url;

  for (let hop = 0; hop < 12; hop += 1) {
    if (seen.has(current)) return { finalUrl: current, status: 0, looped: true };
    seen.add(current);

    let response: Response;
    try {
      response = await fetch(current, { method: "GET", redirect: "manual" });
    } catch (error) {
      return { finalUrl: null, status: -1 };
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { finalUrl: current, status: response.status };
      current = new URL(location, current).toString();
      continue;
    }
    return { finalUrl: current, status: response.status };
  }
  return { finalUrl: current, status: 0, looped: true };
}

async function resolveAll(urls: string[], cache: Record<string, Resolution>): Promise<void> {
  const pending = urls.filter((url) => !(url in cache));
  if (pending.length === 0) return;

  console.log(`Resolving ${pending.length} URL(s) against ${SITE} ...`);
  let done = 0;
  const queue = [...pending];

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (;;) {
        const url = queue.shift();
        if (url === undefined) return;
        cache[url] = await resolve(url);
        done += 1;
        if (done % 25 === 0) console.log(`  ${done}/${pending.length}`);
      }
    }),
  );
  await saveCache(cache);
}

// ---------------------------------------------------------------------------
// Rewriting
// ---------------------------------------------------------------------------

/**
 * Renders the resolved target back into the form this file can actually use.
 *
 * The href keeps the shape it was written in. A root-relative href is only
 * safe when the target still sits under the app's basePath — the app re-adds
 * that prefix, so the stored path must have it stripped. A root-relative href
 * that now points outside the basePath has to become absolute, otherwise the
 * app would prepend the prefix again and produce /blog/docs/...
 */
function toWrittenForm(
  finalUrl: string,
  hash: string,
  wasRelative: boolean,
  base: string,
): string {
  const url = new URL(finalUrl);
  const absolute = `${url.origin}${url.pathname}${url.search}${hash}`;
  if (!/^(www\.)?prisma\.io$/i.test(url.hostname)) return absolute;

  const sitePath = `${url.pathname}${url.search}${hash}`;
  // The bare origin reads better without a trailing slash, and keeping it out
  // means `https://www.prisma.io` is not churned into `https://www.prisma.io/`.
  if (!wasRelative) return sitePath === "/" ? SITE : `${SITE}${sitePath}`;

  if (base === "") return sitePath;
  if (url.pathname === base) return "/";
  if (url.pathname.startsWith(`${base}/`)) return sitePath.slice(base.length);
  return `${SITE}${sitePath}`;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile() && entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

interface Unresolved {
  url: string;
  status: number;
  looped: boolean;
  files: Set<string>;
}

async function main(): Promise<void> {
  const files: { file: string; base: string }[] = [];
  for (const root of CONTENT_ROOTS) {
    if (!existsSync(root.dir)) continue;
    for (const file of await walk(root.dir)) files.push({ file, base: root.base });
  }
  files.sort((a, b) => a.file.localeCompare(b.file));
  console.log(`Scanning ${files.length} MDX file(s)`);

  // Pass 1: collect every distinct canonical URL.
  const perFile = new Map<string, { text: string; base: string; candidates: Candidate[] }>();
  const wanted = new Set<string>();

  for (const { file, base } of files) {
    const text = await readFile(file, "utf8");
    const candidates = findCandidates(text).filter((c) => classify(c.raw, base) !== null);
    if (candidates.length === 0) continue;
    perFile.set(file, { text, base, candidates });
    for (const candidate of candidates) {
      wanted.add(canonicalise(classify(candidate.raw, base)!));
    }
  }

  console.log("Loading the repository's redirect tables ...");
  const repoTable = await loadRepoRedirects();
  console.log(`  ${repoTable.length} unconditional redirect(s)`);

  // Pre-apply the repo tables so redirects added on this branch — which
  // production has not deployed yet — are honoured rather than reported as 404.
  const preResolved = new Map<string, string>();
  for (const url of wanted) {
    const parsed = new URL(url);
    const settled = applyRepoRedirects(parsed.pathname, repoTable);
    preResolved.set(url, settled.startsWith("/") ? `${SITE}${settled}${parsed.search}` : settled);
  }

  const cache = await loadCache();
  await resolveAll([...new Set(preResolved.values())], cache);

  // Pass 2: rewrite.
  let filesTouched = 0;
  let linksRewritten = 0;
  let utmStripped = 0;
  const unresolved = new Map<string, Unresolved>();

  for (const [file, { text, base, candidates }] of perFile) {
    // Apply right-to-left so earlier offsets stay valid.
    const ordered = [...candidates].sort((a, b) => b.start - a.start);
    let next = text;
    let fileChanged = false;

    for (const candidate of ordered) {
      const parts = classify(candidate.raw, base)!;
      const canonical = canonicalise(parts);
      const hadTracking = new URL(parts.pathname + parts.search, SITE).search !== new URL(canonical).search;
      const probed = preResolved.get(canonical) ?? canonical;
      const resolution = cache[probed];
      if (!resolution) continue;

      if (resolution.looped || resolution.status !== 200 || resolution.finalUrl === null) {
        const key = canonical === probed ? canonical : `${canonical} → ${probed}`;
        const existing = unresolved.get(key) ?? {
          url: key,
          status: resolution.status,
          looped: Boolean(resolution.looped),
          files: new Set<string>(),
        };
        existing.files.add(path.relative(ROOT, file));
        unresolved.set(key, existing);
        continue;
      }

      const replacement = toWrittenForm(resolution.finalUrl, parts.hash, parts.wasRelative, base);
      if (replacement === candidate.raw) continue;

      next = next.slice(0, candidate.start) + replacement + next.slice(candidate.start + candidate.raw.length);
      linksRewritten += 1;
      if (hadTracking) utmStripped += 1;
      fileChanged = true;
    }

    if (fileChanged) {
      filesTouched += 1;
      if (!DRY_RUN) await writeFile(file, next);
    }
  }

  console.log("");
  console.log(DRY_RUN ? "— dry run, nothing written —" : "— rewritten in place —");
  console.log(`files touched:    ${filesTouched}`);
  console.log(`links rewritten:  ${linksRewritten}`);
  console.log(`utm stripped:     ${utmStripped}`);
  console.log(`unresolved:       ${unresolved.size}`);

  if (unresolved.size > 0) {
    console.log("");
    console.log("Unresolved (left untouched — a human must pick a destination):");
    console.log("");
    console.log("| URL | status | files |");
    console.log("| --- | --- | --- |");
    for (const entry of [...unresolved.values()].sort((a, b) => a.url.localeCompare(b.url))) {
      const status = entry.looped ? "loop" : String(entry.status);
      console.log(`| ${entry.url} | ${status} | ${[...entry.files].sort().join("<br>")} |`);
    }
    process.exitCode = 1;
  }
}

await main();
