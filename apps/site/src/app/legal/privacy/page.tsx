import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { privacyLastUpdated, privacySections } from "@/lib/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Prisma Privacy Policy covering how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={privacyLastUpdated} sections={privacySections} />
  );
}
