import { postgresLanding } from "@/components/landing/content";
import { LandingPage, landingMetadata } from "@/components/landing/landing-page";

// Landing page for the Prisma Postgres ChatGPT ads. Ad URL, one `utm_content`
// per ad:
//   /lp/postgres?utm_source=chatgpt&utm_medium=paid&utm_campaign=postgres-managed-database&utm_content=<ad>&utm_term=lp-postgres
// `utm_term` names the landing variant; a tagged visit without it is
// redirected to add it (next.config.mjs). A visit with no campaign params is
// treated as direct.
export const metadata = landingMetadata(postgresLanding);

export default function PostgresLandingPage() {
  return <LandingPage content={postgresLanding} />;
}
