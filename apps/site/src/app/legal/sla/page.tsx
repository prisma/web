import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { slaLastUpdated, slaSections } from "@/lib/legal/sla";

export const metadata: Metadata = {
  title: "Service Level Agreement",
  description: "Read the Prisma Service Level Agreement.",
};

export default function SlaPage() {
  return (
    <LegalPage
      title="Service Level Agreement"
      lastUpdated={slaLastUpdated}
      sections={slaSections}
    />
  );
}
