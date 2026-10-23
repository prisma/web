"use client";

import { Button } from "@prisma/eclipse";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";

const DEFAULT_HREF = "https://console.prisma.io/sign-up";
const DEFAULT_TITLE = "Build your next app with Prisma";
const DEFAULT_DESCRIPTION = "Start free. Scale when you’re ready.";
const DEFAULT_TEXT = "Try Prisma";
const CTA_LOCATION = "blog_post_footer";

export type BlogCTAProps = {
  /** Panel heading; defaults to the brand line. */
  title?: string;
  /** One-line supporting copy under the heading. */
  description?: string;
  /** Button label, also sent as `cta_text` on the click event. */
  text?: string;
  /**
   * Console destination. Posts that want campaign attribution pass a
   * `console.prisma.io/sign-up?utm_*` URL here; `/sign-up` and `/login` keep
   * their query string through the Console's auth redirect, the bare `/`
   * does not.
   */
  href?: string;
};

/**
 * The end-of-post conversion panel, and the one place in the reading flow
 * where the brand is allowed to be loud.
 *
 * Two moves, borrowed from the marketing site's CTA burst:
 * - `spectrum-border-on` keeps the prism ring lit rather than waiting for a
 *   hover, so the panel reads as a destination instead of a card.
 * - a blurred spectral wash along the bottom edge — cyan, yellow, red in the
 *   gradient's own order — sitting under a paper surface so the saturation
 *   never becomes the surface itself.
 *
 * The wash is a decorative layer with `aria-hidden`; the ring's slide
 * animation carries the utility's own `prefers-reduced-motion` guard.
 *
 * The click goes through `trackCTA`, which pushes `cta_click` to the GTM
 * dataLayer (consent-gated) and dispatches the DOM event the blog's PostHog
 * client turns into `site:cta_clicked`, the same event the marketing site
 * sends for its Console-bound buttons.
 */
export const BlogCTA = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  text = DEFAULT_TEXT,
  href = DEFAULT_HREF,
}: BlogCTAProps = {}) => {
  return (
    <div className="spectrum-border spectrum-border-on relative mb-12 overflow-hidden rounded-square-high border border-transparent bg-paper shadow-box">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-35 blur-2xl dark:opacity-30"
        style={{
          background: [
            "radial-gradient(60% 120% at 25% 100%, var(--color-prism-cyan-400) 0%, transparent 70%)",
            "radial-gradient(45% 120% at 52% 100%, var(--color-prism-yellow-300) 0%, transparent 70%)",
            "radial-gradient(55% 120% at 80% 100%, var(--color-prism-red-500) 0%, transparent 70%)",
          ].join(", "),
        }}
      />
      <div className="relative z-1 flex flex-col items-center gap-6 px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <h3 className="type-title-2xl m-0 text-balance text-foreground-neutral-strong">
            {title}
          </h3>
          <p className="m-0 max-w-md text-foreground-neutral-weak">{description}</p>
        </div>
        <Button asChild variant="ink" size="2xl">
          <a
            href={href}
            data-cta-location={CTA_LOCATION}
            onClick={() =>
              trackCTA({
                cta_text: text,
                cta_location: CTA_LOCATION,
                cta_destination: href,
                section: "blog",
              })
            }
          >
            <span>{text}</span>
            <i className="fa-regular fa-arrow-right" aria-hidden />
          </a>
        </Button>
      </div>
    </div>
  );
};
