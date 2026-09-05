"use client";

import { useEffect, useState } from "react";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";

// Dismissal persists in localStorage; the inline script hides the banner
// before hydration (same pattern as fumadocs' Banner in the docs app), so a
// returning visitor never sees it flash in.
const DISMISS_KEY = "builders-day-banner-dismissed";
const DISMISS_CLASS = "builders-day-banner-dismissed";

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
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "true") setOpen(false);
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
  }, []);

  if (!open) return null;

  return (
    <div className="builders-day-banner-wrap relative">
      <style>{`.${DISMISS_CLASS} .builders-day-banner-wrap { display: none; }`}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `try { if (localStorage.getItem('${DISMISS_KEY}') === 'true') document.documentElement.classList.add('${DISMISS_CLASS}'); } catch {}`,
        }}
      />
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
        className="builders-day-banner relative flex items-center justify-center py-2.5 pl-4 pr-10 text-xs outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:text-sm"
      >
        <span className="builders-day-banner-content flex items-center justify-center gap-2.5 max-sm:flex-wrap">
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
      <button
        type="button"
        aria-label="Dismiss banner"
        onClick={() => {
          setOpen(false);
          try {
            localStorage.setItem(DISMISS_KEY, "true");
          } catch {
            /* Dismiss still works without storage. */
          }
        }}
        className="absolute top-1/2 right-2 z-[2] -translate-y-1/2 cursor-pointer flex size-9 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
