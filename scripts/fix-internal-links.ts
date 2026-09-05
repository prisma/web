/**
 * Rewrites internal prisma.io links in MDX content so that every one of them
 * lands on a 200 in a single hop.
 *
 * Fixes, per the September 2026 technical SEO audit:
 *   1.3  links to the apex domain (`https://prisma.io/...`, always a 301 to www)
 *   1.3  links whose target is itself redirected (a chain the crawler pays for)
 *   1.5  links carrying `utm_*` / `via` tracking parameters
 *   2.1  links whose query string sits after the fragment, so neither works
 *
 * Resolution is done against production (https://www.prisma.io) with a real
 * request that follows redirects, because the redirect tables live in five
 * different files across three apps plus Vercel config and only the live site
 * knows the composition. Results are cached on disk so re-runs are cheap. With
 * no network the script falls back to resolving against the repo's own redirect
 * tables (`--offline`, or automatically after the first connection failure).
 *
 * ── Zones ──────────────────────────────────────────────────────────────────
 * A root-relative href does NOT mean the same thing in both content trees,
 * because the two apps are separate Next.js zones:
 *
 *   apps/site/content   no basePath   `/postgres`  -> www.prisma.io/postgres
 *   apps/blog/content   basePath /blog `/my-post`  -> www.prisma.io/blog/my-post
 *
 * So the output form is chosen per zone:
 *
 *   site content, target on the site zone    -> root-relative  `/pricing`
 *   site content, target in /docs or /blog   -> absolute       `https://www.prisma.io/docs/...`
 *   blog content, target in /blog            -> blog-relative  `/my-post`
 *   blog content, anything else              -> absolute       `https://www.prisma.io/...`
 *
 * Cross-zone targets stay absolute on purpose. MDX anchors render through
 * fumadocs' `Link`, which treats a root-relative href as internal and hands it
 * to `next/link`; a client-side navigation into a different zone is not
 * something the router can serve. That also matches the convention already in
 * the content: every cross-zone link in apps/site/content is absolute today,
 * and every intra-blog link in apps/blog/content is blog-relative.
 *
 * ── Chains that end at the homepage ────────────────────────────────────────
 * Nine retired URLs (/accelerate, /optimize, /data-platform/*, /serverless,
 * /day*, /enterprise-event-2021) redirect all the way to `/`. Following those
 * would turn "[Prisma Accelerate](...)" into a link to the homepage: it removes
 * a hop but points ~40 descriptive anchors at a page that answers none of them,
 * and it destroys the record of what each link meant. Those links keep their
 * single (already permanent) redirect and are listed in the report so a human
 * can map them to a real page. Their apex domain and tracking parameters are
 * still fixed. Pass `--allow-root-destination` to follow them anyway.
 *
 * Usage:
 *   pnpm links:fix                 rewrite in place
 *   pnpm links:fix -- --dry-run    report only
 *   pnpm links:fix -- --offline    resolve against the repo's redirect tables
 *   pnpm links:fix -- --report out.json
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SITE_ORIGIN = "https://www.prisma.io";
/** Hosts that are the same site and therefore worth resolving. */
const SAME_SITE_HOSTS = new Set(["prisma.io", "www.prisma.io"]);
/** Path prefixes served by a different Next.js zone than apps/site. */
const CROSS_ZONE_PREFIXES = ["/docs", "/blog"];
/** Query parameters that carry no meaning for the destination page. */
const TRACKING_PARAMS = /^(utm_|via$)/i;
/** Assets: `src` is explicitly out of scope, and these are never page links. */
const ASSET_EXTENSIONS =
  /\.(png|jpe?g|gif|svg|webp|avif|ico|mp4|webm|mov|css|js|mjs|zip|woff2?)$/i;

const CACHE_PATH =
  process.env.LINKS_FIX_CACHE ?? path.join(repoRoot, "node_modules", ".cache", "fix-internal-links.json");

interface Zone {
  /** Content directory, relative to the repo root. */
  dir: string;
  /** The Next.js `basePath` of the app that serves this content. */
  basePath: string;
}

