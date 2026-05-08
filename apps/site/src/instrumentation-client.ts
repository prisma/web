import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: "history_change",
  defaults: "2025-11-30",
  loaded: (posthog) => {
    posthog.register({
      site_name: "mono-site",
      environment: "production",
    });
  },
});
