"use client";

import { BrandGrain } from "@prisma-docs/ui/components/brand-grain";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";
import { BLOG_PREFIX } from "@/lib/url";
import { DeferredVideo } from "./cta/DeferredVideo";
import { GlassPrismSpin } from "./cta/GlassPrismSpin";

const CTA_LOCATION = "blog_post_footer";

// The blog's own CTA copy (client, 2026-11-25), used when a post sets no
// `cta:` of its own. The panel is the site's; the words stay the blog's.
const DEFAULT_TITLE = "Build your next app with Prisma";
const DEFAULT_DESCRIPTION = "Start free. Scale when you’re ready.";
const DEFAULT_TEXT = "Get started free";
const DEFAULT_HREF = "https://console.prisma.io/sign-up";
const SECONDARY = { text: "See pricing", href: "/pricing" };

// Spectrum bloom behind the glass prisms (same treatment as the site's hero
// corner and closing CTA).
const SPECTRUM =
  "conic-gradient(var(--color-prism-yellow-300), var(--color-prism-red-500) 32%, var(--color-prism-cyan-400) 64%, var(--color-prism-yellow-300))";

export type BlogCTAProps = {
  /** Panel heading; defaults to the blog's brand line. */
  title?: string;
  /** One-line supporting copy under the heading. */
  description?: string;
  /** Primary button label, also sent as `cta_text` on the click event. */
  text?: string;
  /**
   * Console destination. Posts that want campaign attribution pass a
   * `console.prisma.io/sign-up?utm_*` URL here; `/sign-up` and `/login` keep
   * their query string through the Console's auth redirect, the bare `/`
   * does not.
   */
  href?: string;
};

function track(text: string, destination: string) {
  trackCTA({
    cta_text: text,
    cta_location: CTA_LOCATION,
    cta_destination: destination,
    section: "blog",
  });
}

/**
 * The end-of-post conversion panel, built as the site's closing CTA
 * (client, 2026-11-25: "the CTA should use this element"): a card of
 * drifting clouds (the agent-loop photograph, then the looping video once
 * it's near the viewport) holding a frosted glass card with the spectral
 * wash, two slowly turning glass prisms in opposite corners and the brand
 * grain. Scaled down to a banner for the reading column: heading and copy on
 * the left, a filled and an outline pill on the right.
 *
 * A post's `cta:` frontmatter still relabels the heading, description and
 * primary button and points it at a tracked Console URL.
 *
 * Dark mode follows the docs' DeployCallout instead (client, 2026-11-25:
 * "something darker like this"): the cloud frame, video, beams and grain
 * drop out, leaving the docs' card surface with a hairline, a very faint
 * spectral wash along the bottom and one faint glass prism in the top-right
 * corner. The summary line steps up a tone there.
 *
 * Clicks go through `trackCTA`, which pushes `cta_click` to the GTM
 * dataLayer (consent-gated) and dispatches the DOM event the blog's PostHog
 * client turns into `site:cta_clicked`. UtmPersistence rewrites the primary
 * href in a capture listener before React's onClick, so the resolved URL is
 * read from the anchor rather than the prop.
 */