const ZONES: Zone[] = [
  { dir: "apps/blog/content", basePath: "/blog" },
  { dir: "apps/site/content", basePath: "" },
];

// ───────────────────────────────────────────────────────────── URL handling ──

/** True for `#frag`, `mailto:`, `tel:`, `./x`, `../x`, `x` — nothing to do. */
export function isOutOfScopeHref(href: string): boolean {
  if (href.length === 0) return true;
  if (href.startsWith("#")) return true;
  if (href.startsWith("//")) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:/i.test(href)) return true;
  if (!href.startsWith("/") && !/^https?:/i.test(href)) return true;
  return false;
}

/**
 * Turns an href found in `zone` into the absolute production URL it points at,
 * or `null` when it is not a same-site page link.
 */
export function toAbsoluteSameSiteUrl(href: string, basePath: string): URL | null {
  if (isOutOfScopeHref(href)) return null;

  let url: URL;
  if (href.startsWith("/")) {
    if (ASSET_EXTENSIONS.test(href.split(/[?#]/, 1)[0])) return null;
    url = new URL(`${SITE_ORIGIN}${basePath}${href}`);
  } else {
    try {
      url = new URL(href);
    } catch {
      return null;
    }
    if (!SAME_SITE_HOSTS.has(url.hostname.toLowerCase())) return null;
    if (ASSET_EXTENSIONS.test(url.pathname)) return null;
  }

  // The apex 301s to www; normalise before anything else looks at the URL.
  url.protocol = "https:";
  url.hostname = "www.prisma.io";
  url.port = "";
  return url;
}

/** Drops `utm_*`/`via`, sorts nothing, and removes a trailing slash. */
export function stripTracking(url: URL): { url: URL; removed: string[] } {
  const out = new URL(url.toString());
  const removed: string[] = [];

  for (const key of [...out.searchParams.keys()]) {
    if (TRACKING_PARAMS.test(key)) {
      removed.push(key);
      out.searchParams.delete(key);
    }
  }

  if (out.pathname.length > 1 && out.pathname.endsWith("/")) {
    out.pathname = out.pathname.replace(/\/+$/, "");
  }

  return { url: out, removed };
}

/**
 * A fragment written after the query string (`...#frag?utm_source=x`) — the
 * whole tail becomes part of the fragment, so the anchor never matches and the
 * parameters are never sent. Recover the intended fragment and drop the query.
 */
export function repairMisplacedQuery(url: URL): { url: URL; repaired: boolean } {
  if (!url.hash.includes("?")) return { url, repaired: false };

  const out = new URL(url.toString());
  const [fragment, query] = [out.hash.slice(1, out.hash.indexOf("?")), out.hash.slice(out.hash.indexOf("?") + 1)];
  out.hash = fragment ? `#${fragment}` : "";

  // Anything in that stray query that is not tracking is preserved.
  for (const [key, value] of new URLSearchParams(query)) {
    if (!TRACKING_PARAMS.test(key)) out.searchParams.set(key, value);
  }

  return { url: out, repaired: true };
}

/** Renders the final URL in the form this zone should use. */
export function toHrefForZone(finalUrl: URL, basePath: string): string {
  const isSameSite = finalUrl.hostname === "www.prisma.io";
  if (!isSameSite) return finalUrl.toString();

  const pathWithQuery = `${finalUrl.pathname}${finalUrl.search}${finalUrl.hash}`;

  if (basePath) {
    // A basePath zone can only express its own paths root-relatively.
    if (finalUrl.pathname === basePath || finalUrl.pathname.startsWith(`${basePath}/`)) {
      const stripped = finalUrl.pathname.slice(basePath.length) || "/";
      return `${stripped}${finalUrl.search}${finalUrl.hash}`;
    }
    return finalUrl.toString();
  }

  // The host zone: keep cross-zone links absolute (see the header comment).
  if (CROSS_ZONE_PREFIXES.some((p) => finalUrl.pathname === p || finalUrl.pathname.startsWith(`${p}/`))) {
    return finalUrl.toString();
  }

  return pathWithQuery;
}

// ────────────────────────────────────────────────────────────────── resolver ──

interface Resolution {
  finalUrl: string;
  status: number;
  /** Set when the answer came from the repo's redirect tables, not the network. */
  offline?: boolean;
  /** Set when a live 404 was recovered through a redirect this branch adds. */
  viaRepoRedirect?: string;
  /** Why the request failed, for `status: 0`. */
  error?: string;
}

type Cache = Record<string, Resolution>;

async function loadCache(): Promise<Cache> {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(await readFile(CACHE_PATH, "utf8")) as Cache;
  } catch {
    return {};
  }
}

async function saveCache(cache: Cache): Promise<void> {
  await mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFollowing(url: string): Promise<Resolution> {
  for (const method of ["HEAD", "GET"] as const) {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      headers: { "user-agent": "prisma-web-link-hygiene/1.0" },
      signal: AbortSignal.timeout(30_000),
    });
    // Some hosts answer HEAD with 403/405 but serve GET fine.
    if (method === "HEAD" && (response.status === 403 || response.status === 405)) continue;
    return { finalUrl: response.url || url, status: response.status };
  }
  throw new Error("unreachable");
}

/**
 * Resolves one URL, retrying transient failures. A single dropped connection
 * mid-run must not be mistaken for "this sandbox has no network".
 */
async function resolveOnline(url: string, attempts = 6): Promise<Resolution> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fetchFollowing(url);
    } catch (error) {
      lastError = error;
      await sleep(500 * 2 ** attempt);
    }
  }
  throw lastError;
}

