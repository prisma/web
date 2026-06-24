"use client";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Marquee } from "@/components/marquee";
import { TestimonialItem } from "./testimonial-item";
import type { TestimonialItemType } from "./testimonial-item";

type TestimonialsType = {
  list: Array<TestimonialItemType>;
  noShadow?: boolean;
  mask?: string;
  color?: string;
};

const Testimonials = ({ color, list, noShadow, mask }: TestimonialsType) => {
  const marqueeClasses = cn(
    "w-full overflow-hidden py-2",
    !noShadow &&
      "before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-[12%] before:pointer-events-none before:z-[1] before:bg-gradient-to-r before:from-[#0B0C17] before:to-[rgba(11,12,23,0)]",
    !noShadow &&
      "after:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-[12%] after:pointer-events-none after:z-[1] after:bg-gradient-to-l after:from-[#1A202B] after:to-[rgba(26,32,43,0)]",
  );

  return (
    <div
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
      data-testid="testimonials"
    >
      <div className={cn("relative max-w-full", marqueeClasses)}>
        <Marquee
          direction="left"
          pauseOnHover
          className="w-full overflow-hidden py-2"
          innerClassName="items-stretch"
          style={{ "--duration": "350s", "--gap": "1rem" } as CSSProperties}
        >
          {list.map((testimonial, idx) => (
            <div
              key={
                testimonial.key ??
                `${testimonial.author}-${testimonial.company}-${testimonial.title}-${idx}`
              }
              className="flex h-full w-[320px] shrink-0 md:w-[360px]"
            >
              <TestimonialItem color={color} {...testimonial} />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Testimonials;
