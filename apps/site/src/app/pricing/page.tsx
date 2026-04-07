import { createPageMetadata } from "@/lib/page-metadata";
import { Accordion, Accordions, Button } from "@prisma/eclipse";
import { faqs } from "./pricing-data";
import { PricingPageContent } from "./pricing-page-content";

export const metadata = createPageMetadata({
  title: "Pricing — Prisma Postgres Plans & Features",
  description:
    "Get started for free with Prisma Postgres. Choose the right plan for your workspace based on your project requirements.",
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

      {/* Try Prisma Postgres */}

      <section className="bg-radial from-background-ppg from-0% to-background-default to-70% px-4 py-12">
        <div className="mx-auto rounded-2xl bg-[url('/illustrations/homepage/footer_grid.svg')] bg-cover bg-center px-4 py-12">
          <div className="p-4 md:p-8">
            <div className="mx-auto flex max-w-[580px] flex-col items-center gap-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                  Try Prisma Postgres
                </h2>
                <p className="text-foreground-neutral-weak">
                  Deploy a Postgres database instantly.
                </p>
              </div>
              <div className="flex flex-col gap-6 md:flex-row">
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
              <h6 className="mb-0! -mt-4 text-xs text-foreground-neutral-weaker">
                Free to get started, no credit card needed.
              </h6>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