// ─────────────────────────────────────────────────── offline redirect tables ──

interface Rule {
  source: string;
  destination: string;
  /** basePath the table's paths are written relative to. */
  prefix: string;
}

/** Compiles a `path-to-regexp`-style Next.js redirect source. */
export function compileSource(source: string): { regex: RegExp; keys: string[] } {
  const keys: string[] = [];
  let pattern = "";

  for (const segment of source.split("/").slice(1)) {
    const match = /^:([A-Za-z0-9_]+)([*+?]?)$/.exec(segment);
    if (!match) {
      pattern += `/${segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`;
      continue;
    }
    const [, name, modifier] = match;
    keys.push(name);
    if (modifier === "*") pattern += `(?:/(.*))?`;
    else if (modifier === "+") pattern += `/(.+)`;
    else if (modifier === "?") pattern += `(?:/([^/]*))?`;
    else pattern += `/([^/]+)`;
  }

  // Next.js matches redirect sources case-insensitively.
  return { regex: new RegExp(`^${pattern || "/"}/?$`, "i"), keys };
}

export function applyRules(pathname: string, rules: Rule[]): string | null {
  for (const rule of rules) {
    const full = `${rule.prefix}${rule.source}`;
    const { regex, keys } = compileSource(full);
    const match = regex.exec(pathname);
    if (!match) continue;

    let destination = `${rule.destination.startsWith("http") ? "" : rule.prefix}${rule.destination}`;
    keys.forEach((key, index) => {
      const value = match[index + 1] ?? "";
      destination = destination.replace(new RegExp(`:${key}[*+?]?`, "g"), value);
    });
    // A `:path*` that matched nothing leaves a trailing slash behind.
    if (destination.length > 1 && destination.endsWith("/")) destination = destination.slice(0, -1);
    if (destination === pathname) continue; // self-redirect; treat as terminal
    return destination;
  }
  return null;
}


/**
 * Reads the `redirects()` table out of a `next.config.mjs` as text.
 *
 * These configs cannot simply be imported: they pull in `fumadocs-mdx` and the
 * Sentry wrapper, which need a Next build context. Only literal
 * `{ source, destination }` pairs are understood, which is what the tables are
 * made of; entries with a `has`/`missing` host condition are skipped because
 * they do not apply to plain www.prisma.io requests.
 */
