"use client";

import * as React from "react";
import type { Symbol } from "./pricing-data";
import { PricingCalculator } from "./pricing-calculator";
import { PricingComparisonTable } from "./pricing-comparison-table";
import { PricingHeroPlans } from "./pricing-hero-plans";

export function PricingPageContent() {
  const [currency, setCurrency] = React.useState<Symbol>("USD");

  return (
    <>
      <PricingHeroPlans currency={currency} onCurrencyChange={setCurrency} />

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
