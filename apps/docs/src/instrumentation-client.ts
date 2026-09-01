import posthog from "posthog-js";
import * as Sentry from "@sentry/nextjs";
import { hasAnalyticsConsent, onAnalyticsConsentChange } from "@prisma-docs/ui/lib/consent";
import { getPaidPersonProperties, onAttributionChange } from "@prisma-docs/ui/lib/attribution";
import {
  readStoredUtmAttribution,
  UTM_ATTRIBUTION_STORAGE_KEY,
  type UtmAttribution,
} from "@prisma-docs/ui/lib/utm";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: "history_change",
  defaults: "2025-11-30",
  // GDPR/ePrivacy: do not set cookies or capture anything until the visitor
  // grants analytics consent via CookieYes. Opt-in is handled below.
  opt_out_capturing_by_default: true,
  loaded: (posthog) => {
    posthog.register({
      site_name: "mono-docs",
      environment: "production",
    });
    // Returning visitor whose stored consent is already available at init.
    if (hasAnalyticsConsent()) posthog.opt_in_capturing();
  },
});

// React to live banner interactions and to CookieYes restoring stored consent.
onAnalyticsConsentChange((granted) => {
  if (granted) posthog.opt_in_capturing();
  else posthog.opt_out_capturing();
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

Sentry.init({
  dsn: "https://e83ce4699e59051fdeaa330bf4a0dfb9@o4510879743737856.ingest.us.sentry.io/4510879744000000",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
