import { createPageMetadata } from "@/lib/page-metadata";
import { LegalPage } from "@/components/sections/legal-page";
import { termsLastUpdated, termsSections } from "@/lib/legal/terms";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Read the Prisma Terms of Service.",
  path: "/legal/terms",
  ogKicker: "Legal",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated={termsLastUpdated} sections={termsSections} />
  );
}
