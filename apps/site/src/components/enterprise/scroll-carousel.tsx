"use client";

import { useRef } from "react";
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

  const scrollByItem = (direction: -1 | 1) => {
    const container = scrollRef.current;
    const items = container?.querySelectorAll<HTMLElement>("[data-carousel-item]");

    if (!container || !items?.length) {
      return;
    }

    const itemList = Array.from(items);
    const currentScroll = container.scrollLeft;
    const tolerance = 8;

    const currentIndex = itemList.findIndex((item, index) => {
      const start = item.offsetLeft;
      const nextStart = itemList[index + 1]?.offsetLeft ?? Number.POSITIVE_INFINITY;

      return currentScroll >= start - tolerance && currentScroll < nextStart - tolerance;
    });

    const safeCurrentIndex =
      currentIndex === -1
        ? itemList.reduce((closestIndex, item, index) => {
            const currentDistance = Math.abs(item.offsetLeft - currentScroll);
            const closestDistance = Math.abs(
              itemList[closestIndex].offsetLeft - currentScroll,
            );

            return currentDistance < closestDistance ? index : closestIndex;
          }, 0)
        : currentIndex;

    const targetIndex = Math.max(
      0,
      Math.min(itemList.length - 1, safeCurrentIndex + direction),
    );

    container.scrollTo({
      left: itemList[targetIndex].offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Scroll carousel left"
        onClick={() => scrollByItem(-1)}
        className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur md:flex"
      >
        <i className="fa-regular fa-chevron-left" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Scroll carousel right"
        onClick={() => scrollByItem(1)}
        className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur md:flex"
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
            {items.map((item) => (
              <div
                key={item.title}
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
          onClick={() => scrollByItem(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur"
        >
          <i className="fa-regular fa-chevron-left" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Scroll carousel right"
          onClick={() => scrollByItem(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur"
        >
          <i className="fa-regular fa-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
