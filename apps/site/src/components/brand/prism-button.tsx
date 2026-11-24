"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";
import { BurstFill } from "@/components/brand/burst-fill";
import { observeAnimationActivity } from "@/lib/animation-activity";
import { cn } from "@/lib/utils";

const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// Fast-out curve shared by the hover effects: quick to arrive, soft to settle.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const CONSOLE_HOST = "console.prisma.io";

/**
 * Resolves an href to the console URL it points at, or null.
 *
 * Matches on the parsed hostname, not a substring: `includes("console.prisma.io")`
 * also matches `https://evil.com/?next=console.prisma.io` and
 * `https://console.prisma.io.evil.com`, which would fire the conversion event on
 * a non-console link and pollute the GA4/Ads series this tracking exists to keep.
 * The base makes relative hrefs parse instead of throwing; they resolve to the
 * site's own host and are correctly rejected.
 */
function consoleDestination(href: string | undefined): URL | null {
  if (!href) return null;
  try {
    const url = new URL(href, "https://www.prisma.io");
    return url.hostname === CONSOLE_HOST ? url : null;
  } catch {
    return null;
  }
}

// Console-bound CTAs record the cta_click GTM event (GA4 + Google Ads import),
// matching the pre-rebrand ConsoleCtaButton so the conversion series survives
// the redesign. UTM decoration is handled separately by the document-level
// UtmPersistence listener.
function trackConsoleCta(href: string | undefined, label: React.ReactNode, location?: string) {
  const url = consoleDestination(href);
  if (!url) return;
  trackCTA({
    cta_text: typeof label === "string" ? label : url.pathname.replace("/", ""),
    cta_location: location ?? "cta",
    cta_destination: url.toString(),
    section: "website",
  });
}

type PrismButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: "button" | "submit";
  /** Stretch to the container's width — for card CTAs. Default is intrinsic. */
  fullWidth?: boolean;
  /** Where the CTA lives, for cta_click analytics (e.g. "hero", "navbar"). */
  ctaLocation?: string;
  /** Only used when `href` is set. Compare pages open create-db in a new tab. */
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  /**
   * `lg` is for page heroes. The navbar's Get Started is the same black pill at
   * 109x36, so a default-size hero CTA reads as a repeat of it rather than as
   * the page's action — client review flagged exactly that.
   */
  size?: "default" | "lg" | "sm";
};

// `sm` is for dense layouts where the button sits among data, like the
// pricing table's plan columns: a 36px pill that doesn't outweigh the numbers.
const SIZES = {
  default: "px-6 py-3 text-[16px]",
  lg: "px-8 py-4 text-[17px]",
  sm: "px-[18px] py-[7px] text-[14px]",
} as const;

// The outline pill gives a pixel of padding back to its border on each axis, so
// its box matches the filled pill's at the same size.
const OUTLINE_SIZES = {
  default: "px-[22px] py-[11px] text-[16px]",
  lg: "px-[30px] py-[15px] text-[17px]",
  sm: "px-[17px] py-[6px] text-[14px]",
} as const;

