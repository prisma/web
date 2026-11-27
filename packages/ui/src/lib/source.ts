/**
 * Signup source classification, v1.
 *
 * One value from a fixed list says where a visitor came from: an AI assistant,
 * a search engine, a social site, a developer tool, the Vercel marketplace,
 * anything else, or nowhere (`direct`). It is decided from the campaign tags
 * first and the referrer host second, and only the value from the list is ever
 * stored or forwarded: never a referrer URL, path or query string.
 *
 * The same rules live in the Console (`packages/contracts/control-plane/source.ts`
 * in prisma/pdp-control-plane). Both copies are tested against the same
 * `source.fixture.json`, so a change here needs the same change there.
 */

export const SOURCE_VERSION = 1;

export const SOURCE_VALUES = [
  "chatgpt",
  "claude",
  "gemini",
  "perplexity",
  "copilot",
  "grok",
  "other_ai",
  "google",
  "bing",
  "other_search",
  "social",
  "dev_tool",
  "vercel",
  "other",
  "direct",
  "unknown",
] as const;
export type Source = (typeof SOURCE_VALUES)[number];

/** Last-touch source on a Console link. */
export const SOURCE_PARAM = "acq_source";
/** First-touch source on a Console link. */
export const FIRST_SOURCE_PARAM = "first_acq_source";

/** First and last touch that were not direct. Either can be missing. */
export interface SourceTouches {
  first?: Source;
  last?: Source;
}

export interface SourceSignals {
  /** `acq_source` from an upstream prisma surface. Wins over everything else. */
  forwarded?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  /** Names of the ad click id params present, such as `gclid`. */
  clickIds?: Iterable<string>;
  /** `document.referrer` or the `Referer` header. Only its host is read. */
  referrer?: string | null;
}

export function isSource(value: unknown): value is Source {
  return typeof value === "string" && (SOURCE_VALUES as readonly string[]).includes(value);
}

/** A real touch: anything but `direct` and `unknown`. */
export function isObservedSource(value: unknown): value is Source {
  return isSource(value) && value !== "direct" && value !== "unknown";
}

/**
 * Reads an `acq_source` or `first_acq_source` value. Anything outside the list
 * is dropped, and so are `direct` and `unknown`: an upstream surface that saw
 * nothing omits the param, so its "nothing" can never beat a real touch here.
 */
export function parseForwardedSource(value: string | null | undefined): Source | undefined {
  const normalized = value?.trim().toLowerCase();
  return isObservedSource(normalized) ? normalized : undefined;
}

/** Campaign tags that name a prisma.io placement, not where the visitor came from. */
const PLACEMENT_UTM_SOURCES = new Set([
  "docs",
  "docs-v6",
  "website",
  "prisma_blog",
  "actions_guide",
  "kapa",
  "dataguide",
]);
const PLACEMENT_UTM_MEDIUMS = new Set(["templates"]);
const DEV_TOOL_UTM_MEDIUMS = new Set(["cli", "claim_button"]);

const EXACT_UTM_SOURCES: Record<string, Source> = {
  "chatgpt.com": "chatgpt",
  chatgpt: "chatgpt",
  openai: "chatgpt",
  claude: "claude",
  "claude.ai": "claude",
  anthropic: "claude",
  gemini: "gemini",
  grok: "grok",
  gravity: "other_ai",
  google: "google",
  bing: "bing",
  reddit: "social",
  youtube: "social",
  x: "social",
  twitter: "social",
  "create-db-frontend": "dev_tool",
  create_db_web: "dev_tool",
  cli: "dev_tool",
  "prisma-cli": "dev_tool",
  vscode: "dev_tool",
  vercel: "vercel",
};

function classifyUtm(utmSource: string, utmMedium: string): Source | undefined {
  if (DEV_TOOL_UTM_MEDIUMS.has(utmMedium)) return "dev_tool";
  if (!utmSource || PLACEMENT_UTM_SOURCES.has(utmSource) || PLACEMENT_UTM_MEDIUMS.has(utmMedium)) {
    return undefined;
  }
  const exact = EXACT_UTM_SOURCES[utmSource];
  if (exact) return exact;
  if (utmSource.includes("perplexity")) return "perplexity";
  if (utmSource.includes("copilot")) return "copilot";
  return "other";
}

/** Ad click ids that name a source on their own, in priority order. */
const CLICK_ID_SOURCES: ReadonlyArray<readonly [string, Source]> = [
  ["gclid", "google"],
  ["wbraid", "google"],
  ["gbraid", "google"],
  ["oppref", "chatgpt"],
  ["msclkid", "bing"],
];

function classifyClickIds(clickIds: Iterable<string> | undefined): Source | undefined {
  if (!clickIds) return undefined;
  const present = new Set(clickIds);
  return CLICK_ID_SOURCES.find(([key]) => present.has(key))?.[1];
}

/** prisma.io and the other domains we own. Same list as `isInternalAcquisitionHost`. */
const INTERNAL_DOMAINS = [
  "prisma.io",
  "prisma-data.net",
  "prisma.sh",
  "prismagraphql.com",
  "prisma.build",
];

