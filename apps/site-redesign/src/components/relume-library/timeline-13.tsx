// @ts-nocheck
"use client"

import React from "react";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useRef } from "react";
import { motion, MotionStyle, useScroll, useTransform } from "framer-motion";
import { RxChevronRight } from "react-icons/rx";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt: string;
};

type TimelineCircleProps = {
  backgroundColor: MotionStyle;
  className?: string;
};

type TimelineItem = {
  heading: string;
  title: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  timelineItems: TimelineItem[];
};

export type Timeline13Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Timeline13 = (props: Timeline13Props) => {
  const { tagline, heading, description, buttons, timelineItems } = {
    ...Timeline13Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="mb-12 text-center md:mb-18 lg:mb-20">
            <div className="relative z-10 w-full max-w-lg">
              <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
              <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
              <p className="md:text-md">{description}</p>
              <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
                {buttons.map((button, index) => (
                  <Button key={index} {...button}>
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="relative grid auto-cols-fr grid-cols-1 justify-items-center gap-20">
            <div className="absolute flex h-full w-8 flex-col items-center justify-self-start md:justify-self-auto">
              <div className="absolute z-10 h-16 w-1 bg-gradient-to-b from-background-primary to-transparent" />
              <div className="sticky top-0 mt-[-50vh] h-[50vh] w-[3px] bg-neutral-black" />
              <div className="h-full w-[3px] bg-neutral-lighter" />
              <div className="absolute bottom-0 z-0 h-16 w-1 bg-gradient-to-b from-transparent to-background-primary" />
              <div className="absolute top-[-50vh] h-[50vh] w-full bg-background-primary" />
            </div>
            <React.Fragment>
              {timelineItems.map((item, index) => (
                <TimelineItem key={index} index={index} item={item} />
              ))}
            </React.Fragment>
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ item, index }: { item: TimelineItem; index: number }) => {
  const isEven = index % 2 === 0;
  const circleRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: circleRef,
    offset: ["end end", "end center"],
  });

  const backgroundColor = {
    backgroundColor: useTransform(scrollYProgress, [0.85, 1], ["#ccc", "#000"]),
  };

  return (
    <div className="grid auto-cols-fr grid-cols-[max-content_1fr] items-start justify-items-center gap-4 md:grid-cols-[1fr_max-content_1fr] md:gap-8 lg:gap-12">
      {isEven ? (
        <React.Fragment>
          <div className="order-last w-full overflow-hidden md:order-none md:w-auto">
            <img src={item.image.src} alt={item.image.alt} className="w-full" />
          </div>
          <TimelineCircle
            ref={circleRef}
            backgroundColor={backgroundColor}
            className="col-span-1 row-span-2"
          />
          <TimelineContent item={item} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <TimelineContent item={item} alignment="right" />
          <TimelineCircle
            ref={circleRef}
            backgroundColor={backgroundColor}
            className="order-first col-span-1 row-span-2 md:order-none"
          />
          <div className="w-full overflow-hidden md:w-auto">
            <img src={item.image.src} alt={item.image.alt} className="w-full" />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const TimelineCircle = React.forwardRef<HTMLDivElement, TimelineCircleProps>(
  ({ backgroundColor, className }, ref) => (
    <div className={clsx("flex h-full w-8 justify-center", className)}>
      <motion.div
        ref={ref}
        style={backgroundColor}
        className="z-20 mt-7 size-[0.9375rem] rounded-full shadow-[0_0_0_8px_white] md:mt-8"
      />
    </div>
  ),
);

const TimelineContent = ({
  item,
  alignment = "left",
}: {
  item: TimelineItem;
  alignment?: "left" | "right";
}) => (
  <div
    className={clsx(
      "z-20 mt-4 flex w-full flex-col md:w-auto",
      alignment === "right" && "items-start text-left md:items-end md:text-right",
    )}
  >
    <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
      {item.heading}
    </h3>
    <h4 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">{item.title}</h4>
    <p>{item.description}</p>
    <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
      {item.buttons.map((button, index) => (
        <Button key={index} {...button}>
          {button.title}
        </Button>
      ))}
    </div>
  </div>
);

export const Timeline13Defaults: Props = {
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
  timelineItems: [
    {
      heading: "Date",
      title: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      heading: "Date",
      title: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      heading: "Date",
      title: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 3",
      },
    },
    {
      heading: "Date",
      title: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 4",
      },
    },
  ],
};
