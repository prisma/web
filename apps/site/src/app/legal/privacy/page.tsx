import { createPageMetadata } from "@/lib/page-metadata";
import { LegalPage } from "@/components/sections/legal-page";
import { privacyLastUpdated, privacySections } from "@/lib/legal/privacy";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read the Prisma Privacy Policy covering how we collect, use, and protect your data.",
  path: "/legal/privacy",
  ogKicker: "Legal",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={privacyLastUpdated} sections={privacySections} />
  );
}
