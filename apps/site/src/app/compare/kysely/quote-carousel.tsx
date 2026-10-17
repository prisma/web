"use client";

import { Children, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CONTROL =
  "inline-flex size-9 items-center justify-center rounded-full border border-black/[0.08] text-foreground outline-none transition-colors hover:bg-black/[0.04] focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** One quote at a time. The figures stay in the document so the text is still readable and copyable. */
export function QuoteCarousel({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const go = (direction: -1 | 1) => setIndex((current) => (current + direction + count) % count);

  return (
    <div
      className="rounded-xl border border-black/[0.08] p-6 sm:p-8"
      aria-roledescription="carousel"
      aria-label="Customer quotes"
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full shrink-0"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${count}`}
              aria-hidden={slideIndex === index ? undefined : true}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-5">
        <span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
          {index + 1} / {count}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous quote"
            onClick={() => go(-1)}
            className={CONTROL}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button type="button" aria-label="Next quote" onClick={() => go(1)} className={CONTROL}>
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
