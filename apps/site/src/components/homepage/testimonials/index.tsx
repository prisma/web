"use client";
import { CSSProperties, memo } from "react";
import { cn } from "@/lib/cn";
import { Marquee } from "@/components/marquee";
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

const getTestimonialKey = (testimonial: TestimonialItemType, idx: number) =>
  testimonial.key ??
  `${testimonial.author}-${testimonial.company}-${testimonial.title}-${idx}`;

/** Maximum testimonials rendered per column. Keeps the DOM small. */
const MAX_PER_COL = 8;

const getColumnSlices = (list: TestimonialItemType[]) => {
  // Cap the total pool to MAX_PER_COL * 3 before splitting so each column
  // has at most MAX_PER_COL items regardless of list length.
  const pool = list.slice(0, MAX_PER_COL * 3);
  const third = Math.ceil(pool.length / 3);
  return [
    pool.slice(0, third),
    pool.slice(third, third * 2),
    pool.slice(third * 2),
  ];
};

const TestimonialCol = ({ color, list, reverse }: TestimonialColProps) => (
  <Marquee
    direction="up"
    pauseOnHover
    reverse={reverse}
    className="w-full min-h-[680px] max-w-[1200px] mx-auto h-[100px]"
    innerClassName="w-full"
    style={
      {
        "--duration": reverse ? "100s" : "130s",
      } as CSSProperties
    }
  >
    {list.map((testimonial: TestimonialItemType, idx) => (
      <MemoizedTestimonialItem
        color={color}
        key={getTestimonialKey(testimonial, idx)}
        {...testimonial}
      />
    ))}
  </Marquee>
);

const Testimonials = ({ color, list, noShadow, mask }: TestimonialsType) => {
  const [col1, col2, col3] = getColumnSlices(list);

  const gridClasses = cn(
    "grid max-w-full gap-4 relative",
    !noShadow &&
      "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[30%] before:pointer-events-none before:z-[1] before:bg-gradient-to-b before:from-[#0B0C17] before:to-[rgba(11,12,23,0)]",
    !noShadow &&
      "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[30%] after:pointer-events-none after:z-[1] after:bg-gradient-to-t after:from-[#1A202B] after:to-[rgba(26,32,43,0)]",
  );

  return (
    <div style={mask ? { maskImage: mask } : {}} data-testid="testimonials">
      {/*
       * Single unified grid — one DOM tree for all breakpoints.
       *
       * Previously the component duplicated all testimonials across three
       * separate responsive trees (mobile / tablet / desktop), resulting in
       * 144 TestimonialItem renders in the HTML.  Now we render one 3-column
       * grid and use `display:contents` wrappers to reveal col-2 on md+ and
       * col-3 on lg+ screens without extra wrapper boxes in the layout.
       *
       * Result: 3 cols × MAX_PER_COL items × 2 Marquee copies = 48 renders
       * (down from 144 — a 67 % reduction).
       */}
      <div
        className={cn(gridClasses, "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}
      >
        <TestimonialCol color={color} reverse list={col1} />
        {/* `display:contents` makes the div transparent to the grid so the
            Marquee column participates directly; `hidden` removes it entirely
            (including its children) on mobile to avoid hidden layout work. */}
        <div className="hidden md:contents">
          <TestimonialCol color={color} list={col2} />
        </div>
        <div className="hidden lg:contents">
          <TestimonialCol color={color} reverse list={col3} />
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
