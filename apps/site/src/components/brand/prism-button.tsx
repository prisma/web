"use client";

import { trackCTA } from "@prisma-docs/ui/lib/analytics";
import { Button } from "@/components/ui/button";
import { SiteLink } from "@/components/site-link";
import { cn } from "@/lib/utils";

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

// Shared button behavior keeps every CTA consistent, including keyboard focus.
function BrandButton({
  children,
  className,
  href,
  onClick,
  type = "button",
  fullWidth = false,
  ctaLocation,
  size = "default",
  outline = false,
}: PrismButtonProps & { outline?: boolean }) {
  const classes = cn(
    "h-auto min-h-11",
    outline ? OUTLINE_SIZES[size] : SIZES[size],
    fullWidth && "w-full",
    className,
  );
  const click = (event: React.MouseEvent<HTMLElement>) => {
    trackConsoleCta(href, children, ctaLocation);
    onClick?.(event);
  };
  return href ? (
    <Button asChild variant={outline ? "outline" : "default"} className={classes}>
      <SiteLink href={href} onClick={click}>
        {children}
      </SiteLink>
    </Button>
  ) : (
    <Button
      type={type}
      variant={outline ? "outline" : "default"}
      className={classes}
      onClick={click}
    >
      {children}
    </Button>
  );
}

export function PrismButton(props: PrismButtonProps) {
  return <BrandButton {...props} />;
}
export function PrismButtonOutline(props: PrismButtonProps) {
  return <BrandButton {...props} outline />;
}
