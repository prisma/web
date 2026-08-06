"use client";

import { Button } from "@prisma/eclipse";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";

const CTA_HREF = "https://pris.ly/pdp?utm_source=blog&utm_medium=blog_cta&utm_campaign=blog_post";

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
 */
export const BlogCTA = () => {
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
            Build your next app with Prisma
          </h3>
          <p className="m-0 max-w-md text-foreground-neutral-weak">
            Start free. Scale when you&rsquo;re ready.
          </p>
        </div>
        <Button asChild variant="ink" size="2xl">
          <a
            href={CTA_HREF}
            onClick={() =>
              trackCTA({
                cta_text: "Try Prisma",
                cta_location: "blog_post_footer",
                cta_destination: CTA_HREF,
                section: "blog",
              })
            }
          >
            <span>Try Prisma</span>
            <i className="fa-regular fa-arrow-right" aria-hidden />
          </a>
        </Button>
      </div>
    </div>
  );
};
