"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@prisma-docs/ui/lib/cn";
import { PrismRay } from "@/components/chrome/prism-ray";

export interface BannerSlide {
  title: string;
  description: string;
  href: string;
  /** Accent for the badge and link: ORM amber or platform cyan. */
  gradient?: "orm" | "ppg";
  badge?: string;
  /** Link label; defaults to "Read more". */
  cta?: string;
}

interface SidebarBannerCarouselProps {
  slides: BannerSlide[];
}

const DISMISSED_KEY = "sidebar-banner-dismissed-ids";

export function SidebarBannerCarousel({ slides }: SidebarBannerCarouselProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [dismissingHref, setDismissingHref] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
      setDismissedIds(new Set(stored));
    } catch {
      /* empty */
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const visibleSlides = slides.filter(
    (s) => !dismissedIds.has(s.href) && s.href !== dismissingHref,
  );

  if (visibleSlides.length === 0) return null;

  const peekCount = Math.min(visibleSlides.length - 1, 3);

  function handleDismiss(e: React.MouseEvent, href: string) {
    e.preventDefault();
    e.stopPropagation();
    setDismissingHref(href);
    setTimeout(() => {
      setDismissedIds((prev) => {
        const next = new Set(prev);
        next.add(href);
        localStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]));
        return next;
      });
      setDismissingHref(null);
    }, 300);
  }

  const front = visibleSlides[0];
  const isPpg = front.gradient === "ppg";

  // Peek cards rendered furthest-back first so DOM order = visual stacking
  const peekCards = visibleSlides.slice(1, 4).map((_, idx, arr) => {
    // i=1 is closest to front, i=peekCount is furthest back
    const i = arr.length - idx;
    const inset = i * 4;
    return (
      <div
        key={`peek-${i}`}
        className="border border-stroke-neutral bg-background-default shadow-drop-low transition-all duration-300 ease-out"
        aria-hidden
        style={{
          height: hovered ? 10 : 7,
          marginLeft: inset,
          marginRight: inset,
          borderRadius: "var(--radius-square-high) var(--radius-square-high) 0 0",
          borderBottom: "none",
          opacity: hovered ? 0.4 + (arr.length - i) * 0.15 : 0.25 + (arr.length - i) * 0.1,
        }}
      />
    );
  });

  return (
    <div
      className="hidden lg:flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Peek cards above — each one narrower, creating depth perspective */}
      {peekCount > 0 && <div className="flex flex-col -mb-px">{peekCards}</div>}

      {/* Front card. The card is the artwork: a brand-tinted panel (card-wash
          flips with the theme: cyan-tinted paper in light, cyan-tinted ink in
          dark) with the always-on spectrum ring and the triple-band ray
          crossing the top corner behind the copy. No raster, so it never
          fights the theme it sits in. */}
      <Link
        href={front.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "spectrum-border spectrum-border-on group relative block overflow-hidden rounded-square-high",
          "bg-card-wash shadow-drop-low transition-shadow hover:shadow-drop",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-ppg",
        )}
      >
        <PrismRay
          intensity="structural"
          mask="start"
          className="-right-24 top-4 h-7 w-72 transition-opacity duration-300 group-hover:opacity-90"
        />
        <PrismRay
          intensity="whisper"
          mask="both"
          className="-left-16 bottom-3 h-4 w-64 opacity-25 dark:opacity-40"
        />

        <div className="relative p-3.5">
          <div className="flex items-center justify-between">
            {front.badge ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-circle px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide",
                  isPpg
                    ? "bg-background-ppg-reverse text-foreground-ppg-reverse"
                    : "bg-background-orm-reverse text-foreground-orm-reverse",
                )}
              >
                {front.badge}
              </span>
            ) : (
              <span />
            )}
            <button
              type="button"
              aria-label="Dismiss"
              onClick={(e) => handleDismiss(e, front.href)}
              className="-m-1 rounded-circle p-1 text-foreground-neutral-weaker transition-colors hover:bg-background-neutral-strong hover:text-foreground-neutral"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                className="size-3.5"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>

          <h3 className="mt-3 font-sans-display text-[15px] font-medium leading-snug text-foreground-neutral">
            {front.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground-neutral-weak">
            {front.description}
          </p>

          <span
            className={cn(
              "mt-3 inline-flex items-center gap-1 text-xs font-medium transition-colors",
              isPpg
                ? "text-foreground-ppg group-hover:text-foreground-ppg-strong"
                : "text-foreground-orm group-hover:text-foreground-orm-strong",
            )}
          >
            {front.cta ?? "Read more"}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </div>
      </Link>
    </div>
  );
}
