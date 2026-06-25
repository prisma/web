import posthog from "posthog-js";
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
      site_name: "mono-site",
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
