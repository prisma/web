/**
 * ora Agent Front — Next.js middleware.
 *
 * One file that connects your site to ora:
 *   - it REPORTS your traffic to ora, in the background after each response,
 *     so the Agent traffic page shows which AI agents read your site;
 *   - once you switch Autopilot on in the ora Portal, it also SERVES your
 *     agent-facing files from ora on your own domain (robots.txt, llms.txt,
 *     agents.md, markdown versions of your pages) and enforces your crawler
 *     rules. Until then it only reports, and your site behaves exactly as before.
 *
 * WHERE IT GOES — at the root of your app, next to `app/` (or inside `src/` if
 * you use one):
 *   Next 13 to 15  →  middleware.ts
 *   Next 16        →  proxy.ts
 * It has a default export, so the same file works under either name.
 *
 * ALREADY HAVE A middleware.ts / proxy.ts? Next runs only one, so keep yours:
 * save this file as `agent-front.ts` and call `handleAgentFront` first from
 * yours — the example is above that function, near the end of this file.
 *
 * ENVIRONMENT VARIABLES — set them, then redeploy:
 *   ORA_INGEST_KEY  your ora API key, with the scopes `agent-front:write`
 *                   (to report) and `agent-front:serve` (for Autopilot).
 *   ORA_DOMAIN_ID   your domain's id, from the ora connect page. Without it the
 *                   file only reports.
 *   ORA_SALT        any long random string. Visitors are reported as a daily
 *                   pseudonym made with it, so no IP address leaves your app.
 *
 * CHECK IT — open /__ora/status on your site: you want `reporting: true`, and
 * `autopilot: true` once ORA_DOMAIN_ID is set.
 *
 * SAFE BY DESIGN — every call to ora has a timeout, and anything unexpected
 * falls back to your app: if ora is slow, down or misconfigured, your pages are
 * served exactly as if this file were not there.
 */
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

/** Identifies this file's version to ora. Leave it as it is. */
const TRANSMITTER = "nextjs-middleware/3.3.0";

// Configuration, read from the environment (see the top of this file).
// ORA_KEY, ORA_EDGE and ORA_INGEST are accepted as older names. ORA_POLICY_URL
// and ORA_INGEST_URL point the file at a different ora endpoint, for testing.
const trimSlash = (u: string) => u.replace(/\/+$/, "");
const KEY = process.env.ORA_INGEST_KEY ?? process.env.ORA_KEY ?? "";
const DOMAIN_ID = process.env.ORA_DOMAIN_ID ?? "";
const SALT = process.env.ORA_SALT ?? "";
const POLICY_URL =
  process.env.ORA_POLICY_URL ??
  `${trimSlash(process.env.ORA_EDGE ?? "https://front.agentfront.sh")}/v1/policy`;
const INGEST_URL =
  process.env.ORA_INGEST_URL ??
  `${trimSlash(process.env.ORA_INGEST ?? "https://ingest.agentfront.sh")}/v1/events`;

/** Reporting needs the key; serving (Autopilot) needs the key and the domain id. */
const REPORTING_ON = Boolean(KEY);
const AUTOPILOT_ON = Boolean(KEY && DOMAIN_ID);

/** The settings format this file understands. Anything newer is ignored safely. */
const SCHEMA_VERSION = 1;

/**
 * How long a call to ora may take before it is abandoned and your app answers
 * instead. Serving allows the longest: the first request for a page's markdown
 * version can take ora a few seconds to prepare.
 */
const POLICY_TIMEOUT_MS = 4_000;
const SERVE_TIMEOUT_MS = 10_000;
const INGEST_TIMEOUT_MS = 5_000;

