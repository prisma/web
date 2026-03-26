"use client";

import { cn } from "@/lib/cn";
import { memo } from "react";
import { TestimonialItem, TestimonialItemType } from "./testimonial-item";

type TestimonialsType = {
  list: Array<TestimonialItemType>;
  noShadow?: boolean;
  mask?: string;
  color?: string;
};

type TestimonialColProps = {
  list: TestimonialItemType[];
  reverse?: boolean;
  color?: string;
};

const MemoizedTestimonialItem = memo(TestimonialItem);

const getColumnSlices = (list: TestimonialItemType[]) => {
  const third = Math.ceil(list.length / 3);
  return [
    list.slice(0, third),
    list.slice(third, third * 2),
    list.slice(third * 2),
  ];
};

const TestimonialCol = ({ color, list, reverse }: TestimonialColProps) => (
  <div className="relative flex flex-row items-center overflow-hidden w-full min-h-[680px] max-w-[1200px] mx-auto h-[100px] hover:![animation-duration:0s]">
    <div
      className={cn(
        "mx-auto flex-shrink-0 w-full absolute min-w-full flex flex-col",
        reverse
          ? "animate-slide-up md:hover:paused"
          : "animate-slide-down md:hover:paused",
      )}
    >
      {list.map((testimonial: TestimonialItemType, idx) => (
        <MemoizedTestimonialItem
          color={color}
          key={`testimonial-rst-${idx}`}
          {...testimonial}
        />
      ))}
      {list.map((testimonial: TestimonialItemType, idx) => (
        <MemoizedTestimonialItem
          color={color}
          key={`testimonial-rst-dup-${idx}`}
          {...testimonial}
        />
      ))}
    </div>
    <div
      className={cn(
        "mx-auto flex-shrink-0 w-full absolute min-w-full flex flex-col",
        reverse
          ? "animate-slide-up-2 md:hover:paused translate-y-1/2"
          : "animate-slide-down-2 md:hover:paused -translate-y-1/2",
      )}
    >
      {list.map((testimonial: TestimonialItemType, idx) => (
        <MemoizedTestimonialItem
          color={color}
          key={`testimonial-nd-${idx}`}
          {...testimonial}
        />
      ))}
      {list.map((testimonial: TestimonialItemType, idx) => (
        <MemoizedTestimonialItem
          color={color}
          key={`testimonial-nd-dup-${idx}`}
          {...testimonial}
        />
      ))}
    </div>
  </div>
);

const getTabletSlices = (list: TestimonialItemType[]) => {
  const half = Math.ceil(list.length / 2);
  return [list.slice(0, half), list.slice(half)];
};

const Testimonials = ({ color, list, noShadow, mask }: TestimonialsType) => {
  const [col1, col2, col3] = getColumnSlices(list);
  const [tabletCol1, tabletCol2] = getTabletSlices(list);

  const gridClasses = cn(
    "grid max-w-full gap-4 relative",
    !noShadow &&
      "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[30%] before:pointer-events-none before:z-[1] before:bg-gradient-to-b before:from-[#0B0C17] before:to-[rgba(11,12,23,0)]",
    !noShadow &&
      "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[30%] after:pointer-events-none after:z-[1] after:bg-gradient-to-t after:from-[#1A202B] after:to-[rgba(26,32,43,0)]",
  );

  return (
    <div style={mask ? { maskImage: mask } : {}} data-testid="testimonials">
      {/* Mobile */}
      <div className={cn(gridClasses, "grid-cols-1 md:hidden")}>
        <TestimonialCol color={color} reverse list={list} />
      </div>

      {/* Tablet */}
      <div
        className={cn(
          gridClasses,
          "hidden md:grid lg:hidden grid-cols-2",
          "[&>*:nth-child(2)]:flex [&>*]:flex-1",
        )}
      >
        <TestimonialCol color={color} reverse list={tabletCol1} />
        <TestimonialCol color={color} list={tabletCol2} />
      </div>

      {/* Desktop */}
      <div
        className={cn(
          gridClasses,
          "hidden lg:grid grid-cols-3",
          "[&>*:nth-child(2)]:flex [&>*:nth-child(3)]:flex [&>*]:flex-1",
        )}
      >
        <TestimonialCol color={color} reverse list={col1} />
        <TestimonialCol color={color} list={col2} />
        <TestimonialCol color={color} reverse list={col3} />
      </div>
    </div>
  );
};

export default Testimonials;
