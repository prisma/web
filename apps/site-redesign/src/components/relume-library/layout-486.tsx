// @ts-nocheck
"use client"

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

type Feature = {
  number: string;
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

type Props = {
  features: Feature[];
};

export type Layout486Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout486 = (props: Layout486Props) => {
  const { features } = {
    ...Layout486Defaults,
    ...props,
  };

  const ref = useRef<HTMLDivElement>(null);
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 991px)");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const featureCount = features.length;
  const numbers = Array.from({ length: featureCount }, (_, index) => index + 1);

  const y = isTablet
    ? useTransform(
        scrollYProgress,
        [0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        ["0%", "-25%", "-25%", "-50%", "-50%", "-75%"],
      )
    : useTransform(
        scrollYProgress,
        [0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        ["0%", "0%", "-25%", "-35%", "-50%", "-75%"],
      );

  return (
    <section id="relume" ref={ref} className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="relative grid auto-cols-fr grid-cols-1 items-start gap-x-8 gap-y-12 md:grid-cols-[0.75fr_1fr] md:gap-y-16 lg:grid-cols-[max-content_1fr] lg:gap-x-20">
          <div className="static top-[20%] hidden h-56 overflow-hidden md:sticky md:flex md:items-start">
            <h1 className="text-[6rem] font-bold leading-[1] md:text-[14rem]">0</h1>
            <motion.div className="text-center" style={{ y }}>
              {numbers.map((number, index) => (
                <h1 key={index} className="text-[6rem] font-bold leading-[1] md:text-[14rem]">
                  {number}
                </h1>
              ))}
            </motion.div>
          </div>
          <div className="grid auto-cols-fr grid-cols-1 gap-x-12 gap-y-12 md:gap-x-28 md:gap-y-28">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ ...feature }: Feature) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const animatedWidth = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const width = { width: useTransform(animatedWidth, [0, 1], ["0%", "100%"]) };

  return (
    <div className="flex flex-col items-start justify-center py-8 md:py-0">
      <div className="mt-10 flex text-[6rem] font-bold leading-[1] md:mt-0 md:hidden md:text-[14rem]">
        {feature.number}
      </div>
      <div ref={ref} className="mb-8 mt-8 h-0.5 w-full bg-neutral-lighter md:mt-0">
        <motion.div className="h-0.5 w-8 bg-neutral-black" style={width} />
      </div>
      <p className="mb-3 font-semibold md:mb-4">{feature.tagline}</p>
      <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
        {feature.heading}
      </h2>
      <p className="md:text-md">{feature.description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
        {feature.buttons.map((button, index) => (
          <Button key={index} {...button}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const Layout486Defaults: Props = {
  features: [
    {
      number: "01",
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      number: "02",
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      number: "03",
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      number: "04",
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
  ],
};
