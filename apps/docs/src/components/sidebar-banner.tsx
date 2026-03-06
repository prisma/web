"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@prisma-docs/ui/lib/cn";

interface BannerSlide {
  title: string;
  description: string;
  href: string;
  gradient?: "orm" | "ppg";
  badge?: string;
  image?: string;
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
          borderRadius: "12px 12px 0 0",
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
      {peekCount > 0 && (
        <div className="flex flex-col -mb-px">{peekCards}</div>
      )}

      {/* Front card */}
      <div
        className={cn(
          "relative rounded-high border border-stroke-neutral overflow-hidden shadow-drop-low",
          "bg-background-default transition-shadow hover:shadow-drop",
        )}
      >
        {/* Title + description */}
        <div className="p-3 pb-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm font-semibold text-foreground-neutral leading-tight">
              {front.title}
            </span>
            {front.badge && (
              <span
                className={cn(
                  "text-2xs font-medium px-1.5 py-0.5 rounded-circle shrink-0",
                  front.gradient === "ppg"
                    ? "bg-background-ppg text-foreground-ppg"
                    : "bg-background-orm text-foreground-orm",
                )}
              >
                {front.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-neutral-weak truncate">{front.description}</p>
        </div>

        {/* Image preview */}
        <div
          className={cn(
            "relative mx-3 mt-2 rounded-square overflow-hidden aspect-video",
            !front.image && (front.gradient === "ppg" ? "bg-gradient-ppg" : "bg-gradient-orm"),
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {front.image ? (
            <img
              src={front.image.startsWith("http") ? front.image : `/docs${front.image}`}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center size-full">
              <svg
                viewBox="0 0 28 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-auto opacity-40"
              >
                <path
                  d="M27.4 8.42L15.52.32a3.2 3.2 0 00-3.36 0L.32 8.42A3.22 3.22 0 000 11.1v16.2a3.22 3.22 0 001.6 2.78l11.88 7.6a3.2 3.2 0 003.36 0l11.56-7.6a3.2 3.2 0 001.6-2.78V11.1a3.22 3.22 0 00-1.6-2.68zM12.16 33.48L2.24 27.18a1.6 1.6 0 01-.8-1.38v-7.4l10.72 6.5v8.58zm1.28-10.6L2.28 16.22l5.08-3.16 11.16 6.76-5.08 3.06zm13.12-4.56v7.38a1.6 1.6 0 01-.8 1.38l-9.92 6.3v-8.56l10.72-6.5z"
                  fill="currentColor"
                  className={cn(
                    front.gradient === "ppg"
                      ? "text-foreground-ppg-strong"
                      : "text-foreground-orm-strong",
                  )}
                />
              </svg>
            </div>
          )}
        </div>

        {/* Action bar — appears on hover */}
        <div
          className={cn(
            "flex items-center justify-between px-3 overflow-hidden transition-all duration-300 ease-out",
            hovered ? "max-h-12 opacity-100 py-2.5" : "max-h-0 opacity-0 py-0",
          )}
        >
          <Link
            href={front.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-xs font-medium transition-colors",
              front.gradient === "ppg"
                ? "text-foreground-ppg hover:text-foreground-ppg-strong"
                : "text-foreground-orm hover:text-foreground-orm-strong",
            )}
          >
            Read more
          </Link>
          <button
            type="button"
            onClick={(e) => handleDismiss(e, front.href)}
            className="text-xs text-foreground-neutral-weaker hover:text-foreground-neutral-weak transition-colors"
          >
            Dismiss
          </button>
        </div>

        {/* Bottom padding when action bar is hidden */}
        <div className={cn("transition-all duration-300 ease-out", hovered ? "h-0" : "h-3")} />
      </div>
    </div>
  );
}
