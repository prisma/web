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
gtag('set', 'url_passthrough', true);
window.dataLayer.push({ site_section: ${JSON.stringify(section)} });

// Bridge CookieYes consent
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
