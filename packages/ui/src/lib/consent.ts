/**
 * CookieYes analytics-consent helpers.
 *
 * These read the exact same signals the GTM consent bridge already uses
 * (see `components/google-tag-manager.tsx`): the `cookieyes_consent_update`
 * and `cookieyes_banner_load` events, and the `getCkyConsent()` global.
 * Using one source of truth keeps every analytics SDK gated consistently.
 *
 * GDPR/ePrivacy note: analytics SDKs must not set cookies or send data until
 * the visitor grants analytics consent. Callers should start opted-out and
 * only opt in from these helpers.
 *
 * Consent is tri-state: a visitor who has never interacted with the banner
 * ("pending", `isUserActionCompleted: false`) is not the same as one who
 * rejected analytics ("denied"). PostHog's cookieless mode counts pending
 * visitors without touching device storage, so callers must not collapse
 * "pending" into an explicit opt-out that writes an opt-out flag.
 */

/** CookieYes category key for analytics cookies. */
const ANALYTICS_CATEGORY = "analytics";
/** CookieYes category key for advertising cookies (ad pixels, click ids). */
const ADVERTISEMENT_CATEGORY = "advertisement";

export type ConsentCategory = typeof ANALYTICS_CATEGORY | typeof ADVERTISEMENT_CATEGORY;
export type AnalyticsConsentStatus = "granted" | "denied" | "pending";

type CkyConsent = {
  categories?: Record<string, boolean>;
  /** True once the visitor has accepted/rejected/saved from the banner. */
  isUserActionCompleted?: boolean;
};

declare global {
  interface Window {
    getCkyConsent?: () => CkyConsent;
  }
}

/**
 * The visitor's stored analytics-consent decision.
 *
 * - `"granted"`: the visitor accepted analytics cookies.
 * - `"denied"`: the visitor made a choice that excludes analytics.
 * - `"pending"`: SSR, CookieYes not loaded yet, or no banner interaction yet.
 */
export function getAnalyticsConsentStatus(): AnalyticsConsentStatus {
  return getConsentStatus(ANALYTICS_CATEGORY);
}

/**
 * The visitor's stored decision for one CookieYes category; same tri-state as
 * analytics. Before the CookieYes script has loaded (it is loaded lazily), the
 * decision is read from the `cookieyes-consent` cookie it stored last time, so
 * a returning visitor's first page view is not lost to "pending".
 */
export function getConsentStatus(category: ConsentCategory): AnalyticsConsentStatus {
  if (typeof window === "undefined") return "pending";
  try {
    const consent = window.getCkyConsent?.();
    if (!consent) return readStoredConsentStatus(category);
    if (!consent.isUserActionCompleted) return "pending";
    return consent.categories?.[category] ? "granted" : "denied";
  } catch {
    return "pending";
  }
}

/** Reads the decision CookieYes persisted in its own cookie: `action:yes` plus `<category>:yes|no`. */
export function readStoredConsentStatus(
  category: ConsentCategory,
  cookie: string = typeof document === "undefined" ? "" : document.cookie,
): AnalyticsConsentStatus {
  const match = cookie.match(/(?:^|;\s*)cookieyes-consent=([^;]*)/);
  if (!match?.[1]) return "pending";
  const fields = new Map<string, string>();
  for (const entry of match[1].split(",")) {
    const [key, value] = entry.split(":");
    if (!key || value === undefined) return "pending";
    fields.set(key, value);
  }
  if (fields.get("action") !== "yes") return "pending";
  return fields.get(category) === "yes" ? "granted" : "denied";
}

/** True when CookieYes has a stored decision granting analytics consent. */
export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsentStatus() === "granted";
}

/** True when CookieYes has a stored decision granting advertising consent. */
export function hasAdvertisingConsent(): boolean {
  return getConsentStatus(ADVERTISEMENT_CATEGORY) === "granted";
}

/**
 * Invokes `onChange(status)` whenever the analytics-consent status changes.
 *
 * - Fires on `cookieyes_consent_update` when the visitor accepts/rejects from
 *   the banner. This is always an explicit decision, so never "pending".
 * - Fires on `cookieyes_banner_load` so returning visitors' stored decisions
 *   are applied once CookieYes restores them. Reports "pending" when the
 *   visitor has not interacted with the banner yet.
 *
 * Safe no-op during SSR.
 */
export function onAnalyticsConsentChange(onChange: (status: AnalyticsConsentStatus) => void): void {
  onConsentChange(ANALYTICS_CATEGORY, onChange);
}

/**
 * `onAnalyticsConsentChange` for any category. Returns an unsubscribe
 * function so React effects can clean up; a no-op function during SSR.
 */
export function onConsentChange(
  category: ConsentCategory,
  onChange: (status: AnalyticsConsentStatus) => void,
): () => void {
  if (typeof document === "undefined") return () => {};

  const onUpdate = (event: Event) => {
    const accepted = (event as CustomEvent<{ accepted?: string[] }>).detail?.accepted ?? [];
    onChange(accepted.includes(category) ? "granted" : "denied");
  };
  const onLoad = () => {
    onChange(getConsentStatus(category));
  };

  document.addEventListener("cookieyes_consent_update", onUpdate);
  document.addEventListener("cookieyes_banner_load", onLoad);
  return () => {
    document.removeEventListener("cookieyes_consent_update", onUpdate);
    document.removeEventListener("cookieyes_banner_load", onLoad);
  };
}