// The brand's primary CTA, ported from the approved stylescape: a living
// spectrum glow that drifts at rest, and a prismatic burst that fills the
// button on hover. Reduced-motion safe.
export function PrismButton({
  children,
  className,
  href,
  onClick,
  type = "button",
  fullWidth = false,
  ctaLocation,
  size = "default",
  target,
  rel,
}: PrismButtonProps) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const burstOn = hover && !reduce;
  const MotionComp = href ? motion.a : motion.button;

  // The resting drift is a blurred layer re-composited every frame for as
  // long as the button exists, so it only runs while the button is on screen
  // (every PrismButton on a page was drifting, in view or not).
  const rootRef = useRef<HTMLSpanElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeAnimationActivity(root, setOnScreen);
  }, []);
  const drift = onScreen && !reduce;

  return (
    <span
      ref={rootRef}
      className={cn("relative inline-flex items-center", fullWidth && "w-full", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* spectrum glow */}
      <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full blur-[3.2px]">
        <motion.span
          className="absolute inset-y-0 block w-[240%]"
          style={{ backgroundImage: SPECTRUM }}
          animate={
            drift ? { x: ["0%", "-58%", "0%"], scaleY: hover ? 1.18 : 1 } : { x: "0%", scaleY: 1 }
          }
          transition={{
            // The settle-back must not inherit the loop's repeat, or parking
            // the glow would itself become an endless 7s tween.
            x: drift
              ? { duration: 7, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.6, ease: "easeOut" },
            scaleY: { duration: 0.2, ease: "easeOut" },
          }}
        />
      </span>
      {/* hover bloom */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full blur-[10px]"
        style={{ backgroundImage: SPECTRUM }}
        initial={{ opacity: 0 }}
        animate={{ opacity: burstOn ? 0.5 : 0 }}
        transition={{ duration: burstOn ? 0.15 : 0.25, ease: EASE_OUT }}
      />

      {/* button */}
      <MotionComp
        href={href}
        target={href ? target : undefined}
        rel={href ? rel : undefined}
        type={href ? undefined : type}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          trackConsoleCta(href, children, ctaLocation);
          onClick?.(event);
        }}
        className={cn(
          // Depth: a hairline of light along the top inside edge and a soft
          // shadow beneath, so the pill reads as an object, not a flat shape.
          "relative flex items-center justify-center overflow-hidden rounded-full bg-black cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.45)]",
          SIZES[size],
          fullWidth && "w-full",
        )}
        // A barely-there lift on hover and a press on click, on a firm
        // spring (was a 4% grow on a bouncy one, which read as playful).
        animate={{ scale: burstOn ? 1.015 : 1 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
      >
        {/* prismatic burst — erupts from the centre via an expanding radial reveal */}
        <BurstFill on={burstOn} />

        {/* inline-flex nowrap keeps a label icon on the label's line. Preflight
            sets svg { display: block }, which stacks the icon above the text
            whenever this span is not a flex box, so the icon is forced back
            to an inline-block that cannot grow the pill past its size. */}
        <span className="inline-flex items-center gap-2 flex-nowrap whitespace-nowrap font-semibold leading-[1.5] text-white [&_svg]:inline-block [&_svg]:shrink-0">
          {children}
        </span>
      </MotionComp>
    </span>
  );
}

// Secondary pill from the stylescape: thin neutral border that reveals the
// moving spectrum gradient on hover.
export function PrismButtonOutline({
  children,
  className,
  href,
  onClick,
  type = "button",
  ctaLocation,
  size = "default",
  target,
  rel,
}: PrismButtonProps) {
  const Comp = href ? "a" : "button";
  return (
    <Comp
      href={href}
      target={href ? target : undefined}
      rel={href ? rel : undefined}
      type={href ? undefined : type}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        trackConsoleCta(href, children, ctaLocation);
        onClick?.(event);
      }}
      className={cn(
        // Effects arrive fast and leave a little slower (150ms in, 250ms
        // out), and the pill presses in on click.
        "spectrum-border flex items-center justify-center rounded-full border border-[#646567] cursor-pointer transition-[border-color,transform] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-transparent hover:duration-150 active:scale-[0.98] active:duration-75 motion-reduce:active:scale-100",
        OUTLINE_SIZES[size],
        className,
      )}
    >
      {/* Same row treatment as the filled pill's label. */}
      <span className="inline-flex items-center gap-2 flex-nowrap whitespace-nowrap font-semibold leading-[1.5] text-foreground [&_svg]:inline-block [&_svg]:shrink-0">
        {children}
      </span>
    </Comp>
  );
}

// The same pill with no chrome: no spectrum glow, no burst, no depth shadow,
// no spectrum ring on hover. For dense layouts where a row of glowing pills
// would compete with the content, like the pricing table's plan columns
// (client, 2026-11-24: "remove the chrome from the buttons"). `solid` is the
// recommended action, `outline` the rest. Tracks cta_click like the others.
export function PrismButtonPlain({
  children,
  className,
  href,
  onClick,
  type = "button",
  ctaLocation,
  size = "default",
  fullWidth = false,
  target,
  rel,
  variant = "outline",
}: PrismButtonProps & { variant?: "solid" | "outline" }) {
  const Comp = href ? "a" : "button";
  return (
    <Comp
      href={href}
      target={href ? target : undefined}
      rel={href ? rel : undefined}
      type={href ? undefined : type}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        trackConsoleCta(href, children, ctaLocation);
        onClick?.(event);
      }}
      className={cn(
        "flex items-center justify-center rounded-full border cursor-pointer outline-none transition-[background-color,border-color,transform] duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98] active:duration-75 motion-reduce:active:scale-100",
        variant === "solid"
          ? "border-foreground bg-foreground text-white hover:border-foreground/85 hover:bg-foreground/85"
          : "border-black/[0.14] bg-white text-foreground hover:border-black/[0.3] hover:bg-black/[0.02]",
        OUTLINE_SIZES[size],
        fullWidth && "w-full",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 flex-nowrap whitespace-nowrap font-medium leading-[1.5] [&_svg]:inline-block [&_svg]:shrink-0">
        {children}
      </span>
    </Comp>
  );
}
