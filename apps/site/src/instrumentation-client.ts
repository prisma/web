import { captureBrowserAcquisition } from "@prisma-docs/ui/lib/acquisition.browser";
import { onCtaClick } from "@prisma-docs/ui/lib/analytics";
import posthog from "posthog-js";
import { hasAnalyticsConsent, onAnalyticsConsentChange } from "@prisma-docs/ui/lib/consent";
import { getPaidPersonProperties, onAttributionChange } from "@prisma-docs/ui/lib/attribution";
import {
  readStoredUtmAttribution,
  UTM_ATTRIBUTION_STORAGE_KEY,
  type UtmAttribution,
} from "@prisma-docs/ui/lib/utm";

const SUPER_PROPERTIES = {
  site_name: "mono-site",
  environment: "production",
};

const acquisitionProperties = () => captureBrowserAcquisition("website", hasAnalyticsConsent());
acquisitionProperties();

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  before_send: (event) => {
    if (event?.event === "$pageview")
      event.properties = { ...event.properties, ...acquisitionProperties() };
    return event;
  },
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: "history_change",
  defaults: "2025-11-30",
  // ChatGPT ad clicks land with `oppref` and no UTM params. Treating it as a
  // campaign param puts it on every event and freezes `$initial_oppref` on
  // the person, like `gclid`, so an ad-acquired person stays identifiable.
  custom_campaign_params: ["oppref"],
  // GDPR/ePrivacy: no cookies, storage, or persistent identifiers until the
  // visitor grants analytics consent via CookieYes. Opt-in is handled below.
  // Until then (banner ignored or analytics rejected) visitors are counted
  // cookielessly: events carry the $posthog_cookieless sentinel and PostHog's
  // servers derive a daily rotating hash; nothing identifying is stored
  // on-device. Requires "Cookieless server hash mode" in project settings,
  // otherwise these events are dropped at ingestion.
  cookieless_mode: "on_reject",
  // With cookieless_mode this also makes not-yet-decided visitors count as
  // rejected (cookieless) rather than uncaptured.
  opt_out_capturing_by_default: true,
  loaded: (posthog) => {
    posthog.register(SUPER_PROPERTIES);
    // Returning visitor whose stored consent is already available at init.
    if (hasAnalyticsConsent()) posthog.opt_in_capturing();
  },
});

// React to live banner interactions and to CookieYes restoring stored consent.
// "pending" must NOT opt out: an explicit opt-out writes an opt-out flag to
// device storage, and the visitor has not made a decision yet; cookieless
// capture already covers them.
onAnalyticsConsentChange((status) => {
  acquisitionProperties();
  if (status === "granted") {
    posthog.opt_in_capturing();
    const stored = readStoredUtmAttribution(UTM_ATTRIBUTION_STORAGE_KEY);
    if (stored) recordPaidTouch(stored);
  } else if (status === "denied") posthog.opt_out_capturing();
  // Both transitions reset the SDK state that held the registered
  // super-properties, so re-register or later events lose site_name.
  if (status !== "pending") posthog.register(SUPER_PROPERTIES);
});

// Paid-acquisition attribution.
// A purchase can happen months after the ad click, long outside any ad
// platform's conversion window, so the paid touch is recorded on the PostHog
// *person* rather than on a conversion event. It then rides through signup on
// console.prisma.io (same `.prisma.io` cookie domain) onto every later event.
// No-ops while opted out, so this stays behind the same consent gate.
function recordPaidTouch(attribution: UtmAttribution) {
  if (!hasAnalyticsConsent()) return;
  const properties = getPaidPersonProperties(attribution);
  if (!properties) return;

  posthog.setPersonProperties(properties.set, properties.setOnce);
}

onAttributionChange(recordPaidTouch);

// Console-bound CTA clicks, with where on the page they happened. GTM gets
// the same click as `cta_click` for GA4, but only with analytics consent;
// this one is counted cookielessly before consent too, so a landing page's
// clicks can be set against its visits and the Console's arrivals. Sent at
// once over a beacon: the click navigates to another origin and a batched
// request would be lost with the page. The campaign params and the ad click
// id are on the event already, as PostHog attaches them to every event.
onCtaClick((cta) => {
  posthog.capture(
    "site:cta_clicked",
    {
      cta_text: cta.cta_text,
      cta_location: cta.cta_location,
      cta_destination: cta.cta_destination,
      section: cta.section ?? "website",
      page_path: window.location.pathname,
    },
    { send_instantly: true, transport: "sendBeacon" },
  );
});

// Landings that arrive before UtmPersistence mounts are covered by replaying
// whatever is already stored.
if (typeof window !== "undefined") {
  const stored = readStoredUtmAttribution(UTM_ATTRIBUTION_STORAGE_KEY);
  if (stored) recordPaidTouch(stored);
}
