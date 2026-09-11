import posthog from "posthog-js";
import { hasAnalyticsConsent, onAnalyticsConsentChange } from "@prisma-docs/ui/lib/consent";
import { getPaidPersonProperties, onAttributionChange } from "@prisma-docs/ui/lib/attribution";
import {
  readStoredUtmAttribution,
  UTM_ATTRIBUTION_STORAGE_KEY,
  type UtmAttribution,
} from "@prisma-docs/ui/lib/utm";

const SUPER_PROPERTIES = {
  site_name: "mono-blog",
  environment: "production",
};

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: "history_change",
  defaults: "2025-11-30",
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
  if (status === "granted") posthog.opt_in_capturing();
  else if (status === "denied") posthog.opt_out_capturing();
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
  const properties = getPaidPersonProperties(attribution, new Date().toISOString());
  if (!properties) return;

  posthog.setPersonProperties(properties.set, properties.setOnce);
}

onAttributionChange(recordPaidTouch);

// Landings that arrive before UtmPersistence mounts are covered by replaying
// whatever is already stored.
if (typeof window !== "undefined") {
  const stored = readStoredUtmAttribution(UTM_ATTRIBUTION_STORAGE_KEY);
  if (stored) recordPaidTouch(stored);
}
