"use client";

import { cn } from "@/lib/cn";
import { TestimonialItem, TestimonialItemType } from "./testimonial-item";

type TestimonialsType = {
  list: Array<TestimonialItemType>;
  noShadow?: boolean;
  mask?: string;
  color?: string;
};

const TESTIMONIALS_PER_COLUMN = 3;
const MAX_COLUMNS = 3;

const getShuffledTestimonials = (list: TestimonialItemType[]) =>
  [...list]
    .map((testimonial) => {
      const key = [
        testimonial.author,
        testimonial.company,
        testimonial.title,
      ].join("|");
      const score = Array.from(key).reduce(
        (hash, char) => (hash * 31 + char.charCodeAt(0)) % 2147483647,
        7,
      );

      return { testimonial, score };
    })
    .sort((a, b) => a.score - b.score)
    .map(({ testimonial }) => testimonial);

const Testimonials = ({ color, list, noShadow, mask }: TestimonialsType) => {
  const visibleTestimonials = getShuffledTestimonials(list).slice(
    0,
    TESTIMONIALS_PER_COLUMN * MAX_COLUMNS,
  );

  const gridClasses = cn(
    "relative max-w-full columns-1 gap-4 md:columns-2 lg:columns-3",
    !noShadow &&
      "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[30%] before:pointer-events-none before:z-[1] before:bg-gradient-to-b before:from-[#0B0C17] before:to-[rgba(11,12,23,0)]",
    !noShadow &&
      "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[30%] after:pointer-events-none after:z-[1] after:bg-gradient-to-t after:from-[#1A202B] after:to-[rgba(26,32,43,0)]",
  );

  return (
    <div style={mask ? { maskImage: mask } : {}} data-testid="testimonials">
      <div className={gridClasses}>
        {visibleTestimonials.map((testimonial, idx) => (
          <div
            className="mb-4 break-inside-avoid"
            key={`${testimonial.author}-${testimonial.company}-${idx}`}
          >
            <TestimonialItem color={color} {...testimonial} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
