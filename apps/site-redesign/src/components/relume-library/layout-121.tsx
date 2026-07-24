// @ts-nocheck
"use client"

import { useRef } from "react";
import { useScroll, useTransform, motion, MotionStyle } from "framer-motion";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type FeaturesProps = {
  icon: {
    src: string;
    alt: string;
  };
  heading: string;
  description: string;
};

type Props = {
  tagline: string;
  heading: string;
  buttons: ButtonProps[];
  features: FeaturesProps[];
};

export type Layout121Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout121 = (props: Layout121Props) => {
  const { tagline, heading, buttons, features } = {
    ...props,
    ...Layout121Defaults,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-y-8 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="relative">
            <AnimationSection />
            {features.map((feature, index) => (
              <div key={index} className="grid grid-cols-[max-content_1fr] gap-x-6 lg:gap-x-10">
                <div className="relative flex flex-col items-center justify-start py-10">
                  <div className="relative z-10 -mt-4 bg-white px-2 py-4 md:px-4">
                    <img src={feature.icon.src} alt={feature.icon.alt} className="size-12" />
                  </div>
                </div>
                <div className="py-10">
                  <h6 className="mb-3 text-md font-bold leading-[1.4] md:mb-4 md:text-xl">
                    {feature.heading}
                  </h6>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AnimationSection = () => {
  const scrollSection = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollSection,
    offset: ["start 55%", "start start"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute left-8 right-auto top-[10%] h-3/4 w-0.5 bg-black/15 md:left-[2.4375rem]">
      <motion.div ref={scrollSection} className="bg-black" style={{ height } as MotionStyle} />
    </div>
  );
};

export const Layout121Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
  features: [
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume icon 1",
      },
      heading: "Subheading one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume icon 2",
      },
      heading: "Subheading two",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume icon 3",
      },
      heading: "Subheading three",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume icon 4",
      },
      heading: "Subheading four",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
  ],
};
