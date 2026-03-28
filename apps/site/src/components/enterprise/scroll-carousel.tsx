"use client";

import { useEffect, useRef, useState } from "react";
import { CarouselItem, type EnterpriseCarouselCard } from "./carousel-item";
import { cn } from "@/lib/cn";

interface EnterpriseScrollCarouselProps {
  items: EnterpriseCarouselCard[];
  className?: string;
}

export const EnterpriseScrollCarousel = ({
  items,
  className,
}: EnterpriseScrollCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const updateScrollBounds = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const maxScrollLeft = Math.max(
      0,
      container.scrollWidth - container.clientWidth,
    );
    const tolerance = 8;

    setIsAtStart(container.scrollLeft <= tolerance);
    setIsAtEnd(container.scrollLeft >= maxScrollLeft - tolerance);
  };

  const scrollByItem = (direction: -1 | 1) => {
    const container = scrollRef.current;
    const items = container?.querySelectorAll<HTMLElement>("[data-carousel-item]");

    if (!container || !items?.length) {
      return;
    }

    if ((direction === -1 && isAtStart) || (direction === 1 && isAtEnd)) {
      return;
    }

    const itemList = Array.from(items);
    const currentScroll = container.scrollLeft;
    const currentIndex = itemList.reduce((closestIndex, item, index) => {
      const currentDistance = Math.abs(item.offsetLeft - currentScroll);
      const closestDistance = Math.abs(
        itemList[closestIndex].offsetLeft - currentScroll,
      );

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    const targetIndex = Math.max(
      0,
      Math.min(itemList.length - 1, currentIndex + direction),
    );

    container.scrollTo({
      left: itemList[targetIndex].offsetLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    updateScrollBounds();

    container.addEventListener("scroll", updateScrollBounds, { passive: true });
    window.addEventListener("resize", updateScrollBounds);

    return () => {
      container.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Scroll carousel left"
        aria-disabled={isAtStart}
        disabled={isAtStart}
        onClick={() => scrollByItem(-1)}
        className={cn(
          "absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur md:flex",
          isAtStart && "cursor-not-allowed opacity-40",
        )}
      >
        <i className="fa-regular fa-chevron-left" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Scroll carousel right"
        aria-disabled={isAtEnd}
        disabled={isAtEnd}
        onClick={() => scrollByItem(1)}
        className={cn(
          "absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur md:flex",
          isAtEnd && "cursor-not-allowed opacity-40",
        )}
      >
        <i className="fa-regular fa-chevron-right" aria-hidden="true" />
      </button>

      <div className="overflow-hidden md:mx-16">
        <div
          ref={scrollRef}
          className="overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Enterprise carousel"
        >
          <div className="flex gap-4">
            {items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                data-carousel-item
                className="min-w-0 shrink-0 snap-start basis-[calc((100%-2rem)/3)]"
              >
                <CarouselItem card={item} className="min-h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
        <button
          type="button"
          aria-label="Scroll carousel left"
          aria-disabled={isAtStart}
          disabled={isAtStart}
          onClick={() => scrollByItem(-1)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur",
            isAtStart && "cursor-not-allowed opacity-40",
          )}
        >
          <i className="fa-regular fa-chevron-left" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Scroll carousel right"
          aria-disabled={isAtEnd}
          disabled={isAtEnd}
          onClick={() => scrollByItem(1)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur",
            isAtEnd && "cursor-not-allowed opacity-40",
          )}
        >
          <i className="fa-regular fa-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
