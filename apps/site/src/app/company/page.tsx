import type { Metadata } from "next";
import { CtaBurst } from "@/components/sections/cta-burst";
import {
  CompanyCares,
  CompanyHero,
  CompanyInvestors,
  TeamPhotos,
} from "@/components/sections/company-sections";

export const metadata: Metadata = {
  title: "Company",
  description:
    "At Prisma, our mission is to make working with databases easy, with a great developer experience at the core of every product we build.",
};

// Ported from the old site's /about page (apps/site). The footer links here
// as "About"; careers lives at /company/careers.
export default function CompanyPage() {
  return (
    <>
      <CompanyHero />
      <TeamPhotos />
      <CompanyInvestors />
      <CompanyCares />
      <CtaBurst
        primaryCta={{ label: "View open positions", href: "/company/careers" }}
        secondaryCta={{ label: "Read the blog", href: "/blog" }}
      />
    </>
  );
}