export const BlogCTA = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  text = DEFAULT_TEXT,
  href = DEFAULT_HREF,
}: BlogCTAProps = {}) => {
  return (
    <section
      aria-labelledby="blog-cta-title"
      className="brand-agent-loop @container relative mt-10 overflow-hidden rounded-[1.25rem] border border-stroke-neutral bg-cover bg-center p-2 sm:p-3 dark:rounded-xl dark:border-0 dark:p-0 dark:[background-image:none]!"
    >
      <DeferredVideo
        src={`${BLOG_PREFIX}/brand/cta-clouds-loop.mp4`}
        className="pointer-events-none absolute inset-0 size-full object-cover dark:hidden"
      />
      {/* translucent over the clouds: the video ghosts through the glass */}
      <div className="relative isolate overflow-hidden rounded-xl border border-stroke-neutral bg-[color-mix(in_srgb,var(--color-fd-card)_72%,transparent)] shadow-[0_12px_32px_-14px_rgba(21,21,21,0.18)] backdrop-blur-lg dark:bg-fd-card dark:shadow-none dark:backdrop-blur-none">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* the spectral bottom: wash and beam fan, dispersing upward */}
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2 dark:hidden"
            style={{
              background: [
                "radial-gradient(64% 52% at 26% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 72%)",
                "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 22%, transparent), transparent 66%)",
                "radial-gradient(60% 48% at 76% 100%, color-mix(in srgb, var(--color-prism-red-400) 30%, transparent), transparent 72%)",
              ].join(","),
            }}
          />
          <div className="absolute bottom-[-24rem] left-[16%] h-[60rem] w-52 origin-bottom rotate-[-24deg] bg-prism-cyan-300/50 blur-[96px] dark:hidden" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-40 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/50 blur-[72px] dark:hidden" />
          <div className="absolute bottom-[-28rem] right-[14%] h-[60rem] w-52 origin-bottom rotate-[24deg] bg-prism-red-300/50 blur-[96px] dark:hidden" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-t from-transparent via-white/30 to-white/50 dark:hidden" />

          {/* glass prisms breaking opposite corners, light behind them */}
          <div
            className="absolute bottom-[-4rem] right-[-3rem] h-[10rem] w-[16rem] rounded-full opacity-25 blur-[56px] dark:hidden"
            style={{ backgroundImage: SPECTRUM }}
          />
          <GlassPrismSpin
            shape="hexagon"
            period={21}
            initialAngle={0.9}
            className="bottom-[-2.75rem] right-[-1.75rem] w-[6.5rem] dark:hidden"
          />
          <div
            className="absolute left-[-3.5rem] top-[-2rem] h-[10rem] w-[16rem] rounded-full opacity-20 blur-[48px] dark:hidden"
            style={{ backgroundImage: SPECTRUM }}
          />
          <GlassPrismSpin
            shape="rect"
            period={32}
            initialAngle={2.2}
            className="left-[-2.25rem] top-[-1rem] w-[6.5rem] dark:hidden"
          />

          {/* Dark mode, after the docs' DeployCallout: no clouds, a very
              faint spectral wash along the bottom edge (a surface quality,
              not a glow). The glass prism that sat in the top-right corner
              is gone, so the panel reads clean (client, 2026-11-25). */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background: [
                "radial-gradient(45% 45% at 12% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 8%, transparent), transparent 70%)",
                "radial-gradient(40% 40% at 50% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 6%, transparent), transparent 68%)",
                "radial-gradient(45% 45% at 88% 100%, color-mix(in srgb, var(--color-prism-red-300) 6%, transparent), transparent 70%)",
              ].join(","),
            }}
          />

          <div className="absolute inset-0 overflow-hidden opacity-[0.06] mix-blend-multiply dark:hidden">
            <BrandGrain />
          </div>
        </div>

        {/* Sized for the article column, not a landing page (client,
            2026-11-25: "insanely big, it should be adapted to the page"):
            heading and one line of copy on the left, the two buttons on the
            right from lg up (narrower columns squeeze the heading); stacked below. The site panel's row of
            checks is left out here. */}
        <div className="relative z-10 flex flex-col gap-5 px-6 py-7 sm:px-8 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:gap-8">
          <div className="min-w-0">
            <h2
              id="blog-cta-title"
              className="type-title-3xl m-0 max-w-[24ch] text-balance text-[clamp(1.375rem,1.15rem+0.7vw,1.625rem)]! leading-[1.2]! text-foreground-neutral-strong"
            >
              {title}
            </h2>
            <p className="mt-2 mb-0 max-w-[46ch] text-pretty text-sm leading-relaxed text-foreground-neutral-weak dark:text-foreground-neutral">
              {description}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <a
              href={href}
              data-cta-location={CTA_LOCATION}
              onClick={(event) => track(text, event.currentTarget.href)}
              className="inline-flex h-10 items-center whitespace-nowrap rounded-full bg-background-neutral-reverse-strong px-5 text-sm font-semibold text-foreground-neutral-reverse no-underline shadow-box-low transition-transform duration-150 ease-out hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              {text}
            </a>
            <a
              href={SECONDARY.href}
              data-cta-location={CTA_LOCATION}
              onClick={(event) => track(SECONDARY.text, event.currentTarget.href)}
              className="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-foreground-neutral/30 px-5 text-sm font-semibold text-foreground-neutral-strong no-underline transition-colors duration-150 hover:border-foreground-neutral/60 hover:bg-background-default/60 motion-reduce:transition-none"
            >
              {SECONDARY.text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
