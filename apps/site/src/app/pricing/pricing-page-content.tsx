"use client";

import * as React from "react";
import type { Symbol } from "./pricing-data";
import { PricingCalculator } from "./pricing-calculator";
import { PricingComparisonTable } from "./pricing-comparison-table";
import { PricingHeroPlans } from "./pricing-hero-plans";
import { Button } from "@prisma/eclipse";

export function PricingPageContent() {
  const [currency, setCurrency] = React.useState<Symbol>("USD");

  return (
    <>
      <PricingHeroPlans currency={currency} onCurrencyChange={setCurrency} />

      <div className="my-12 bg-[linear-gradient(180deg,var(--color-background-default)_-177.75%,var(--color-background-ppg)_100%)] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] p-12">
        <div className="web-cta flex gap-3 md:gap-12 items-center mx-auto w-fit lg:p-4 flex-col md:flex-row">
          <h3 className="text-2xl text-foreground-neutral font-sans-display font-bold text-center md:text-left">
            Running <br className="md:block hidden" />
            at scale?
          </h3>
          <div className="content flex flex-col lg:flex-row gap-3 lg:gap-12 items-center md:items-start lg:items-center">
            <p className="max-w-94 w-full text-center md:text-left text-foreground-neutral-weak text-md">
              We do custom terms for high-volume teams —{" "}
              <b>volume discounts, dedicated support, better terms</b>.
            </p>
            <Button asChild variant="ppg" size="2xl">
              <a
                href={
                  "mailto:boch@prisma.io?cc=neubauer@prisma.io&subject=Prisma%20Custom%20Pricing&body=Hi%2C%0A%0AEvaluating%20Prisma%20at%20scale%20%E2%80%94%20interested%20in%20custom%20pricing.%0A%0ACompany%3A%20%0AExpected%20scale%20(queries%20%2F%20DBs%20%2F%20etc)%3A%0A%0AThanks"
                }
              >
                Contact us
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <section className="px-4 py-12">
        <PricingCalculator currency={currency} />
      </section>

      <section className="px-4 py-16">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-6">
          <h3 className="m-0 text-center text-foreground-neutral text-5xl font-sans-display [font-variation-settings:'wght'_900]">
            Compare plans
          </h3>
          <p className="m-0 text-center text-foreground-neutral-weak">
            All of the features below are included with Prisma Postgres.
          </p>
        </div>
        <PricingComparisonTable currency={currency} />
      </section>
    </>
  );
}
