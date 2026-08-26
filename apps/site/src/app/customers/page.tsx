import type { Metadata } from "next";
import { CtaBurst } from "@/components/sections/cta-burst";
import { CustomersGrid } from "@/components/sections/customers-grid";
import { CustomersHero } from "@/components/sections/customers-hero";
import { TestimonialsReveal } from "@/components/sections/testimonials-reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/customers" },
  title: "Customers",
  description:
    "See how teams use Prisma ORM, Prisma Postgres, and Prisma Compute in production to ship faster, scale reliably, and improve developer workflows.",
};

// Ported from the old site's /case-studies page (apps/site). The nav links
// here as "Customers"; story content lives in src/lib/customers.ts.
export default function CustomersPage() {
  return (
    <>
      <CustomersHero />
      <CustomersGrid />
      <TestimonialsReveal heading="What teams say about Prisma" />
      <CtaBurst />
    </>
  );
}
