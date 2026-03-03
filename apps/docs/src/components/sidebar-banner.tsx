"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
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
  /** Auto-rotate interval in ms @default 5000 */
  interval?: number;
}

const DISMISSED_KEY = "sidebar-banner-dismissed";

export function SidebarBannerCarousel({ slides, interval = 5000 }: SidebarBannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "true");
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
  }, [slides.length, interval]);

  useEffect(() => {
    if (dismissed || slides.length <= 1) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dismissed, slides.length, resetTimer]);

  if (dismissed || slides.length === 0) return null;

  const slide = slides[current];

  function handleDismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDismiss}
        className={cn(
          "absolute top-2 right-2 z-10 p-0.5 rounded-square",
          "opacity-60 hover:opacity-100 transition-opacity",
          "bg-black/10 dark:bg-white/10",
          slide.image ? "text-foreground-neutral" : "text-foreground-neutral-reverse",
        )}
        aria-label="Dismiss banner"
      >
        <X className="size-3.5" />
      </button>

      <Link
        href={slide.href}
        className={cn(
          "group block rounded-high border border-stroke-neutral overflow-hidden shadow-drop-low",
          "transition-shadow hover:shadow-drop",
        )}
      >
        <div
          className={cn(
            "relative flex items-center justify-center aspect-video overflow-hidden",
            !slide.image && (slide.gradient === "ppg" ? "bg-gradient-ppg" : "bg-gradient-orm"),
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {slide.image ? (
            <img
              src={slide.image.startsWith("http") ? slide.image : `/docs${slide.image}`}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 28 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-auto opacity-40"
            >
              <path
                d="M27.4 8.42L15.52.32a3.2 3.2 0 00-3.36 0L.32 8.42A3.22 3.22 0 000 11.1v16.2a3.22 3.22 0 001.6 2.78l11.88 7.6a3.2 3.2 0 003.36 0l11.56-7.6a3.2 3.2 0 001.6-2.78V11.1a3.22 3.22 0 00-1.6-2.68zM12.16 33.48L2.24 27.18a1.6 1.6 0 01-.8-1.38v-7.4l10.72 6.5v8.58zm1.28-10.6L2.28 16.22l5.08-3.16 11.16 6.76-5.08 3.06zm13.12-4.56v7.38a1.6 1.6 0 01-.8 1.38l-9.92 6.3v-8.56l10.72-6.5z"
                fill="currentColor"
                className={cn(
                  slide.gradient === "ppg"
                    ? "text-foreground-ppg-strong"
                    : "text-foreground-orm-strong",
                )}
              />
            </svg>
          )}
        </div>
        <div className="p-3 bg-background-default">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm font-semibold text-foreground-neutral">{slide.title}</span>
            {slide.badge && (
              <span
                className={cn(
                  "text-2xs font-medium px-1.5 py-0.5 rounded-circle",
                  slide.gradient === "ppg"
                    ? "bg-background-ppg text-foreground-ppg"
                    : "bg-background-orm text-foreground-orm",
                )}
              >
                {slide.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-neutral-weak mb-2">{slide.description}</p>
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                slide.gradient === "ppg"
                  ? "text-foreground-ppg group-hover:text-foreground-ppg-strong"
                  : "text-foreground-orm group-hover:text-foreground-orm-strong",
              )}
            >
              Read more &rarr;
            </span>
            {slides.length > 1 && (
              <div className="flex gap-1">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "size-1.5 rounded-circle transition-colors",
                      i === current ? "bg-foreground-neutral-weak" : "bg-stroke-neutral",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
