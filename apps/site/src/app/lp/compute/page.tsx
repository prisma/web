import { computeLanding } from "@/components/landing/content";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";
import { PriceCompare } from "@/components/landing/price-compare";

// Landing page for the Prisma Compute ChatGPT ads. Ad URL, one `utm_content`
// per ad so Ads Manager rows and PostHog signups line up:
//   /lp/compute?utm_source=chatgpt&utm_medium=paid&utm_campaign=compute-app-and-database&utm_content=<ad>&utm_term=lp-compute
// The ad platform appends `oppref=<click id>` itself. `utm_term` names the
// landing variant. A visit without it, or without `utm_source`, is redirected
// to the tagged URL (next.config.mjs).
export const metadata = landingMetadata(computeLanding);

export default function ComputeLandingPage() {
  return (
    <LandingPage content={computeLanding}>
      <PriceCompare />
    </LandingPage>
  );
}
