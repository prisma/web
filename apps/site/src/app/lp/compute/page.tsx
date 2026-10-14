import { computeLanding } from "@/components/landing/content";
import { LandingExample } from "@/components/landing/landing-example";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";
import { PriceCompare } from "@/components/landing/price-compare";

// Landing page for the "Your app and database, together" ChatGPT ad, the
// campaign's primary message. Campaign URL:
//   /lp/compute?utm_source=chatgpt&utm_medium=paid&utm_campaign=compute-app-and-database
// The ad platform appends `oppref=<click id>` itself.
export const metadata = landingMetadata(computeLanding);

export default function ComputeLandingPage() {
  return (
    <LandingPage content={computeLanding}>
      <PriceCompare />
      <LandingExample />
    </LandingPage>
  );
}
