import { postgresLanding } from "@/components/landing/content";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";

// Landing page for the Prisma Postgres ChatGPT ads. Ad URL, one `utm_content`
// per ad:
//   /lp/postgres?utm_source=chatgpt&utm_medium=paid&utm_campaign=postgres-managed-database&utm_content=<ad>
// A visit with no `utm_source` is redirected to the tagged URL (next.config.mjs).
export const metadata = landingMetadata(postgresLanding);

export default function PostgresLandingPage() {
  return <LandingPage content={postgresLanding} />;
}
