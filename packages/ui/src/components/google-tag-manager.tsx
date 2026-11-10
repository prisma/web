import * as React from "react";
import type { SiteSection } from "../lib/analytics";

// Public, client-side container ID (Prisma Main › prisma.io).
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
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 2000
});
gtag('set', 'ads_data_redaction', true);
window.dataLayer.push({ site_section: ${JSON.stringify(section)} });

// A denied default is not a network gate: GTM can still send cookieless ads.
// Load the container only after an explicit analytics or advertisement grant.
(function(){
  function load(){
    if (window.__prismaGtmLoaded) return;
    window.__prismaGtmLoaded = true;
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
  }

  function update(accepted){
    accepted = accepted || [];
    var ads = accepted.indexOf('advertisement') !== -1 ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: accepted.indexOf('analytics') !== -1 ? 'granted' : 'denied',
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads
    });
    if (ads === 'granted' || accepted.indexOf('analytics') !== -1) load();
  }
  // Fires when the visitor changes consent.
  document.addEventListener('cookieyes_consent_update', function(e){
    update(e && e.detail && e.detail.accepted);
  });
  // Applies stored consent for returning visitors once CookieYes is ready.
  document.addEventListener('cookieyes_banner_load', function(){
    if (typeof getCkyConsent === 'function') {
      var consent = getCkyConsent() || {};
      if (consent.isUserActionCompleted) {
        var cats = consent.categories || {};
        update(Object.keys(cats).filter(function(k){ return cats[k]; }));
      }
    }
  });
  // CookieYes can restore this decision after our bootstrap. Read its own
  // explicit action marker now so returning visitors do not lose a pageview.
  var match = document.cookie.match(/(?:^|;\\s*)cookieyes-consent=([^;]*)/);
  if (match) {
    var fields = match[1].split(',');
    if (fields.indexOf('action:yes') !== -1) {
      update(['analytics', 'advertisement'].filter(function(key){ return fields.indexOf(key + ':yes') !== -1; }));
    }
  }
})();
`.trim();

  return <script id="gtm-loader" dangerouslySetInnerHTML={{ __html: html }} />;
}
