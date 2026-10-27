import { providersLanding } from "@/components/landing/content";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";
import { ProviderCompare } from "@/components/landing/provider-compare";
import { ScaleCompareCard } from "@/components/landing/scale-compare-card";

// Landing page for the "See how Prisma compares at scale" creative of the
// October 2026 Starter and Pro campaign. Ad URL, one `utm_content` per
// creative so Ads Manager rows and PostHog signups line up:
//   /lp/providers?utm_source=chatgpt&utm_medium=paid&utm_campaign=us_desktop_starter_pro_oct2026_lp&utm_content=provider_comparison&utm_term=lp-providers
// The ad platform appends `oppref=<click id>` itself. `utm_term` names the
// landing variant; a tagged visit without it is redirected to add it
// (next.config.mjs). A visit with no campaign params is treated as direct.
export const metadata = landingMetadata(providersLanding);

export default function ProvidersLandingPage() {
  return (
    <LandingPage content={providersLanding} heroVisual={<ScaleCompareCard />} plansAfterChildren>
      <ProviderCompare />
    </LandingPage>
  );
}
