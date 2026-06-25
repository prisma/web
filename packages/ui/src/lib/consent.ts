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
 */

/** CookieYes category key for analytics cookies. */
const ANALYTICS_CATEGORY = "analytics";

type CkyConsent = { categories?: Record<string, boolean> };

declare global {
  interface Window {
    getCkyConsent?: () => CkyConsent;
  }
}

/**
 * True when CookieYes has a stored decision granting analytics consent.
 *
 * Returns false during SSR, before CookieYes has loaded, or when the visitor
 * has not (yet) accepted analytics — i.e. the safe default is "no consent".
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.getCkyConsent?.().categories?.[ANALYTICS_CATEGORY]);
  } catch {
    return false;
  }
}

/**
 * Invokes `onChange(granted)` whenever analytics consent changes.
 *
 * - Fires on `cookieyes_consent_update` when the visitor accepts/rejects from
 *   the banner.
 * - Fires on `cookieyes_banner_load` so returning visitors who previously
 *   consented are opted in once CookieYes restores their stored decision.
 *
 * Safe no-op during SSR.
 */
export function onAnalyticsConsentChange(onChange: (granted: boolean) => void): void {
  if (typeof document === "undefined") return;

  document.addEventListener("cookieyes_consent_update", (event) => {
    const accepted = (event as CustomEvent<{ accepted?: string[] }>).detail?.accepted ?? [];
    onChange(accepted.includes(ANALYTICS_CATEGORY));
  });

  document.addEventListener("cookieyes_banner_load", () => {
    onChange(hasAnalyticsConsent());
  });
}
