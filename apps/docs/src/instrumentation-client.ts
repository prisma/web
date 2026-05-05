import posthog from "posthog-js";
import * as Sentry from "@sentry/nextjs";

/**
 * Returns true when the visitor has already accepted analytics cookies via
 * the CookieYes consent banner. Checked on every page load so that returning
 * visitors who previously consented are opted-in immediately, without waiting
 * for the banner to re-appear.
 */
function hasAnalyticsConsent(): boolean {
  try {
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith("cookieyes-consent="));
    if (!match) return false;
    return decodeURIComponent(match.split("=")[1]).includes("analytics:yes");
  } catch {
    return false;
  }
}

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: "history_change",
  defaults: "2025-11-30",
  // Do not capture anything until the visitor explicitly grants analytics
  // consent via CookieYes. Opt-in logic is handled below.
  opt_out_capturing_by_default: true,
  loaded: (ph) => {
    ph.register({
      site_name: "mono-docs",
      environment: "production",
    });
  },
});

// Returning visitor: consent cookie already present — opt in immediately.
if (hasAnalyticsConsent()) {
  posthog.opt_in_capturing();
}

// New / updating visitor: react to live banner interactions.
// CookieYes fires "cookieyes-consent-update" on the document whenever the
// visitor accepts or rejects categories from the consent banner.
document.addEventListener("cookieyes-consent-update", (event: Event) => {
  const detail = (event as CustomEvent<{ accepted: string[] }>).detail;
  if (
    Array.isArray(detail?.accepted) &&
    detail.accepted.includes("analytics")
  ) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
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
