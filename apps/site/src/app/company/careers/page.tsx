import type { Metadata } from "next";
import {
  CareersBenefits,
  CareersCulture,
  CareersHero,
} from "@/components/sections/careers-sections";
import { TeamPhotos } from "@/components/sections/company-sections";
import { OpenRoles } from "@/components/sections/open-roles";

export const metadata: Metadata = {
  alternates: { canonical: "/company/careers" },
  title: "Careers",
  description:
    "See open positions at Prisma. Join us to empower developers to build data-driven applications.",
};

// Ported from the old site's /careers page (apps/site).
export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <TeamPhotos />
      <CareersCulture />
      <CareersBenefits />
      <OpenRoles />
    </>
  );
}
