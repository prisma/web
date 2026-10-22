import { GuideIndex, getGuideIndexMetadata } from "@/components/answer-pages/guide-index";

export const metadata = getGuideIndexMetadata("postgres");

/** List the Postgres guide collection in its product directory. */
export default function PostgresGuidesPage() {
  return <GuideIndex product="postgres" />;
}
