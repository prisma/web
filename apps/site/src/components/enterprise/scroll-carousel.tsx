"use client";

import { useEffect, useRef, useState } from "react";
import { CarouselItem, type EnterpriseCarouselCard } from "./carousel-item";
import { cn } from "@/lib/cn";

interface EnterpriseScrollCarouselProps {
  items: EnterpriseCarouselCard[];
  className?: string;
  color?: "ppg" | "orm";
}

interface NavButtonProps {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  className: string;
}

const NavButton = ({
  direction,
  disabled,
  onClick,
  className,
}: NavButtonProps) => (
  <button
    type="button"
    aria-label={`Scroll carousel ${direction}`}
    aria-disabled={disabled}
    disabled={disabled}
    onClick={onClick}
    className={cn(className, disabled && "cursor-not-allowed opacity-40")}
  >
    <i
      className={cn(
        "fa-regular",
        direction === "left" ? "fa-chevron-left" : "fa-chevron-right",
      )}
      aria-hidden="true"
    />
  </button>
);

export const EnterpriseScrollCarousel = ({
  items,
  className,
  color,
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
    const carouselItems = container?.querySelectorAll<HTMLElement>(
      "[data-carousel-item]",
    );

    if (!container || !carouselItems?.length) {
      return;
    }

    if ((direction === -1 && isAtStart) || (direction === 1 && isAtEnd)) {
      return;
    }

    const itemList = Array.from(carouselItems);
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
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateScrollBounds())
        : null;

    if (!container) {
      resizeObserver?.disconnect();
      return;
    }

    updateScrollBounds();

    container.addEventListener("scroll", updateScrollBounds, { passive: true });
    window.addEventListener("resize", updateScrollBounds);
    resizeObserver?.observe(container);
    Array.from(container.children).forEach((child) =>
      resizeObserver?.observe(child),
    );

    return () => {
      container.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <NavButton
        direction="left"
        disabled={isAtStart}
        onClick={() => scrollByItem(-1)}
        className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur md:flex"
      />
      <NavButton
        direction="right"
        disabled={isAtEnd}
        onClick={() => scrollByItem(1)}
        className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur md:flex"
      />

      <div className="overflow-hidden md:mx-16">
        <div
          ref={scrollRef}
          className="overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Enterprise carousel"
        >
          <div className="grid grid-flow-col auto-cols-[100%] gap-4 sm:auto-cols-[calc((100%-2rem)/3)]">
            {items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                data-carousel-item
                className="min-w-0 snap-start"
              >
                <CarouselItem
                  card={item}
                  className="min-h-full"
                  color={color}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
        <NavButton
          direction="left"
          disabled={isAtStart}
          onClick={() => scrollByItem(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur"
        />
        <NavButton
          direction="right"
          disabled={isAtEnd}
          onClick={() => scrollByItem(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-background-default/90 text-foreground-neutral shadow-sm backdrop-blur"
        />
      </div>
    </div>
  );
};
