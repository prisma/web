"use client";

import { trackCTA } from "@prisma-docs/ui/lib/analytics";

/**
 * Site-wide announcement strip for Builder's Day, Prisma's AI developer
 * conference. Sits above the sticky navigation, so it scrolls away with the
 * page. The rainbow band mirrors the event banner's visor stripe; ink text
 * keeps it readable on every stop of the gradient in both themes.
 */
const RAINBOW =
  "linear-gradient(90deg, #7be7f0 0%, #01d7e4 18%, #f3c306 42%, #f37a03 62%, #ff9fa4 82%, #f34a60 100%)";

export function BuildersDayBanner() {
  return (
    <a
      href="https://pris.ly/builders-day"
      target="_blank"
      rel="noreferrer"
      onClick={() =>
        trackCTA({
          cta_text: "Get tickets",
          cta_location: "builders_day_banner",
          cta_destination: "https://pris.ly/builders-day",
        })
      }
      className="group relative flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-[#151515] outline-none focus-visible:outline-2 focus-visible:outline-offset--2 focus-visible:outline-[#151515]"
      style={{ background: RAINBOW }}
    >
      <span className="font-semibold whitespace-nowrap">Builder&apos;s Day</span>
      <span className="hidden sm:inline">
        — Prisma&apos;s AI developer conference · October 26 · San Francisco
      </span>
      <span className="inline sm:hidden">· October 26 · SF</span>
      <span className="ml-1 shrink-0 rounded-full bg-[#151515] px-3 py-0.5 text-xs font-semibold text-white transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none">
        Get tickets
      </span>
    </a>
  );
}
