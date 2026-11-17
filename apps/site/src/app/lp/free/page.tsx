import { freeLanding } from "@/components/landing/content";
import { FreePlanCard } from "@/components/landing/free-plan-card";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";
import { PriceCompare } from "@/components/landing/price-compare";

// Landing page for the Free plan ChatGPT ads. Ad URL, one `utm_content` per ad:
//   /lp/free?utm_source=chatgpt&utm_medium=paid&utm_campaign=free-plan&utm_content=<ad>&utm_term=lp-free
// `utm_term` names the landing variant; a tagged visit without it is
// redirected to add it (next.config.mjs). A visit with no campaign params is
// treated as direct.
export const metadata = landingMetadata(freeLanding);

export default function FreeLandingPage() {
  return (
    <LandingPage content={freeLanding} heroVisual={<FreePlanCard />}>
      <PriceCompare
        headline="And when you grow, it stays cheap"
        body="Paid plans start at $10 a month and meter the work your app does. On the two meters that dominate a hosting bill, Prisma Compute charges half of Vercel Pro's CPU rate and about 40% less for memory, and there is no seat fee."
      />
    </LandingPage>
  );
}
