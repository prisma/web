import { freeLanding } from "@/components/landing/content";
import { FreePlanCard } from "@/components/landing/free-plan-card";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";
import { PriceCompare } from "@/components/landing/price-compare";

// Landing page for the "Start building for free" ChatGPT ad. Campaign URL:
//   /lp/free?utm_source=chatgpt&utm_medium=paid&utm_campaign=free-plan
export const metadata = landingMetadata(freeLanding);

export default function FreeLandingPage() {
  return (
    <LandingPage content={freeLanding} heroVisual={<FreePlanCard />}>
      <PriceCompare
        headline="And when you grow, it stays cheap"
        body="Paid plans start at $10 a month and meter the work your app does. On the two meters that dominate a hosting bill, Prisma Compute's rate is half of Vercel Pro's or less, and there is no seat fee."
      />
    </LandingPage>
  );
}
