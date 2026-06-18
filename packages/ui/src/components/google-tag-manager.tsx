/**
 * Google Tag Manager loader with Google Consent Mode v2.
 *
 * GTM loads normally — it is NOT gated as a `type="text/plain"` script (CookieYes
 * does not re-activate blocked scripts in this account, so gating left GTM inert
 * and GA4 got no data). Compliance is handled by Consent Mode instead:
 *
 *  - All consent types default to "denied", inline and synchronously, BEFORE GTM
 *    runs. GA4 sets no cookies and only sends anonymous cookieless pings until the
 *    visitor consents — no device storage pre-consent (ePrivacy satisfied).
 *  - A small bridge maps CookieYes consent to Google's consent signal via
 *    CookieYes's JS API (`cookieyes_consent_update` event + `getCkyConsent()`),
 *    firing `gtag('consent','update',...)` on accept. This needs NO CookieYes
 *    dashboard configuration — it works purely from the consent events CookieYes
 *    already emits. See
 *    https://www.cookieyes.com/documentation/implementing-google-consent-mode-using-cookieyes/
 *
 * One container serves the whole prisma.io domain; each zone passes its `section`
 * so every hit carries a `site_section` dimension (website/blog/docs).
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
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
window.dataLayer.push({ site_section: ${JSON.stringify(section)} });

// Bridge CookieYes consent -> Google Consent Mode (no dashboard config required).
(function(){
  function update(accepted){
    accepted = accepted || [];
    var ads = accepted.indexOf('advertisement') !== -1 ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: accepted.indexOf('analytics') !== -1 ? 'granted' : 'denied',
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads
    });
  }
  // Fires when the visitor changes consent.
  document.addEventListener('cookieyes_consent_update', function(e){
    update(e && e.detail && e.detail.accepted);
  });
  // Applies stored consent for returning visitors once CookieYes is ready.
  document.addEventListener('cookieyes_banner_load', function(){
    if (typeof getCkyConsent === 'function') {
      var cats = (getCkyConsent() || {}).categories || {};
      update(Object.keys(cats).filter(function(k){ return cats[k]; }));
    }
  });
})();

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`.trim();

  return <script id="gtm-loader" dangerouslySetInnerHTML={{ __html: html }} />;
}