function deadline(ms: number): AbortSignal {
  if (typeof AbortSignal.timeout === "function") return AbortSignal.timeout(ms);
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/**
 * OPTIONAL — which of your pages exist.
 *
 * Middleware runs before your page does, so it cannot see whether the page
 * answered 200 or 404. By default every page view is reported as a 200, which
 * means a visit to a page that does not exist is counted as found. To report
 * those honestly, return 200 only for the pages you know exist (your sitemap is
 * usually the list) and null for anything else, which is then not reported:
 *
 *   const KNOWN_PAGES = new Set(["/", "/pricing", "/docs"]);
 *   const pageStatus = (pathname: string): number | null => (KNOWN_PAGES.has(pathname) ? 200 : null);
 *
 * Responses ora serves itself are always reported with their real status.
 */
const pageStatus = (_pathname: string): number | null => 200;

// ═══════════════════════════════════════════════════════════════════════════
// AUTOPILOT SETTINGS — fetched from ora, cached for a short while
// ═══════════════════════════════════════════════════════════════════════════

type Detection = {
  agentUa: string[];
  traditionalBots: string[];
  /** Full-string matches (ORA-475) — absent from older policies. */
  agentUaExact?: string[];
  traditionalBotsExact?: string[];
  signatureAgentDomains: string[];
  botLikePattern: string;
};
type Twins = {
  enabled: boolean;
  suffix: string;
  negotiate: boolean;
  /** The query parameters you declared in the Portal as questions. */
  questionParams?: string[];
  includePaths: string[];
  excludePaths: string[];
};
type Artifact = { path: string; kind: string; action: string; version: string; contentType: string };
type Route = {
  id: string;
  match: { kind: string; path: string };
  action: string;
  cache: string;
  version: string;
};
type Policy = {
  schemaVersion: number;
  siteId: string;
  host: string;
  mode: "off" | "monitor" | "autopilot";
  ttlSeconds: number;
  serveBaseUrl: string;
  artifacts: Artifact[];
  twins: Twins;
  /** v2.1 route rules — absent from older policies. */
  routes?: Route[];
  blockedAgentUa: string[];
  detection: Detection;
  generatedAt: string;
};

let policy: Policy | null = null;
let fetchedAt = 0;
let refreshing = false;
let backoffUntil = 0;
let consecutiveFailures = 0;
let lastError: string | null = null;

/** Settings this many times past their lifetime are refreshed before use. */
const MAX_STALE_MULTIPLE = 10;

/**
 * Paths ora may manage. On a server instance that has no settings yet, requests
 * for these wait for the settings rather than falling through to your app.
 */
function mightBeArtifact(pathname: string): boolean {
  return (
    pathname === "/robots.txt" ||
    pathname === "/llms.txt" ||
    pathname === "/agents.md" ||
    pathname === "/openapi.json" ||
    pathname.startsWith("/.well-known/") ||
    pathname.endsWith(".md")
  );
}

async function refreshPolicy(): Promise<void> {
  if (refreshing || Date.now() < backoffUntil) return;
  refreshing = true;
  try {
    const res = await fetch(`${POLICY_URL}?domainId=${encodeURIComponent(DOMAIN_ID)}`, {
      // The self-report the ingest batch also carries — the policy fetch is
      // where ora records it, so the Portal can show what runs here.
      headers: { authorization: `Bearer ${KEY}`, "x-ora-transmitter": TRANSMITTER },
      cache: "no-store",
      signal: deadline(POLICY_TIMEOUT_MS)
    });

    // A key without the `agent-front:serve` scope: wait five minutes before
    // asking again, and say so in the logs and in /__ora/status.
    if (res.status === 401 || res.status === 403) {
      lastError = `policy ${res.status}: key needs the agent-front:serve scope`;
      console.warn(`[ora] ${lastError}`);
      backoffUntil = Date.now() + 300_000;
      return;
    }
    if (!res.ok) throw new Error(`policy ${res.status}`);

    const next = (await res.json()) as Policy;
    // Settings in a newer format than this file understands are ignored.
    policy = next.schemaVersion === SCHEMA_VERSION ? next : null;
    fetchedAt = Date.now();
    consecutiveFailures = 0;
    lastError = policy ? null : `unsupported schemaVersion ${next?.schemaVersion}`;
  } catch (err) {
    consecutiveFailures += 1;
    backoffUntil = Date.now() + (consecutiveFailures >= 3 ? 60_000 : 15_000);
    lastError =
      err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")
        ? `policy timed out after ${POLICY_TIMEOUT_MS}ms`
        : err instanceof Error
          ? err.message
          : "fetch failed";
  } finally {
    refreshing = false;
  }
}

/**
 * The cached settings, refreshed in the background once they expire. Page
 * requests never wait for a refresh; requests for a path ora may manage do, so
 * that `/llms.txt` is answered correctly even on a freshly started instance.
 */
async function getPolicy(
  blocking: boolean,
  waitUntil: (p: Promise<unknown>) => void
): Promise<Policy | null> {
  const ttl = (policy?.ttlSeconds ?? 30) * 1000;
  const age = Date.now() - fetchedAt;

  if (blocking && (!policy || age > ttl * MAX_STALE_MULTIPLE)) {
    await refreshPolicy();
  } else if (!policy || age > ttl) {
    waitUntil(refreshPolicy());
  }
  return policy;
}

// ═══════════════════════════════════════════════════════════════════════════
// RECOGNISING AGENTS — the lists come from ora, so recognition improves
// without you redeploying
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Search engines and AI agents, longest name first, so the most specific match
 * wins: `applebot-extended` is an AI crawler even though it contains `applebot`.
 */
let indexed: { n: string; traditional: boolean }[] | null = null;
let indexedFor: Detection | null = null;
function needles(d: Detection) {
  if (indexedFor === d && indexed) return indexed;
  indexed = [
    ...d.traditionalBots.map((n) => ({ n, traditional: true })),
    ...d.agentUa.map((n) => ({ n, traditional: false }))
  ].sort((a, b) => b.n.length - a.n.length);
  indexedFor = d;
  return indexed;
}

let botLike: RegExp | null = null;
let botLikeFor: string | null = null;
function botLikeRegExp(d: Detection): RegExp | null {
  if (botLikeFor === d.botLikePattern) return botLike;
  botLikeFor = d.botLikePattern;
  try {
    botLike = new RegExp(d.botLikePattern, "i");
  } catch {
    botLike = null;
  }
  return botLike;
}

/**
 * Search engines (Googlebot, Bingbot…) always get your normal page: serving
 * them different content could hurt your ranking. A crawler rule never blocks
 * them either.
 */
function isTraditionalBot(ua: string, d: Detection): boolean {
  if (!ua) return false;
  // Exact matches first (ORA-475): text too generic for a substring needle
  // (a bare "google") ships in the exact lists.
  if ((d.traditionalBotsExact ?? []).includes(ua)) return true;
  const hit = needles(d).find((x) => ua.includes(x.n));
  return hit ? hit.traditional : false;
}

/** A person opening a page in a browser always gets your normal page. */
function isBrowserNavigation(req: NextRequest): boolean {
  return (
    req.headers.get("sec-fetch-mode") === "navigate" &&
    req.headers.get("sec-fetch-dest") === "document"
  );
}

function isAgent(req: NextRequest, ua: string, d: Detection): boolean {
  if (ua) {
    // Exact matches outrank the substring needles (ORA-475), veto first.
    const exactVeto = (d.traditionalBotsExact ?? []).includes(ua);
    const exactAgent = !exactVeto && (d.agentUaExact ?? []).includes(ua);
    const hit = exactVeto
      ? { traditional: true }
      : exactAgent
        ? { traditional: false }
        : needles(d).find((x) => ua.includes(x.n));
    if (hit) {
      if (hit.traditional) return false;
      if (!isBrowserNavigation(req)) return true;
    }
  }

  const signed = req.headers.get("signature-agent")?.replace(/^"|"$/g, "").toLowerCase();
  if (signed && d.signatureAgentDomains.some((x) => signed.includes(x))) return true;

  const pattern = botLikeRegExp(d);
  if (!req.headers.get("sec-fetch-mode") && ua && pattern?.test(ua)) {
    // Something that looks automated — unless it is a known search engine.
    return !needles(d).some((x) => x.traditional && ua.includes(x.n));
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVING FROM ORA
// ═══════════════════════════════════════════════════════════════════════════

/** Query parameter names ora uses itself; never forwarded from a visitor. */
const ORA_RESERVED = new Set(["path", "v"]);

/**
 * The address of a page's markdown version at ora. Only the question
 * parameters you declared in the Portal are passed along — the rest of your
 * URL (tokens, emails, ids) never leaves your app.
 */
function twinUrl(base: string, page: string, version: string, url: URL, policy: Policy): string {
  const forwarded = new URLSearchParams();
  for (const key of questionParams(policy)) {
    if (ORA_RESERVED.has(key)) continue;
    const value = url.searchParams.get(key);
    if (value !== null) forwarded.append(key, value);
  }
  const extra = forwarded.toString();
  return `${base}/twin?path=${encodeURIComponent(page)}&v=${encodeURIComponent(version)}${extra ? `&${extra}` : ""}`;
}

/**
 * Route rules (v2.1) — cascade resolution ported from the reference worker:
 * exact beats prefix, longer prefix beats shorter, BOTH sides normalize,
 * and UNKNOWN grammar is skipped, never guessed.
 */
function normPath(p: string): string {
  const c = p.replace(/\/{2,}/g, "/");
  return c.length > 1 && c.endsWith("/") ? c.slice(0, -1) : c;
}

function matchRoute(routes: Route[] | undefined, pathname: string): Route | null {
  let best: Route | null = null;
  let bestLen = -1;
  let bestExact = false;
  const reqPath = normPath(pathname);
  for (const r of routes ?? []) {
    const kind = r.match?.kind;
    const path = r.match?.path;
    if ((kind !== "exact" && kind !== "prefix") || typeof path !== "string") continue;
    if (r.action !== "serve" && r.action !== "block" && r.action !== "passthrough") continue;
    const norm = normPath(path);
    const hit =
      kind === "exact" ? reqPath === norm : norm === "/" || reqPath === norm || reqPath.startsWith(norm + "/");
    if (!hit) continue;
    const exact = kind === "exact";
    if ((exact && !bestExact) || (exact === bestExact && norm.length > bestLen)) {
      best = r;
      bestLen = norm.length;
      bestExact = exact;
    }
  }
  return best;
}

/**
 * The route sub-fetch: the original User-Agent is FORWARDED (ora re-checks
 * the cloaking veto server-side); Content-Type rides the relay in fromOra.
 */
async function fromOraRoute(url: string, req: NextRequest, shared: boolean, ttl: number) {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { authorization: `Bearer ${KEY}`, "user-agent": req.headers.get("user-agent") ?? "" },
      signal: deadline(SERVE_TIMEOUT_MS)
    });
    if (!res.ok) return null;
    const body = await res.text();
    const wireType = res.headers.get("content-type") ?? "text/plain; charset=utf-8";
    return new NextResponse(body, {
      status: 200,
      headers: shared
        ? {
            "content-type": wireType,
            "cache-control": `public, max-age=${ttl}, stale-while-revalidate=60`,
            vary: "accept, accept-encoding",
            "x-ora-served": "1"
          }
        : {
            "content-type": wireType,
            "cache-control": "private, no-store",
            vary: "accept, user-agent, sec-fetch-mode, sec-fetch-dest",
            "x-ora-served": "1"
          }
    });
  } catch {
    return null;
  }
}

