import posthog from "posthog-js";

/**
 * Returns true if the visitor has already accepted analytics cookies via
 * CookieYes (i.e. the consent cookie is present and includes "analytics:yes").
 * Used to immediately opt returning visitors in without waiting for the banner.
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

// Initialise opted-out by default — no data is sent until the visitor
// explicitly accepts analytics via the CookieYes banner.
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: "history_change",
  defaults: "2025-11-30",
  opt_out_capturing_by_default: true,
  loaded: (ph) => {
    ph.register({
      site_name: "mono-blog",
      environment: "production",
    });
  },
});

// Returning visitor: consent cookie already present — opt in straight away.
if (hasAnalyticsConsent()) {
  posthog.opt_in_capturing();
}

// Live consent updates: fired by CookieYes when the visitor interacts with
// the banner or changes their preferences.
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
