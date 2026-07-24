export const CONSOLE_HOST = "console.prisma.io";
export const UTM_ATTRIBUTION_STORAGE_KEY = "prisma_utm_attribution";

export type UtmParams = Record<string, string>;
export interface UtmAttribution {
  first: UtmParams;
  last: UtmParams;
}

function isAttributionKey(key: string) {
  return key.startsWith("utm_") || key === "ref";
}

function sanitizeUtmParams(input: unknown): UtmParams {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => isAttributionKey(key) && typeof value === "string" && value.length > 0,
    ),
  );
}

export function getUtmParams(searchParams: URLSearchParams): UtmParams {
  const utmParams: UtmParams = {};

  for (const [key, value] of searchParams.entries()) {
    if (isAttributionKey(key) && value) {
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

  for (const [key, value] of Object.entries(utmParams)) {
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
