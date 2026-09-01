export const CONSOLE_HOST = "console.prisma.io";
export const UTM_ATTRIBUTION_STORAGE_KEY = "prisma_utm_attribution";

export type UtmParams = Record<string, string>;
export interface UtmAttribution {
  first: UtmParams;
  last: UtmParams;
}

/**
 * Ad-platform click identifiers.
 *
 * Paid traffic usually arrives carrying only one of these — Google auto-tagging
 * appends `gclid` and no UTM params at all — so without capturing them a paid
 * visit is indistinguishable from direct traffic.
 *
 * These are captured and persisted like UTM params, but deliberately are NOT
 * written back onto internal links (see `syncUtmParams`): they are opaque and
 * long, and only matter at the point a visitor crosses into the console, where
 * `syncUtmAttribution` appends them.
 */
const CLICK_ID_KEYS = new Set([
  "gclid", // Google Ads
  "wbraid", // Google Ads, web-to-app, iOS
  "gbraid", // Google Ads, app-to-web, iOS
  "msclkid", // Microsoft Advertising
  "fbclid", // Meta
  "li_fat_id", // LinkedIn
  "twclid", // X/Twitter
  "ttclid", // TikTok
]);

function isClickIdKey(key: string) {
  return CLICK_ID_KEYS.has(key);
}

/** Keys that are rewritten onto internal links. */
function isAttributionKey(key: string) {
  return key.startsWith("utm_") || key === "ref";
}

/** Keys that are captured into stored attribution. */
function isCapturedKey(key: string) {
  return isAttributionKey(key) || isClickIdKey(key);
}

function sanitizeUtmParams(input: unknown): UtmParams {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => isCapturedKey(key) && typeof value === "string" && value.length > 0,
    ),
  );
}

export function getUtmParams(searchParams: URLSearchParams): UtmParams {
  const utmParams: UtmParams = {};

  for (const [key, value] of searchParams.entries()) {
    if (isCapturedKey(key) && value) {
      utmParams[key] = value;
    }
  }

  return utmParams;
}

export function hasUtmParams(utmParams: UtmParams) {
  return Object.keys(utmParams).length > 0;
}

function sanitizeUtmAttribution(input: unknown): UtmAttribution | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return undefined;
  }

  const candidate = input as Partial<UtmAttribution>;
  const first = sanitizeUtmParams(candidate.first);
  const last = sanitizeUtmParams(candidate.last);

  return hasUtmParams(first) && hasUtmParams(last) ? { first, last } : undefined;
}

export function mergeUtmAttribution(
  existing: UtmAttribution | undefined,
  latest: UtmParams,
): UtmAttribution | undefined {
  const validExisting = sanitizeUtmAttribution(existing);
  const validLatest = sanitizeUtmParams(latest);

  if (!hasUtmParams(validLatest)) {
    return validExisting;
  }

  return {
    first: validExisting?.first ?? validLatest,
    last: validLatest,
  };
}

export function syncUtmParams(url: URL, utmParams: UtmParams) {
  let updated = false;

  for (const key of Array.from(url.searchParams.keys())) {
    if (isAttributionKey(key) && !(key in utmParams)) {
      url.searchParams.delete(key);
      updated = true;
    }
  }

  // Click IDs are captured but never rewritten onto internal links — only
  // `syncUtmAttribution` puts them on console links.
  for (const [key, value] of Object.entries(utmParams)) {
    if (isClickIdKey(key)) {
      continue;
    }

    if (url.searchParams.get(key) !== value) {
      url.searchParams.set(key, value);
      updated = true;
    }
  }

  return updated;
}

export function syncUtmAttribution(
  url: URL,
  attribution: UtmAttribution,
  options: { includeFirstTouch?: boolean } = {},
) {
  let updated = syncUtmParams(url, attribution.last);

  if (!options.includeFirstTouch) {
    return updated;
  }

  const firstTouchParams = Object.fromEntries(
    Object.entries(attribution.first).map(([key, value]) => [`first_${key}`, value]),
  );

  // Carry click IDs across to the console so a signup there can be tied back to
  // the ad click that started the visit.
  for (const [key, value] of Object.entries(attribution.last)) {
    if (isClickIdKey(key) && url.searchParams.get(key) !== value) {
      url.searchParams.set(key, value);
      updated = true;
    }
  }

  for (const key of Array.from(url.searchParams.keys())) {
    if ((key.startsWith("first_utm_") || key === "first_ref") && !(key in firstTouchParams)) {
      url.searchParams.delete(key);
      updated = true;
    }
  }

  for (const [key, value] of Object.entries(firstTouchParams)) {
    if (url.searchParams.get(key) !== value) {
      url.searchParams.set(key, value);
      updated = true;
    }
  }

  return updated;
}

export function readStoredUtmAttribution(storageKey: string) {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const storedAttribution = window.localStorage.getItem(storageKey);

    if (!storedAttribution) {
      return undefined;
    }

    return sanitizeUtmAttribution(JSON.parse(storedAttribution));
  } catch {
    return undefined;
  }
}

export function writeStoredUtmAttribution(storageKey: string, attribution: UtmAttribution) {
  if (typeof window === "undefined") {
    return;
  }

  const validAttribution = sanitizeUtmAttribution(attribution);

  if (!validAttribution) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(validAttribution));
  } catch {
    // Ignore storage failures in restricted environments.
  }
}