/** Your Portal's include/exclude paths for markdown versions (by path prefix). */
function twinEligible(pathname: string, t: Twins): boolean {
  const matches = (p: string) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`);
  if ((t.excludePaths ?? []).some(matches)) return false;
  const include = t.includePaths ?? [];
  return include.length === 0 || include.some(matches);
}

/**
 * How long browsers and CDNs may keep a file ora served. ora can make this
 * stricter (never cache) but not longer than the settings refresh interval, so
 * changes you make in the Portal reach your visitors quickly.
 */
function sharedCacheControl(upstream: string | null, ttl: number): string {
  if (upstream && /\b(no-store|no-cache|private)\b/i.test(upstream)) return upstream;
  return `public, max-age=${ttl}, stale-while-revalidate=60`;
}

/**
 * Fetch a file from ora and return it as your site's response — or null, and
 * your app answers. ora's answers are a 200, or a 428 ("ask a question first").
 * Anything else, including ora being slow or down, falls back to your app.
 *
 * `shared` is true for a URL that means the same thing for everyone
 * (`/llms.txt`, `/pricing.md`), which browsers and CDNs may cache. Markdown
 * given to a detected agent at a normal page URL is never cached by a shared
 * cache, so a person visiting that URL next still gets your page.
 *
 * THE ORIGINAL USER-AGENT IS FORWARDED, as `fromOraRoute` already did. ora's
 * serving side varies the OFFER it makes by client — some are shown links to
 * follow, others a URL grammar they can compose with — and it reads the
 * user-agent off THIS sub-fetch to decide. Without it every request carried
 * this runtime's own user-agent, ora resolved no client, and every visitor got
 * the same offer.
 *
 * What made the omission invisible: these responses already declare
 * `vary: …user-agent…`, so they claimed to vary by client while nothing
 * upstream let them. The cloaking veto kept working because it lives on the
 * ROUTE path, which forwarded — so the one existing user-agent-dependent
 * behaviour was on the one path that was correct.
 */
async function fromOra(url: string, req: NextRequest, contentType: string, shared: boolean, ttl: number) {
  try {
    // v2.2: the serve doors authenticate — the SAME key the policy fetch
    // and the ingest batch already carry.
    const res = await fetch(url, {
      cache: "no-store",
      headers: { authorization: `Bearer ${KEY}`, "user-agent": req.headers.get("user-agent") ?? "" },
      signal: deadline(SERVE_TIMEOUT_MS)
    });
    if (res.status !== 200 && res.status !== 428) return null;
    const body = await res.text();

    const cacheable = shared && res.status === 200;
    const headers = new Headers({
      // RELAYED from ora's response; the parameter is only the fallback. The
      // server owns the wire type — when it changed once (text/markdown →
      // text/plain, because OpenAI's live fetcher rejects text/markdown),
      // files that hardcoded it kept serving the rejected type.
      "content-type": res.headers.get("content-type") ?? contentType,
      "x-ora-served": "1",
      "cache-control": cacheable ? sharedCacheControl(res.headers.get("cache-control"), ttl) : "private, no-store",
      vary: cacheable ? "accept, accept-encoding" : "accept, user-agent, sec-fetch-mode, sec-fetch-dest",
    });
    return new NextResponse(body, { status: res.status, headers });
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORTING TO ORA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The only query parameters that are reported, together with the question
 * parameters you declared in the Portal; the rest of your URLs never leave your
 * app. These are how a visit that came from an AI answer is attributed.
 */
const KEEP_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "ref", "source"];

/** Whether the visitor asked a declared question — that answer is not shared-cached. */
function varies(url: URL, policy: Policy): boolean {
  return questionParams(policy).some((k) => !ORA_RESERVED.has(k) && url.searchParams.has(k));
}

function questionParams(policy: Policy | null | undefined): string[] {
  const names = policy?.twins?.questionParams;
  if (!Array.isArray(names)) return [];
  return names.filter((n): n is string => typeof n === "string" && n.length > 0);
}

function allowedQuery(url: URL, policy?: Policy | null): string | undefined {
  const kept = new URLSearchParams();
  for (const key of [...KEEP_PARAMS, ...questionParams(policy)]) {
    const value = url.searchParams.get(key);
    if (value) kept.set(key, value.slice(0, 128));
  }
  const qs = kept.toString();
  return qs ? `?${qs}` : undefined;
}

/** A daily pseudonym for the visitor, from IP + user-agent + ORA_SALT. No salt, no pseudonym. */
async function visitorHash(ip: string, ua: string): Promise<string | undefined> {
  if (!SALT) return undefined;
  try {
    const day = new Date().toISOString().slice(0, 10);
    const data = new TextEncoder().encode(`${ip}|${ua}|${day}|${SALT}`);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return undefined;
  }
}

/** Static files — scripts, styles, images, fonts, media — are not reported. */
const ASSET_EXTENSIONS = new Set([
  "js", "mjs", "css", "map", "png", "jpg", "jpeg", "gif", "svg", "webp", "avif",
  "ico", "woff", "woff2", "ttf", "otf", "eot", "mp4", "webm", "mp3", "wav"
]);

// ora's own page downloads are not visitor traffic.
const SKIP_UA_TOKENS = ["ora-front/"];

function shouldRecord(pathname: string, request: NextRequest): boolean {
  const ua = (request.headers.get("user-agent") ?? "").toLowerCase();
  if (SKIP_UA_TOKENS.some((token) => ua.includes(token))) return false;

  const ext = pathname.slice(pathname.lastIndexOf(".") + 1).toLowerCase();
  return !(pathname.includes(".") && ASSET_EXTENSIONS.has(ext));
}

/**
 * Whether a request passing through to your app is a page view: GET or HEAD
 * only (a form post's or API call's outcome cannot be seen from here), and not
 * one of the background requests a browser makes for your app. Next's <Link>
 * prefetches every link in view, and those fetches reach this file looking like
 * page requests — Next removes its own markers before middleware runs — so a
 * browser request counts only when the browser says it is loading a page
 * (`sec-fetch-dest: document`). Crawlers and AI agents do not send that header
 * and are always counted.
 */
const PAGE_DESTINATIONS = new Set(["document", "iframe", "frame"]);

function isPageView(req: NextRequest): boolean {
  if (req.method !== "GET" && req.method !== "HEAD") return false;
  const h = req.headers;
  const dest = h.get("sec-fetch-dest");
  if (dest !== null && !PAGE_DESTINATIONS.has(dest)) return false;
  if (h.has("x-nextjs-data") || h.has("x-middleware-prefetch")) return false;
  return !`${h.get("sec-purpose") ?? ""} ${h.get("purpose") ?? ""}`.includes("prefetch");
}

/**
 * Send one event to ora, in the background. Only the headers listed here are
 * sent — never cookies. A failure is logged with an `[ora]` prefix and never
 * affects your visitor.
 */
async function report(req: NextRequest, host: string, status: number, startedAt: number): Promise<void> {
  const url = req.nextUrl;
  const h = req.headers;
  const ua = h.get("user-agent") ?? "";
  const ip =
    h.get("x-vercel-forwarded-for") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "";

  const event = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    host,
    path: url.pathname.slice(0, 2048),
    query: allowedQuery(url, policy),
    method: req.method,
    status,
    ua: ua.slice(0, 512),
    referer: h.get("referer") ?? undefined,
    vh: await visitorHash(ip, ua),
    cc: h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? undefined,
    durMs: Math.max(0, Date.now() - startedAt),
    headers: {
      accept: h.get("accept") ?? undefined,
      "accept-language": h.get("accept-language") ?? undefined,
      "sec-fetch-mode": h.get("sec-fetch-mode") ?? undefined,
      "sec-fetch-dest": h.get("sec-fetch-dest") ?? undefined,
      "sec-fetch-site": h.get("sec-fetch-site") ?? undefined
    }
  };

  try {
    const res = await fetch(INGEST_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${KEY}`,
        "content-type": "application/x-ndjson",
        "x-ora-batch-id": crypto.randomUUID(),
        "x-ora-transmitter": TRANSMITTER
      },
      body: `${JSON.stringify(event)}\n`,
      cache: "no-store",
      signal: deadline(INGEST_TIMEOUT_MS)
    });
    if (res.status !== 202) {
      console.warn(`[ora] ingest ${res.status}: ${(await res.text()).slice(0, 500)}`);
    } else {
      const body = (await res.json().catch(() => null)) as { rejected?: number; errors?: unknown } | null;
      if (body?.rejected) console.warn("[ora] events rejected", body.errors);
    }
  } catch {
    // Reporting must never surface to a visitor.
  }
}

