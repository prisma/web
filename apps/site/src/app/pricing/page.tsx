import { JsonLd } from "@/components/json-ld";
import { createFaqStructuredData } from "@/lib/structured-data";
import type { Metadata } from "next";
import {
  Accordion,
  Accordions,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@prisma/eclipse";
import { comparisonSections, faqs } from "./pricing-data";
import { PricingPageContent } from "./pricing-page-content";

const pricingFaqStructuredData = createFaqStructuredData(
  "/pricing",
  faqs,
  "Prisma pricing FAQ",
);

export const metadata: Metadata = {
  title: "Pricing | Prisma Postgres",
  description: "Get started for free using Prisma's products or choose the right plan that meets your needs",
  alternates: {
    canonical: "https://www.prisma.io/pricing",
  },
  openGraph: {
    title: "Pricing | Prisma Postgres",
    description:
      "Get started for free using Prisma's products or choose the right plan that meets your needs",
    url: "https://www.prisma.io/pricing",
    images: [
      {
        url: "/og/og-pricing.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Prisma Postgres",
    description:
      "Get started for free using Prisma's products or choose the right plan that meets your needs",
    images: ["/og/og-pricing.png"],
  },
};

export default function PricingPage() {
  return (
    <main className="flex-1 w-full -mt-24 bg-background-default text-background-neutral-weak">
      <JsonLd id="pricing-faq-structured-data" data={pricingFaqStructuredData} />
      <PricingPageContent />

      {/* Compare plans */}
      <section className="px-4 py-16">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-6">
          <h3 className="m-0 text-center text-foreground-neutral text-5xl font-sans-display [font-variation-settings:'wght'_900]">
            Compare plans
          </h3>
          <p className="m-0 text-center text-foreground-neutral-weak">
            All of the features below are included with Prisma Postgres.
          </p>
        </div>
        <div className="max-w-[996px] mx-auto mt-10 border border-background-neutral-reverse-weak rounded-xl overflow-hidden">
          <Table className="table-fixed">
            <TableHeader className="[&_tr]:border-b-0">
              <TableRow className="hover:bg-transparent border-b border-background-neutral-reverse bg-background-neutral-weak">
                <TableHead className="bg-background-neutral-weak text-base uppercase tracking-[1.6px] font-sans-display [font-variation-settings:'wght'_800] text-background-neutral-weak">
                  {comparisonSections[0]?.title}
                </TableHead>
                {["Free", "Starter", "Pro", "Business"].map((label) => (
                  <TableHead
                    key={label}
                    className="bg-background-neutral-weak text-left text-background-neutral-weak"
                  >
                    <Badge
                      size="lg"
                      className="rounded-md"
                      color={
                        label === "Pro"
                          ? "ppg"
                          : label === "Starter"
                            ? "orm"
                            : label === "Business"
                              ? "warning"
                              : "neutral"
                      }
                      label={label}
                    />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {comparisonSections.map((section) => (
              <TableBody key={section.title}>
                <TableRow className="hover:bg-transparent border-t border-b border-background-neutral-reverse-weak bg-background-neutral-weak">
                  <TableCell
                    colSpan={5}
                    className="bg-background-neutral-weak text-base uppercase tracking-[1.6px] font-sans-display [font-variation-settings:'wght'_800] text-foreground-neutral"
                  >
                    {section.title}
                  </TableCell>
                </TableRow>

                {section.rows.map((row) => (
                  <TableRow
                    key={row[0]}
                    className="hover:bg-transparent border-b border-background-neutral-reverse-weak"
                  >
                    <TableCell className="font-semibold text-sm text-foreground-neutral">
                      {row[0]}
                    </TableCell>
                    {row.slice(1).map((value, valueIndex) => (
                      <TableCell
                        key={`${row[0]}-${valueIndex}-${value}`}
                        className="text-sm text-foreground-neutral-weak"
                      >
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ))}
          </Table>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="max-w-[996px] mx-auto">
          <h4 className="m-0 text-center text-foreground-neutral text-5xl font-sans-display [font-variation-settings:'wght'_900]">
            FAQ
          </h4>
          <Accordions
            type="single"
            className="mt-10 border border-stroke-neutral-weak rounded-md overflow-hidden"
          >
            {faqs.map((faq, index) => (
              <Accordion
                key={faq.question}
                value={`faq-${index}`}
                title={faq.question}
                className="border-b border-stroke-neutral-weak last:border-b-0"
              >
                <div
                  className="m-0 text-foreground-neutral-weak [&_p]:my-0 [&_p+p]:mt-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </Accordion>
            ))}
          </Accordions>
          <p className="m-0 mt-8 text-center text-xs text-foreground-neutral-weak">
            If you have any questions, please reach out to our support team at{" "}
            <a href="mailto:support@prisma.io" className="underline">
              support@prisma.io
            </a>
            .
          </p>
        </div>
      </section>

      {/* Try Prisma Postgres */}
      <section className="px-4 py-16 border-t border-stroke-neutral-weak">
        <div className="max-w-[427px] mx-auto text-center">
          <h5 className="m-0 text-5xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
            Try Prisma Postgres
          </h5>
          <p className="m-0 mt-4 text-xl text-foreground-neutral-weak">
            Deploy a Postgres database instantly.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="ppg"
              size="2xl"
              href="https://console.prisma.io/sign-up?utm_source=website&utm_medium=pricing&utm_campaign=cta"
            >
              <span>Create your first Database</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
            <Button variant="default-stronger" size="2xl" href="https://www.prisma.io/docs/">
              <span>Read the docs</span>
              <i className="fa-regular fa-book-open ml-2" />
            </Button>
          </div>
          <p className="m-0 mt-4 text-xs text-foreground-neutral-weak">
            Free to get started, no credit card needed.
          </p>
        </div>
      </section>
    </main>
  );
}
