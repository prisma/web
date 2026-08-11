import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { termsLastUpdated, termsSections } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Prisma Terms of Service.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated={termsLastUpdated} sections={termsSections} />
  );
}
