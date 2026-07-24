// @ts-nocheck
"use client"

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

type Props = {
  headings: string[];
};

export type Banner14Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner14 = (props: Banner14Props) => {
  const { headings } = {
    ...Banner14Defaults,
    ...props,
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingTranslate = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  return (
    <section id="relume" ref={sectionRef} className="overflow-hidden">
      <div className="flex whitespace-nowrap border-b border-t border-border-primary">
        <div className="flex w-full items-center overflow-hidden whitespace-nowrap py-4">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <motion.div
                key={index}
                className="ml-12 grid auto-cols-max grid-flow-col grid-cols-[max-content] gap-12"
                style={{ x: headingTranslate }}
              >
                {headings.map((heading, headingIndex) => {
                  return (
                    <h1 key={headingIndex} className="text-md font-bold md:text-lg">
                      {heading}
                    </h1>
                  );
                })}
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export const Banner14Defaults: Props = {
  headings: [
    "Relume Library",
    "Relume Library",
    "Relume Library",
    "Relume Library",
    "Relume Library",
  ],
};