/** The hostname your visitor used (behind a proxy such as Vercel's, `x-forwarded-host`). */
function requestHost(req: NextRequest): string {
  return req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? req.nextUrl.host;
}

/** Report the request, then return the response (`null` means: your app answers). */
function finish<R extends NextResponse | null>(
  req: NextRequest,
  event: NextFetchEvent,
  res: R,
  startedAt: number,
  servedStatus: number | null
): R {
  const status = servedStatus ?? (isPageView(req) ? pageStatus(req.nextUrl.pathname) : null);
  if (REPORTING_ON && status !== null && shouldRecord(req.nextUrl.pathname, req)) {
    event.waitUntil(report(req, requestHost(req), status, startedAt));
  }
  return res;
}

// ═══════════════════════════════════════════════════════════════════════════
// THE MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

/** ora's answer when it has one; otherwise your app answers as usual. */
export default async function agentFront(req: NextRequest, event: NextFetchEvent): Promise<NextResponse> {
  return (await handleAgentFront(req, event)) ?? NextResponse.next();
}

/**
 * ALREADY HAVE A MIDDLEWARE (auth, languages, redirects)? Save this file as
 * `agent-front.ts` next to yours and call this first:
 *
 *   import { handleAgentFront } from "./agent-front";
 *
 *   export default async function middleware(req: NextRequest, event: NextFetchEvent) {
 *     const answered = await handleAgentFront(req, event);
 *     if (answered) return answered;
 *     // …your middleware, unchanged…
 *   }
 *
 * `null` means "not ora's to answer — carry on"; the request is reported either
 * way. Then add these paths to YOUR `config.matcher` (Next reads the matcher
 * from your middleware file only), or ora never sees them:
 *
 *   "/robots.txt", "/llms.txt", "/agents.md", "/openapi.json",
 *   "/.well-known/:path*", "/(.*\\.md)"
 */
