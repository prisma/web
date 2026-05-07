import { createPageMetadata } from "@/lib/page-metadata";
import { Accordion, Accordions, Button } from "@prisma/eclipse";
import { faqs } from "./pricing-data";
import { PricingPageContent } from "./pricing-page-content";
import { PageFooterCta } from "@/components/page-footer-cta";

export const metadata = createPageMetadata({
  title: "Prisma Pricing | Prisma Postgres Plans and Usage-Based Pricing",
  description:
    "Compare Prisma Postgres plans, usage-based pricing, included features, and workspace options. Start free and scale as your product grows.",
  path: "/pricing",
  ogImage: "/og/og-pricing.png",
});

export default function PricingPage() {
  return (
    <main className="flex-1 w-full -mt-24 bg-background-default text-background-neutral-weak pt-24">
      <PricingPageContent />

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

      <PageFooterCta
        title="Try Prisma Postgres"
        description="Deploy a Postgres database instantly."
        btns={[
          {
            url: `https://console.prisma.io/sign-up?utm_source=website&utm_medium=pricing&utm_campaign=cta`,
            text: "Create your first Database",
            external: true,
          },
          { url: "https://www.prisma.io/docs", text: "Read the docs" },
        ]}
        footer="Free to get started, no credit card needed."
      />
    </main>
  );
}
