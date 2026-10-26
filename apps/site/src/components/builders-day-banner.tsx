"use client";

import { useEffect, useRef, useState } from "react";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";
import { observeAnimationActivity } from "@/lib/animation-activity";

// Dismissal persists in localStorage; the inline script hides the banner
// before hydration (same pattern as fumadocs' Banner in the docs app), so a
// returning visitor never sees it flash in.
// New key for the on-demand release, so visitors who dismissed the ticket
// banner still hear that the talks are out.
const DISMISS_KEY = "builders-day-on-demand-banner-dismissed";
const DISMISS_CLASS = "builders-day-banner-dismissed";
const BANNER_HREF =
  "https://builders.day/stream?utm_source=prisma.io&utm_medium=banner&utm_campaign=builders-day-on-demand";

/**
 * Site-wide announcement strip for Builder's Day, Prisma's AI developer
 * conference, now a collection of prerecorded talks. Sits above the sticky
 * navigation, so it scrolls away with the page.
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
  const bannerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === "true") setOpen(false);
  }, []);

  // The three gradient sweeps repaint every frame and the banner scrolls away
  // with the page, so pause them while it is out of view (see global.css).
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    return observeAnimationActivity(banner, (active) =>
      banner.toggleAttribute("data-paused", !active),
    );
  }, [open]);

  if (!open) return null;

  return (
    <div className="builders-day-banner-wrap relative">
      <style>{`.${DISMISS_CLASS} .builders-day-banner-wrap { display: none; }`}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `if (localStorage.getItem('${DISMISS_KEY}') === 'true') document.documentElement.classList.add('${DISMISS_CLASS}');`,
        }}
      />
      <a
        ref={bannerRef}
        id="builders-day-banner"
        href={BANNER_HREF}
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          trackCTA({
            cta_text: "Watch the talks",
            cta_location: "builders_day_banner",
            cta_destination: BANNER_HREF,
          })
        }
        className="builders-day-banner relative flex items-center justify-center py-2.5 pl-4 pr-10 text-xs outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:text-sm"
      >
        <span className="builders-day-banner-content flex items-center justify-center gap-2.5">
          <span className="font-semibold whitespace-nowrap">Builder&apos;s Day</span>
          <span className="hidden text-white/70 md:inline">
            Talks on building AI agents in production, free to watch on demand
          </span>
          <span className="inline whitespace-nowrap text-white/70 md:hidden">Free, on demand</span>
          <span className="builders-day-banner-cta shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold">
            Watch the talks
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
          localStorage.setItem(DISMISS_KEY, "true");
        }}
        className="absolute top-1/2 right-2 z-[2] -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
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
