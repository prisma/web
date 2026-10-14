import { ormLanding } from "@/components/landing/content";
import { LandingExample } from "@/components/landing/landing-example";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";

// Landing page for the "Build TypeScript apps with Prisma ORM 8" ChatGPT ad.
// Campaign URL:
//   /lp/orm?utm_source=chatgpt&utm_medium=paid&utm_campaign=orm-8-typescript
export const metadata = landingMetadata(ormLanding);

export default function OrmLandingPage() {
  return (
    <LandingPage content={ormLanding}>
      <LandingExample />
    </LandingPage>
  );
}
