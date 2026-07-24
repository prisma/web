// @ts-nocheck
"use client"

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  imagesPartOne: ImageProps[];
  imagesPartTwo: ImageProps[];
};

export type Layout414Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout414 = (props: Layout414Props) => {
  const { tagline, heading, description, buttons, imagesPartOne, imagesPartTwo } = {
    ...Layout414Defaults,
    ...props,
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const xPartOne = useTransform(scrollYProgress, [0, 1], ["1%", "5%"]);
  const xPartTwo = useTransform(scrollYProgress, [0, 1], ["-1%", "-5%"]);

  return (
    <section
      id="relume"
      ref={sectionRef}
      className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28"
    >
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="rb-12 mb-12 grid grid-cols-1 items-start justify-between gap-x-12 gap-y-8 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
            <div>
              <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
              <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">{heading}</h2>
            </div>
            <div>
              <p className="md:text-md">{description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                {buttons.map((button, index) => (
                  <Button key={index} {...button}>
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-screen flex-col items-center gap-4 overflow-hidden">
            <motion.div
              className="flex size-full flex-nowrap items-center justify-center gap-4"
              style={{ translateX: xPartOne }}
            >
              {imagesPartOne.map((image, index) => (
                <div key={index} className="w-[40vw] flex-none md:w-[30vw]">
                  <img
                    className="aspect-[4/3] w-full object-cover"
                    src={image.src}
                    alt={image.alt}
                  />
                </div>
              ))}
            </motion.div>
            <motion.div
              className="flex size-full flex-nowrap items-center justify-center gap-4"
              style={{ translateX: xPartTwo }}
            >
              {imagesPartTwo.map((image, index) => (
                <div key={index} className="w-[40vw] flex-none md:w-[30vw]">
                  <img
                    className="aspect-[4/3] w-full object-cover"
                    src={image.src}
                    alt={image.alt}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout414Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  buttons: [
    { title: "Button", variant: "secondary" },
    { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
  ],
  imagesPartOne: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 1",
    },

    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 2",
    },

    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 3",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 4",
    },
  ],
  imagesPartTwo: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 5",
    },

    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 6",
    },

    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 7",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 8",
    },
  ],
};
