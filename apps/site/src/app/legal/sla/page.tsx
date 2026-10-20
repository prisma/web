import { createPageMetadata } from "@/lib/page-metadata";
import { LegalPage } from "@/components/sections/legal-page";
import { slaEffectiveDate, slaSections } from "@/lib/legal/sla";

export const metadata = createPageMetadata({
  title: "Service Level Agreement",
  description: "Read the Prisma Service Level Agreement.",
  path: "/legal/sla",
  ogKicker: "Legal",
});

export default function SlaPage() {
  return (
    <LegalPage
      title="Service Level Agreement"
      effectiveDate={slaEffectiveDate}
      sections={slaSections}
    />
  );
}
