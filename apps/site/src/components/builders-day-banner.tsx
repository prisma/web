"use client";

import { trackCTA } from "@prisma-docs/ui/lib/analytics";

/**
 * Site-wide announcement strip for Builder's Day, Prisma's AI developer
 * conference. Sits above the sticky navigation, so it scrolls away with the
 * page.
 *
 * Styled after the docs app's Prisma Next banner (`prisma-next-banner` in
 * apps/docs global.css): dark ink base with color glows pooling at each end,
 * a light sweep travelling along the prism-stripe bottom edge, and a faint
 * diagonal grid shimmer — here retuned to the event's rainbow (cyan → yellow
 * → orange → coral). All layers live in global.css; motion is disabled under
 * prefers-reduced-motion.
 */
export function BuildersDayBanner() {
  return (
    <a
      id="builders-day-banner"
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
      className="builders-day-banner relative flex items-center justify-center px-4 py-2.5 text-xs outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:text-sm"
    >
      <span className="builders-day-banner-content flex items-center justify-center gap-2.5">
        <span className="font-semibold whitespace-nowrap">Builder&apos;s Day</span>
        <span className="hidden text-white/70 md:inline">
          Prisma&apos;s AI developer conference · October 26 · San Francisco
        </span>
        <span className="inline whitespace-nowrap text-white/70 md:hidden">October 26 · SF</span>
        <span className="builders-day-banner-cta shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold">
          Get tickets
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>
    </a>
  );
}
