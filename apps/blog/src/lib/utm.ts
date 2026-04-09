export const UTM_STORAGE_KEY = "blog_utm_params";
export const CONSOLE_HOST = "console.prisma.io";

export type UtmParams = Record<string, string>;

function sanitizeUtmParams(input: unknown): UtmParams {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) =>
        key.startsWith("utm_") && typeof value === "string" && value.length > 0,
    ),
  );
}

export function getUtmParams(searchParams: URLSearchParams): UtmParams {
  const utmParams: UtmParams = {};

  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("utm_") && value) {
      utmParams[key] = value;
    }
  }

  return utmParams;
}

export function hasUtmParams(utmParams: UtmParams) {
  return Object.keys(utmParams).length > 0;
}

export function syncUtmParams(url: URL, utmParams: UtmParams) {
  let updated = false;

  for (const key of Array.from(url.searchParams.keys())) {
    if (key.startsWith("utm_") && !(key in utmParams)) {
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

export function readStoredUtmParams() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const storedUtmParams = window.sessionStorage.getItem(UTM_STORAGE_KEY);

    if (!storedUtmParams) {
      return {};
    }

    return sanitizeUtmParams(JSON.parse(storedUtmParams));
  } catch {
    return {};
  }
}

export function writeStoredUtmParams(utmParams: UtmParams) {
  if (typeof window === "undefined") {
    return;
  }

  const validUtmParams = sanitizeUtmParams(utmParams);

  if (!hasUtmParams(validUtmParams)) {
    return;
  }

  try {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(validUtmParams));
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

export function clearStoredUtmParams() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(UTM_STORAGE_KEY);
  } catch {
    // Ignore storage failures in restricted environments.
  }
}
