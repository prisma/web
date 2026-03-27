"use client";

import * as React from "react";
import type { Symbol } from "./pricing-data";
import { PricingCalculator } from "./pricing-calculator";
import { PricingHeroPlans } from "./pricing-hero-plans";

export function PricingPageContent() {
  const [currency, setCurrency] = React.useState<Symbol>("USD");

  return (
    <>
      <PricingHeroPlans currency={currency} onCurrencyChange={setCurrency} />

      <section className="px-4 py-12">
        <PricingCalculator currency={currency} />
      </section>
    </>
  );
}