export async function handleAgentFront(req: NextRequest, event: NextFetchEvent): Promise<NextResponse | null> {
  const startedAt = Date.now();

  // A read-only status page for checking the setup: open /__ora/status on your
  // site. It shows configuration only — never your key — for the server
  // instance that answered. Delete this block if you would rather not have it.
  if (req.nextUrl.pathname === "/__ora/status") {
    return NextResponse.json(
      {
        reporting: REPORTING_ON,
        autopilot: AUTOPILOT_ON,
        passthroughReporting: pageStatus("/") !== null,
        domainId: DOMAIN_ID || null,
        hasPolicy: policy !== null,
        mode: policy?.mode ?? null,
        artifacts: Array.isArray(policy?.artifacts) ? policy.artifacts.map((a) => a?.path) : [],
        ageMs: policy ? Date.now() - fetchedAt : null,
        ttlSeconds: policy?.ttlSeconds ?? null,
        backoffMs: Math.max(0, backoffUntil - Date.now()),
        consecutiveFailures,
        lastError
      },
      { headers: { "cache-control": "no-store" } }
    );
  }

  const pass = () => finish(req, event, null, startedAt, null);

  // Only GET and HEAD are ever served from ora, and only with Autopilot configured.
  if (!AUTOPILOT_ON) return pass();
  if (req.method !== "GET" && req.method !== "HEAD") return pass();

  // Anything unexpected while serving falls back to your app, and the reason
  // shows in /__ora/status.
  try {
    const served = await serve(req, event, startedAt);
    if (served) return served;
  } catch (err) {
    const message = `serving failed: ${err instanceof Error ? err.message : String(err)}`;
    if (lastError !== message) console.error(`[ora] ${message} — passing through to your origin`);
    lastError = message;
  }
  return pass();
}

