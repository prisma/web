export const UTM_STORAGE_KEY = "site_utm_params";

export type UtmParams = Record<string, string>;

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

export function mergeUtmParams(url: URL, utmParams: UtmParams) {
  let updated = false;

  for (const [key, value] of Object.entries(utmParams)) {
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
      updated = true;
    }
  }

  return updated;
}

export function readStoredUtmParams() {
  const storedUtmParams = window.sessionStorage.getItem(UTM_STORAGE_KEY);

  if (!storedUtmParams) {
    return {};
  }

  try {
    return JSON.parse(storedUtmParams) as UtmParams;
  } catch {
    return {};
  }
}

export function writeStoredUtmParams(utmParams: UtmParams) {
  if (hasUtmParams(utmParams)) {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
  }
}