const EXACT_REFERRER_HOSTS: Record<string, Source> = {
  "chatgpt.com": "chatgpt",
  "chat.openai.com": "chatgpt",
  "claude.ai": "claude",
  "gemini.google.com": "gemini",
  "perplexity.ai": "perplexity",
  "copilot.microsoft.com": "copilot",
  "m365.cloud.microsoft": "copilot",
  "grok.com": "grok",
  "chat.deepseek.com": "other_ai",
  "chat.mistral.ai": "other_ai",
  "you.com": "other_ai",
  "phind.com": "other_ai",
  "duck.ai": "other_ai",
  "l.meta.ai": "other_ai",
  "poe.com": "other_ai",
  "doubao.com": "other_ai",
  "yuanbao.tencent.com": "other_ai",
  "api.trygravity.ai": "other_ai",
  "bing.com": "bing",
  "cn.bing.com": "bing",
  "duckduckgo.com": "other_search",
  "kagi.com": "other_search",
  "t.co": "social",
  "x.com": "social",
  "github.com": "social",
};

/** Sites whose subdomains count as the site itself, such as `old.reddit.com`. */
const SITE_DOMAINS: ReadonlyArray<readonly [string, Source]> = [
  ["reddit.com", "social"],
  ["youtube.com", "social"],
  ["naver.com", "other_search"],
];

/** Google search on any country domain: `google.de`, `google.co.uk`, `google.com.br`. */
const GOOGLE_SEARCH_HOST = /^google\.(?:com|cat|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/;
const YANDEX_HOST = /^yandex\.(?:com|[a-z]{2}|com\.[a-z]{2})$/;

/** Mobile apps that send `android-app://<package>/` as the referrer. */
const APP_REFERRERS: Record<string, Source> = {
  "com.openai.chatgpt": "chatgpt",
  "com.anthropic.claude": "claude",
};

function referrerHost(referrer: string): { host: string; app: boolean } | undefined {
  if (!referrer || referrer.length > 2048) return undefined;
  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return undefined;
  }
  if (url.protocol === "android-app:") {
    return { host: url.hostname.toLowerCase(), app: true };
  }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
    return undefined;
  }
  const host = url.hostname
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/^www\./, "");
  return host ? { host, app: false } : undefined;
}

/**
 * The source a referrer host names, or `undefined` when it names none: no
 * referrer, an invalid one, one of our own domains, or a sign-in page.
 */
function classifyReferrer(referrer: string | null | undefined): Source | undefined {
  const parsed = referrerHost(referrer ?? "");
  if (!parsed) return undefined;
  const { host, app } = parsed;
  if (app) return APP_REFERRERS[host] ?? "other";
  if (INTERNAL_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
    return undefined;
  }
  if (host === "accounts.google.com") return undefined;

  const exact = EXACT_REFERRER_HOSTS[host];
  if (exact) return exact;
  if (host.endsWith(".m365copilotapp.svc.cloud.microsoft")) return "copilot";
  if (GOOGLE_SEARCH_HOST.test(host)) return "google";
  if (YANDEX_HOST.test(host)) return "other_search";
  for (const [domain, source] of SITE_DOMAINS) {
    if (host === domain || host.endsWith(`.${domain}`)) return source;
  }
  // Gmail, Docs, Cloud and every other Google host are not Google search.
  return "other";
}

/**
 * Classifies one touch. The first rule that matches wins:
 * an upstream `acq_source`, a utm_medium rule, a utm_source that is not a
 * placement, a click id, the referrer host, and finally `direct`.
 * It never returns `unknown`: that is for a capture that did not run.
 */
export function classifySource(signals: SourceSignals): Source {
  const forwarded = parseForwardedSource(signals.forwarded);
  if (forwarded) return forwarded;
  const utm = classifyUtm(
    signals.utmSource?.trim().toLowerCase() ?? "",
    signals.utmMedium?.trim().toLowerCase() ?? "",
  );
  return (
    utm ?? classifyClickIds(signals.clickIds) ?? classifyReferrer(signals.referrer) ?? "direct"
  );
}

const CLICK_ID_KEYS = CLICK_ID_SOURCES.map(([key]) => key);

/**
 * The first and last touch a set of query params carries: `acq_source` and
 * `first_acq_source` from an upstream prisma surface, else the campaign tags
 * and click ids (`utm_*`, `first_utm_*`, `gclid`, `first_gclid`, ...). The
 * referrer, when given, belongs to the last touch. A first touch the params do
 * not name is the last touch.
 */
export function sourceFromParams(
  params: URLSearchParams,
  referrer?: string | null,
): { first: Source; last: Source } {
  const last = classifySource({
    forwarded: params.get(SOURCE_PARAM),
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    clickIds: CLICK_ID_KEYS.filter((key) => params.get(key)),
    referrer,
  });
  const first = classifySource({
    forwarded: params.get(FIRST_SOURCE_PARAM),
    utmSource: params.get("first_utm_source"),
    utmMedium: params.get("first_utm_medium"),
    clickIds: CLICK_ID_KEYS.filter((key) => params.get(`first_${key}`)),
  });
  return { first: first === "direct" ? last : first, last };
}

/**
 * Adds a touch to the touches seen before. The first touch that was not direct
 * is kept for good; the last one moves to every later touch that was not
 * direct. A direct touch changes nothing.
 */
export function mergeSourceTouches(
  existing: SourceTouches | undefined,
  touch: { first: Source; last: Source },
): SourceTouches | undefined {
  const observed = (value: unknown) => (isObservedSource(value) ? value : undefined);
  const first = observed(existing?.first) ?? observed(touch.first) ?? observed(touch.last);
  const last = observed(touch.last) ?? observed(existing?.last) ?? first;
  if (!first && !last) return undefined;
  return { ...(first && { first }), ...(last && { last }) };
}
