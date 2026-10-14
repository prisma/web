import { postgresLanding } from "@/components/landing/content";
import { LandingExample } from "@/components/landing/landing-example";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";

// Landing page for the Prisma Postgres ChatGPT ad. Campaign URL:
//   /lp/postgres?utm_source=chatgpt&utm_medium=paid&utm_campaign=postgres-managed-database
export const metadata = landingMetadata(postgresLanding);

export default function PostgresLandingPage() {
  return (
    <LandingPage content={postgresLanding}>
      <LandingExample />
    </LandingPage>
  );
}
