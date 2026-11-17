import { starterDatabasesLanding } from "@/components/landing/content";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";
import { StarterPlanCard } from "@/components/landing/starter-plan-card";

// Landing page for the "1,000 databases for your agents" creative of the
// October 2026 Starter and Pro campaign. Ad URL, one `utm_content` per
// creative so Ads Manager rows and PostHog signups line up:
//   /lp/1000-databases?utm_source=chatgpt&utm_medium=paid&utm_campaign=us_desktop_starter_pro_oct2026_lp&utm_content=db1000&utm_term=lp-1000-databases
// The ad platform appends `oppref=<click id>` itself. `utm_term` names the
// landing variant; a tagged visit without it is redirected to add it
// (next.config.mjs). A visit with no campaign params is treated as direct.
export const metadata = landingMetadata(starterDatabasesLanding);

export default function StarterDatabasesLandingPage() {
  return (
    <LandingPage
      content={starterDatabasesLanding}
      heroVisual={<StarterPlanCard ctaLabel={starterDatabasesLanding.ctaLabel ?? ""} />}
    />
  );
}