export function parseNextRedirects(source: string): Array<{ source: string; destination: string }> {
  const from = source.indexOf("async redirects()");
  if (from === -1) return [];
  const to = source.indexOf("async rewrites()", from);
  const block = source.slice(from, to === -1 ? undefined : to);

  const rules: Array<{ source: string; destination: string }> = [];
  // Pair each literal `source:` with the `destination:` that follows it. The
  // tables mix single-line and multi-line entries and contain comments, so
  // brace matching is more fragile than this.
  const sourceRe = /\bsource:\s*"([^"]*)"/g;

  for (let m = sourceRe.exec(block); m; m = sourceRe.exec(block)) {
    const tail = block.slice(m.index + m[0].length);
    const dest = /\bdestination:\s*"([^"]*)"/.exec(tail);
    if (!dest) continue;

    // The whole object literal, so a `basePath: false` written after
    // `destination:` is still seen.
    const before = block.slice(0, m.index);
    const openBrace = before.lastIndexOf("{");
    const closeBrace = tail.indexOf("}");
    const entry = `${before.slice(openBrace + 1)}${closeBrace === -1 ? tail : tail.slice(0, closeBrace)}`;

    // Host-conditional and basePath-free rules do not apply to plain
    // www.prisma.io path requests.
    if (/\b(has|missing|basePath)\s*:/.test(entry)) continue;
    if (!entry.includes(dest[0])) continue; // destination belongs to a later entry
    rules.push({ source: m[1], destination: dest[1] });
  }

  return rules;
}

async function loadOfflineRules(): Promise<Rule[]> {
  const rules: Rule[] = [];

  const vercelFiles: Array<[string, string]> = [
    ["apps/site/vercel.json", ""],
    ["apps/docs/vercel.json", ""], // sources already carry the /docs prefix
  ];
  for (const [file, prefix] of vercelFiles) {
    const full = path.join(repoRoot, file);
    if (!existsSync(full)) continue;
    const json = JSON.parse(await readFile(full, "utf8")) as { redirects?: Array<Record<string, string>> };
    for (const rule of json.redirects ?? []) {
      if (rule.source && rule.destination) {
        rules.push({ source: rule.source, destination: rule.destination, prefix });
      }
    }
  }

  const nextConfigs: Array<[string, string]> = [
    ["apps/site/next.config.mjs", ""],
    ["apps/docs/next.config.mjs", "/docs"],
    ["apps/blog/next.config.mjs", "/blog"],
  ];
  for (const [file, prefix] of nextConfigs) {
    const full = path.join(repoRoot, file);
    if (!existsSync(full)) continue;
    for (const rule of parseNextRedirects(await readFile(full, "utf8"))) {
      rules.push({ ...rule, prefix });
    }
  }

  return rules;
}

function resolveOffline(url: string, rules: Rule[]): Resolution {
  let current = new URL(url);
  const seen = new Set<string>();

  for (let hop = 0; hop < 12; hop++) {
    const key = `${current.pathname}${current.search}`;
    if (seen.has(key)) return { finalUrl: current.toString(), status: 508, offline: true };
    seen.add(key);

    const next = applyRules(current.pathname, rules);
    if (!next) return { finalUrl: current.toString(), status: 200, offline: true };

    const target = next.startsWith("http") ? new URL(next) : new URL(`${current.origin}${next}`);
    for (const [k, v] of current.searchParams) if (!target.searchParams.has(k)) target.searchParams.set(k, v);
    current = target;
  }

  return { finalUrl: current.toString(), status: 508, offline: true };
}

// ───────────────────────────────────────────────────────────────── extraction ──

export interface Occurrence {
  /** The href exactly as written in the file. */
  raw: string;
  start: number;
  end: number;
}

/**
 * Finds every link href in an MDX file: markdown inline links `](...)` and
 * `href="..."` attributes. Markdown *images* (`![alt](...)`) and `src` are
 * deliberately excluded.
 */
/**
 * Byte ranges that are code, and therefore must never be rewritten: fenced
 * blocks and inline spans. Tutorial posts contain JSX samples with hrefs like
 * `/api/auth/login` that belong to the reader's app, not to prisma.io.
 */