/** What ora serves for this request, in order — or null, and your app answers. */
async function serve(req: NextRequest, event: NextFetchEvent, startedAt: number): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl;
  const p = await getPolicy(mightBeArtifact(pathname), (job) => event.waitUntil(job));
  if (!p || p.mode !== "autopilot") return null;

  const base = `${p.serveBaseUrl}/${p.siteId}`;
  const ttl = p.ttlSeconds ?? 30;
  const ua = (req.headers.get("user-agent") ?? "").toLowerCase();
  const traditional = isTraditionalBot(ua, p.detection);

  // 1. A file ora manages (robots.txt, llms.txt…), for every visitor — a
  //    blocked crawler can still read the robots.txt that tells it so.
  const artifact = p.artifacts.find((a) => a.path === pathname);
  if (artifact) {
    if (artifact.action === "passthrough") return null;
    if (artifact.action === "block") {
      return finish(req, event, new NextResponse("Not available to this client.", { status: 403 }), startedAt, 403);
    }
    const served = await fromOra(
      `${base}/artifact/${artifact.kind}?v=${encodeURIComponent(artifact.version)}`,
      req,
      artifact.contentType,
      true,
      ttl
    );
    return served ? finish(req, event, served, startedAt, served.status) : null;
  }

  // 2. A crawler your Portal rules block — never a search engine, never a person.
  if (!traditional && !isBrowserNavigation(req) && p.blockedAgentUa.some((n) => ua.includes(n))) {
    return finish(req, event, new NextResponse("Not available to this client.", { status: 403 }), startedAt, 403);
  }

  // 2b. Route rules (v2.1). After the block (a block outranks any serve),
  //     before the twin branches (a route is more specific than the suffix
  //     rule). A `serve` route that answers nothing FALLS THROUGH. Matched on
  //     the raw spelling AND, for a `.md` request, the page it strips to — a
  //     block on /pricing must also catch /pricing.md.
  const mdPage = pathname.endsWith(p.twins.suffix)
    ? pathname.slice(0, -p.twins.suffix.length) || "/"
    : null;
  const route = matchRoute(p.routes, pathname) ?? (mdPage ? matchRoute(p.routes, mdPage) : null);
  if (route) {
    if (route.action === "passthrough") return null;
    const routedAgent = !traditional && isAgent(req, ua, p.detection);
    if (route.action === "block" && routedAgent) {
      return finish(req, event, new NextResponse("Not available to this client.", { status: 403 }), startedAt, 403);
    }
    if (route.action === "serve" && routedAgent) {
      const q = `path=${encodeURIComponent(pathname)}&v=${encodeURIComponent(route.version)}`;
      const served = await fromOraRoute(`${base}/page?${q}`, req, route.cache === "shared", ttl);
      if (served) return finish(req, event, served, startedAt, served.status);
    }
    // Anyone else — a human, an unrecognised client — falls through untouched.
  }

  // 3. An explicit markdown request (`/pricing.md`), for anyone who asks.
  if (p.twins.enabled && pathname.endsWith(p.twins.suffix)) {
    const page = pathname.slice(0, -p.twins.suffix.length) || "/";
    if (!twinEligible(page, p.twins)) return null;
    const asked = varies(req.nextUrl, p);
    const served = await fromOra(
      twinUrl(base, page, p.generatedAt, req.nextUrl, p),
      req,
      "text/plain; charset=utf-8",
      !asked,
      ttl
    );
    return served ? finish(req, event, served, startedAt, served.status) : null;
  }

  // 4. The markdown version of a page, for a detected AI agent or a client that
  //    asks for `text/markdown` — never for a search engine. If ora has no
  //    markdown for the page, your app answers.
  const wantsMarkdown = (req.headers.get("accept") ?? "").includes("text/markdown");
  if (
    p.twins.negotiate &&
    !traditional &&
    twinEligible(pathname, p.twins) &&
    (wantsMarkdown || isAgent(req, ua, p.detection))
  ) {
    const served = await fromOra(
      twinUrl(base, pathname, p.generatedAt, req.nextUrl, p),
      req,
      "text/plain; charset=utf-8",
      false,
      ttl
    );
    if (served) return finish(req, event, served, startedAt, served.status);
  }

  return null;
}

/**
 * Which requests run through this file: everything except Next's own static
 * files, plus the paths ora may manage, listed explicitly so they are never
 * skipped.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/robots.txt",
    "/llms.txt",
    "/agents.md",
    "/openapi.json",
    "/.well-known/:path*"
  ]
};
