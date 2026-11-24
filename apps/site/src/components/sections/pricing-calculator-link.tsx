"use client";

import { useEffect } from "react";

const CALCULATOR = "/pricing/calculator";

// The calculator has its own page (client, 2026-11-24). /pricing links to it
// from the footer line under the plans ("Estimate your bill"); this component
// only keeps old links working and renders nothing visible:
//  - estimates shared before the move are links like
//    /pricing?app=api&requests=… (the calculator kept its state in the page
//    address); those open the calculator page with the same query
//  - an empty #estimate anchor, so old "#estimate" links still land by the
//    plans rather than at the top of the page
export function PricingCalculatorLink() {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (["app", "requests", "ops", "storage", "plan"].some((k) => q.has(k))) {
      window.location.replace(`${CALCULATOR}?${q.toString()}`);
    }
  }, []);

  return <span id="estimate" aria-hidden className="block scroll-mt-24" />;
}
