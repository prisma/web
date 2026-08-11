"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";
import { BurstFill } from "@/components/brand/burst-fill";
import { cn } from "@/lib/utils";

const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// Console-bound CTAs record the cta_click GTM event (GA4 + Google Ads import),
// matching the pre-rebrand ConsoleCtaButton so the conversion series survives
// the redesign. Fires only for console.prisma.io destinations; UTM decoration
// is handled separately by the document-level UtmPersistence listener.
function trackConsoleCta(href: string | undefined, label: React.ReactNode, location?: string) {
  if (!href || !href.includes("console.prisma.io")) return;
  trackCTA({
    cta_text: typeof label === "string" ? label : new URL(href).pathname.replace("/", ""),
    cta_location: location ?? "cta",
    cta_destination: href,
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
  /**
   * `lg` is for page heroes. The navbar's Get Started is the same black pill at
   * 109x36, so a default-size hero CTA reads as a repeat of it rather than as
   * the page's action — client review flagged exactly that.
   */
  size?: "default" | "lg";
};

const SIZES = {
  default: "px-6 py-3 text-[16px]",
  lg: "px-8 py-4 text-[17px]",
} as const;

// The outline pill gives a pixel of padding back to its border on each axis, so
// its box matches the filled pill's at the same size.
const OUTLINE_SIZES = {
  default: "px-[22px] py-[11px] text-[16px]",
  lg: "px-[30px] py-[15px] text-[17px]",
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
}: PrismButtonProps) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const burstOn = hover && !reduce;
  const MotionComp = href ? motion.a : motion.button;

  return (
    <span
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
            reduce ? { x: "0%", scaleY: 1 } : { x: ["0%", "-58%", "0%"], scaleY: hover ? 1.18 : 1 }
          }
          transition={{
            x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: 0.35, ease: "easeOut" },
          }}
        />
      </span>
      {/* hover bloom */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full blur-[10px]"
        style={{ backgroundImage: SPECTRUM }}
        initial={{ opacity: 0 }}
        animate={{ opacity: burstOn ? 0.7 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* button */}
      <MotionComp
        href={href}
        type={href ? undefined : type}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          trackConsoleCta(href, children, ctaLocation);
          onClick?.(event);
        }}
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full bg-black cursor-pointer",
          SIZES[size],
          fullWidth && "w-full",
        )}
        animate={{ scale: burstOn ? 1.04 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        {/* prismatic burst — erupts from the centre via an expanding radial reveal */}
        <BurstFill on={burstOn} />

        <span className="relative z-10 whitespace-nowrap font-semibold leading-[1.5] text-white">
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
}: PrismButtonProps) {
  const Comp = href ? "a" : "button";
  return (
    <Comp
      href={href}
      type={href ? undefined : type}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        trackConsoleCta(href, children, ctaLocation);
        onClick?.(event);
      }}
      className={cn(
        "spectrum-border flex items-center justify-center rounded-full border border-[#646567] cursor-pointer transition-colors duration-500 hover:border-transparent",
        OUTLINE_SIZES[size],
        className,
      )}
    >
      <span className="whitespace-nowrap font-semibold leading-[1.5] text-foreground">
        {children}
      </span>
    </Comp>
  );
}
