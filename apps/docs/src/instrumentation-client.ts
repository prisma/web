import posthog from "posthog-js";
import * as Sentry from "@sentry/nextjs";
import { hasAnalyticsConsent, onAnalyticsConsentChange } from "@prisma-docs/ui/lib/consent";

const SUPER_PROPERTIES = {
  site_name: "mono-docs",
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
