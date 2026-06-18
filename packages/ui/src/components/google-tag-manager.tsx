/**
 * Consent-gated Google Tag Manager loader.
 *
 * Split into two parts on purpose:
 *
 *  1. An inline bootstrap that always runs. It only initialises `dataLayer`
 *     (a plain in-memory array) and pushes the page section + GTM start event.
 *     This sets no cookies and makes no network requests, so it is safe to run
 *     before consent.
 *  2. The GTM library itself, loaded as an EXTERNAL `src` script tagged for
 *     CookieYes' analytics category. CookieYes only reliably re-activates
 *     external `src` scripts after consent — an inline `type="text/plain"` GTM
 *     bootstrap is left inert and never executes, so it must NOT be used here.
 *     This mirrors the working external-`src` pattern used for Tolt/PromptWatch.
 *     See https://www.cookieyes.com/documentation/implement-prior-consent-using-cookieyes/
 *
 * Nothing contacts Google until CookieYes activates the external script once the
 * visitor grants analytics consent (GDPR/ePrivacy compliant). No `<noscript>`
 * iframe fallback is rendered, as it would load GTM regardless of consent.
 *
 * One container serves the whole prisma.io domain; each zone passes its
 * `section` so every hit carries a `site_section` dimension and can be segmented
 * (website vs blog vs docs) in GA4.
 */

import type { SiteSection } from "../lib/analytics";

// Public, client-side container ID (Prisma Main › prisma.io). Ships in the HTML
// to every visitor by design, so it is intentionally hardcoded, not an env var.
const GTM_CONTAINER_ID = "GTM-KRTRXXQ6";

type GoogleTagManagerProps = {
  section: SiteSection;
};

export function GoogleTagManager({ section }: GoogleTagManagerProps) {
  const bootstrap = `
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ site_section: ${JSON.stringify(section)} });
window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });`.trim();

  return (
    <>
      {/* Always runs: dataLayer setup only — no cookies, no network requests. */}
      <script id="gtm-datalayer" dangerouslySetInnerHTML={{ __html: bootstrap }} />
      {/* Consent-gated: CookieYes activates this external script after analytics
          consent, which then loads the container and starts firing tags. */}
      <script
        id="gtm-loader"
        type="text/plain"
        data-cookieyes="cookieyes-analytics"
        data-cookieyes-category="analytics"
        async
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`}
      />
    </>
  );
}