export function codeRanges(source: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];

  // Fenced blocks, tracked line by line so an unbalanced fence cannot swallow
  // the rest of the file's links silently.
  let offset = 0;
  let fence: { marker: string; start: number } | null = null;
  for (const line of source.split("\n")) {
    const open = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (open && open[1][0] === fence.marker[0] && open[1].length >= fence.marker.length) {
        ranges.push([fence.start, offset + line.length]);
        fence = null;
      }
    } else if (open) {
      fence = { marker: open[1], start: offset };
    }
    offset += line.length + 1;
  }
  if (fence) ranges.push([fence.start, source.length]);

  // Inline code spans, outside the fenced ranges.
  const inline = /(`+)(?:(?!\1)[\s\S])*?\1/g;
  for (let m = inline.exec(source); m; m = inline.exec(source)) {
    const start = m.index;
    if (ranges.some(([from, to]) => start >= from && start < to)) continue;
    ranges.push([start, start + m[0].length]);
  }

  return ranges.sort((a, b) => a[0] - b[0]);
}

export function findHrefs(source: string): Occurrence[] {
  const found: Occurrence[] = [];

  const markdown = /(!?)\[(?:[^\[\]]|\[[^\]]*\])*\]\(\s*(<[^>]*>|[^()\s]+)\s*(?:"[^"]*"|'[^']*')?\s*\)/g;
  for (let m = markdown.exec(source); m; m = markdown.exec(source)) {
    if (m[1] === "!") continue; // image
    const rawWithBrackets = m[2];
    const raw = rawWithBrackets.startsWith("<") ? rawWithBrackets.slice(1, -1) : rawWithBrackets;
    const offset = m[0].lastIndexOf(rawWithBrackets);
    const start = m.index + offset + (rawWithBrackets.startsWith("<") ? 1 : 0);
    found.push({ raw, start, end: start + raw.length });
  }

  const attribute = /href=("|')([^"']*)\1/g;
  for (let m = attribute.exec(source); m; m = attribute.exec(source)) {
    const start = m.index + `href=`.length + 1;
    found.push({ raw: m[2], start, end: start + m[2].length });
  }

  // Markdown reference definitions: `[label]: /path`
  const reference = /^\[[^\]]+\]:\s*(\S+)$/gm;
  for (let m = reference.exec(source); m; m = reference.exec(source)) {
    const start = m.index + m[0].lastIndexOf(m[1]);
    found.push({ raw: m[1], start, end: start + m[1].length });
  }

  const code = codeRanges(source);
  return found
    .filter(({ start }) => !code.some(([from, to]) => start >= from && start < to))
    .sort((a, b) => a.start - b.start);
}

async function walkMdx(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walkMdx(full)));
    else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────── main ──

interface Unresolved {
  href: string;
  resolvedFrom: string;
  finalUrl: string;
  status: number;
  error?: string;
  files: string[];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  let offline = args.includes("--offline");
  // A chain that ends at the bare homepage is a special case: following it
  // would point an anchor like "Prisma Accelerate" at "/", which loses the
  // record of what the link meant and dilutes the site's anchor text. Those
  // links keep their (permanent, already-live) single redirect and are listed
  // in the report so a human can map them to a real page.
  const allowRootDestination = args.includes("--allow-root-destination");
  const reportIndex = args.indexOf("--report");
  const reportPath = reportIndex === -1 ? null : args[reportIndex + 1];

  const cache = await loadCache();
  let offlineRules: Rule[] | null = null;

  // 1. Collect every candidate, grouped by the absolute URL it resolves to.
  interface Pending {
    file: string;
    zone: Zone;
    occurrence: Occurrence;
    normalised: URL;
    repaired: boolean;
    strippedParams: string[];
  }

  const pending: Pending[] = [];
  const fileSources = new Map<string, string>();

  for (const zone of ZONES) {
    const dir = path.join(repoRoot, zone.dir);
    if (!existsSync(dir)) continue;

    for (const file of await walkMdx(dir)) {
      const source = await readFile(file, "utf8");
      fileSources.set(file, source);

      for (const occurrence of findHrefs(source)) {
        const absolute = toAbsoluteSameSiteUrl(occurrence.raw, zone.basePath);
        if (!absolute) continue;

        const { url: queryFixed, repaired } = repairMisplacedQuery(absolute);
        const { url: normalised, removed } = stripTracking(queryFixed);
        pending.push({ file, zone, occurrence, normalised, repaired, strippedParams: removed });
      }
    }
  }

  // 2. Resolve every distinct target once.
  const targets = [...new Set(pending.map((p) => `${p.normalised.origin}${p.normalised.pathname}${p.normalised.search}`))];
  const uncached = targets.filter((t) => !(t in cache));
  process.stderr.write(`Resolving ${uncached.length} of ${targets.length} distinct URLs (${targets.length - uncached.length} cached)\n`);

  let done = 0;
  let anySuccess = false;

  async function resolveTarget(target: string): Promise<Resolution> {
    if (offline) {
      offlineRules ??= await loadOfflineRules();
      return resolveOffline(target, offlineRules);
    }
    try {
      const resolution = await resolveOnline(target);
      anySuccess = true;
      return resolution;
    } catch (failure) {
      if (!anySuccess) {
        // Nothing has ever succeeded: this sandbox has no outbound network.
        offline = true;
        offlineRules ??= await loadOfflineRules();
        process.stderr.write("\nNo outbound network; falling back to the repo's redirect tables.\n");
        return resolveOffline(target, offlineRules);
      }
      // A single URL failing after other successes is transient, a dead host,
      // or a redirect loop; report it rather than switching the whole run's
      // method. `fetch` with `redirect: "follow"` throws on a loop, which is
      // exactly how audit finding 1.1 shows up here.
      return { finalUrl: target, status: 0, error: String((failure as Error)?.message ?? failure) };
    }
  }

  /**
   * Production has not yet deployed the redirects this branch adds, so a URL
   * this PR is fixing still answers 404 upstream. Re-resolve those through the
   * repo's own redirect tables and re-verify the result against production.
   */
  async function recoverVia404Redirects(target: string, resolution: Resolution): Promise<Resolution> {
    if (resolution.status !== 404 || offline) return resolution;

    offlineRules ??= await loadOfflineRules();
    const local = resolveOffline(target, offlineRules);
    if (local.finalUrl === target) return resolution;

    const verified = await resolveTarget(local.finalUrl);
    if (verified.status !== 200) return resolution;
    return { ...verified, viaRepoRedirect: local.finalUrl };
  }

  const queue = [...uncached];
  const workers = Array.from({ length: 4 }, async () => {
    for (let target = queue.pop(); target; target = queue.pop()) {
      cache[target] = await recoverVia404Redirects(target, await resolveTarget(target));
      done++;
      if (done % 25 === 0) process.stderr.write(`  ${done}/${uncached.length}\n`);
    }
  });
  await Promise.all(workers);
  await saveCache(cache);

  // 3. Decide the replacement for every occurrence.
  const edits = new Map<string, Array<{ start: number; end: number; text: string }>>();
  const unresolved = new Map<string, Unresolved>();
  let utmStripped = 0;
  let misplacedQueries = 0;
  let rewritten = 0;
  const recoveredByNewRedirect = new Set<string>();
  const skippedRootDestination = new Map<string, Unresolved>();

  for (const item of pending) {
    const key = `${item.normalised.origin}${item.normalised.pathname}${item.normalised.search}`;
    const resolution = cache[key];
    if (!resolution) continue;

    const relative = path.relative(repoRoot, item.file);

    if (resolution.status !== 200) {
      const existing = unresolved.get(key);
      if (existing) {
        if (!existing.files.includes(relative)) existing.files.push(relative);
      } else {
        unresolved.set(key, {
          href: item.occurrence.raw,
          resolvedFrom: key,
          finalUrl: resolution.finalUrl,
          status: resolution.status,
          error: resolution.error,
          files: [relative],
        });
      }
      continue;
    }

    const finalUrl = new URL(resolution.finalUrl);
    // The fragment is ours, not the server's: keep what the author wrote.
    finalUrl.hash = item.normalised.hash;
    if (finalUrl.pathname.length > 1 && finalUrl.pathname.endsWith("/")) {
      finalUrl.pathname = finalUrl.pathname.replace(/\/+$/, "");
    }

    const chainEndsAtHomepage =
      finalUrl.hostname === "www.prisma.io" &&
      finalUrl.pathname === "/" &&
      item.normalised.pathname !== "/";

    // The chain is left in place, but the href is still normalised: the apex
    // domain and the tracking parameters are fixed regardless of where the
    // link ends up.
    const target = allowRootDestination || !chainEndsAtHomepage ? finalUrl : item.normalised;

    if (chainEndsAtHomepage && !allowRootDestination) {
      const existing = skippedRootDestination.get(key);
      if (existing) {
        if (!existing.files.includes(relative)) existing.files.push(relative);
      } else {
        skippedRootDestination.set(key, {
          href: item.occurrence.raw,
          resolvedFrom: key,
          finalUrl: resolution.finalUrl,
          status: resolution.status,
          files: [relative],
        });
      }
    }

    const replacement = toHrefForZone(target, item.zone.basePath);
    if (replacement === item.occurrence.raw) continue;

    if (resolution.viaRepoRedirect) recoveredByNewRedirect.add(key);
    if (item.strippedParams.length > 0) utmStripped++;
    if (item.repaired) misplacedQueries++;
    rewritten++;

    const list = edits.get(item.file) ?? [];
    list.push({ start: item.occurrence.start, end: item.occurrence.end, text: replacement });
    edits.set(item.file, list);
  }

  // 4. Apply, back to front so offsets stay valid.
  for (const [file, list] of edits) {
    const source = fileSources.get(file)!;
    let next = source;
    for (const edit of [...list].sort((a, b) => b.start - a.start)) {
      next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
    }
    if (!dryRun) await writeFile(file, next);
  }

  // 5. Report.
  const summary = {
    filesTouched: edits.size,
    linksRewritten: rewritten,
    utmStripped,
    misplacedQueriesRepaired: misplacedQueries,
    distinctUrlsResolved: targets.length,
    recoveredByRedirectAddedInThisBranch: [...recoveredByNewRedirect].sort(),
    resolvedOffline: offline,
    skippedBecauseChainEndsAtHomepage: [...skippedRootDestination.values()].sort((a, b) =>
      a.resolvedFrom.localeCompare(b.resolvedFrom),
    ),
    unresolved: [...unresolved.values()].sort((a, b) => a.resolvedFrom.localeCompare(b.resolvedFrom)),
  };

  console.log(`\n${dryRun ? "[dry run] " : ""}files touched:        ${summary.filesTouched}`);
  console.log(`${dryRun ? "[dry run] " : ""}links rewritten:      ${summary.linksRewritten}`);
  console.log(`${dryRun ? "[dry run] " : ""}utm stripped:         ${summary.utmStripped}`);
  console.log(`${dryRun ? "[dry run] " : ""}misplaced ?query:     ${summary.misplacedQueriesRepaired}`);
  console.log(`${dryRun ? "[dry run] " : ""}distinct URLs:        ${summary.distinctUrlsResolved}`);
  console.log(`${dryRun ? "[dry run] " : ""}healed by new redirect: ${summary.recoveredByRedirectAddedInThisBranch.length}`);
  console.log(`${dryRun ? "[dry run] " : ""}resolved offline:     ${summary.resolvedOffline}`);
  console.log(`${dryRun ? "[dry run] " : ""}skipped, chain ends at /: ${summary.skippedBecauseChainEndsAtHomepage.reduce((n, i) => n + i.files.length, 0)} link(s) across ${summary.skippedBecauseChainEndsAtHomepage.length} URL(s)`);
  for (const item of summary.skippedBecauseChainEndsAtHomepage) {
    console.log(`  ${item.resolvedFrom}  (${item.files.length} file(s))`);
  }
  console.log(`${dryRun ? "[dry run] " : ""}unresolved (non-200): ${summary.unresolved.length}`);
  for (const item of summary.unresolved) {
    console.log(`  ${item.status}${item.error ? ` (${item.error})` : ""}  ${item.resolvedFrom}  (${item.files.length} file(s): ${item.files.slice(0, 3).join(", ")}${item.files.length > 3 ? ", …" : ""})`);
  }

  if (reportPath) {
    await writeFile(path.resolve(reportPath), `${JSON.stringify(summary, null, 2)}\n`);
    console.log(`\nreport written to ${reportPath}`);
  }
}

// Importing this file from a test must not kick off a rewrite.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
