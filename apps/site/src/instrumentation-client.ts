/**
 * Returns true if the visitor has already accepted the "analytics" category
 * via the CookieYes consent banner (i.e. on a return visit where the consent
 * cookie is already present).
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

const initPostHog = () => {
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: "history_change",
      defaults: "2025-11-30",
      opt_out_capturing_by_default: true,
      loaded: (ph) => {
        ph.register({
          site_name: "mono-site",
          environment: "production",
        });
      },
    });

    if (hasAnalyticsConsent()) {
      posthog.opt_in_capturing();
    }

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
  });
};

if (typeof window !== "undefined") {
  if (document.readyState === "complete") {
    initPostHog();
  } else {
    window.addEventListener("load", initPostHog, { once: true });
  }
}
