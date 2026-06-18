/**
 * Consent-gated Google Tag Manager loader.
 *
 * Renders the GTM bootstrap as an inert `type="text/plain"` script tagged for
 * CookieYes' analytics category. CookieYes activates it only after the visitor
 * grants analytics consent — mirroring the pattern already used across the apps
 * for Tolt and the previous GTM container. Before activation nothing loads, so
 * no Google network calls happen without consent (GDPR/ePrivacy compliant).
 *
 * The same container (one per the prisma.io domain) is used by every zone; each
 * zone passes its `section` so all hits carry a `site_section` dimension and can
 * be segmented (website vs blog vs docs) in GA4.
 *
 * Note: no `<noscript>` iframe fallback is rendered on purpose — a plain iframe
 * would load GTM regardless of consent and break the consent gate.
 */

import type { SiteSection } from "../lib/analytics";

// Public, client-side container ID (Prisma Main › prisma.io). Ships in the HTML
// to every visitor by design, so it is intentionally hardcoded, not an env var.
const GTM_CONTAINER_ID = "GTM-KRTRXXQ6";

type GoogleTagManagerProps = {
  section: SiteSection;
};

export function GoogleTagManager({ section }: GoogleTagManagerProps) {
  const html = `
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ site_section: ${JSON.stringify(section)} });
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`.trim();

  return (
    <script
      id="gtm-loader"
      type="text/plain"
      data-cookieyes="cookieyes-analytics"
      data-cookieyes-category="analytics"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
