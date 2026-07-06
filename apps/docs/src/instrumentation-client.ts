import posthog from "posthog-js";
import * as Sentry from "@sentry/nextjs";
import { hasAnalyticsConsent, onAnalyticsConsentChange } from "@prisma-docs/ui/lib/consent";

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
