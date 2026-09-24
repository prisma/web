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
  if (typeof window === "undefined") return "pending";
  try {
    const consent = window.getCkyConsent?.();
    if (!consent || !consent.isUserActionCompleted) return "pending";
    return consent.categories?.[ANALYTICS_CATEGORY] ? "granted" : "denied";
  } catch {
    return "pending";
  }
}

/** True when CookieYes has a stored decision granting analytics consent. */
export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsentStatus() === "granted";
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
  if (typeof document === "undefined") return;

  document.addEventListener("cookieyes_consent_update", (event) => {
    const accepted = (event as CustomEvent<{ accepted?: string[] }>).detail?.accepted ?? [];
    onChange(accepted.includes(ANALYTICS_CATEGORY) ? "granted" : "denied");
  });

  document.addEventListener("cookieyes_banner_load", () => {
    onChange(getAnalyticsConsentStatus());
  });
}
