// @ts-nocheck
"use client"

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt: string;
};

type Content = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

type TimelineItem = {
  date: string;
  description: string;
  image: ImageProps;
  timelineButtons: ButtonProps[];
};

type Props = {
  featureContent: Content;
  timelineItems: TimelineItem[];
};

export type Layout352Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout352 = (props: Layout352Props) => {
  const { featureContent, timelineItems } = {
    ...Layout352Defaults,
    ...props,
  };

  return (
    <section id="relume" className="relative z-0">
      <div className="relative -z-30">
        <div>
          <Content {...featureContent} />
          <div className="px-[5%]">
            <div className="container">
              <div className="relative flex flex-col items-center justify-center">
                <div className="absolute left-1.5 -z-20 h-full w-[3px] bg-neutral-lighter md:left-auto">
                  <div className="fixed bottom-[50vh] top-0 -z-10 h-[50vh] w-[3px] bg-neutral-black" />
                  <div className="absolute left-0 right-0 top-0 z-10 h-24 w-full bg-gradient-to-b from-white to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 z-10 h-24 w-full bg-gradient-to-t from-white to-transparent" />
                </div>
                {timelineItems.map((item, index) => (
                  <TimelineItem key={index} {...item} />
                ))}
              </div>
            </div>
          </div>
          <Content {...featureContent} />
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ date, description, image, timelineButtons }: TimelineItem) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: circleRef,
    offset: ["end end", "end center"],
  });
  const opacity = {
    opacity: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, 0.25, 0.75, 1]),
  };
  const backgroundColor = {
    backgroundColor: useTransform(scrollYProgress, [0, 1], ["#ccc", "#000"]),
  };

  return (
    <div className="relative z-20 grid w-full auto-cols-fr grid-cols-[3rem_1fr] gap-y-6 py-16 sm:grid-cols-[4rem_1fr] md:w-auto md:grid-cols-[1fr_10rem_1fr] md:gap-y-0 lg:grid-cols-[1fr_12rem_1fr]">
      <motion.div className="[grid-area:1/2/2/3] md:text-right md:[grid-area:auto]" style={opacity}>
        <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">{date}</h3>
      </motion.div>
      <div className="flex justify-start [grid-area:1/1/3/2] md:justify-center md:[grid-area:auto]">
        <motion.div
          ref={circleRef}
          style={backgroundColor}
          className="sticky top-[50vh] size-[0.9375rem] rounded-full shadow-[0_0_0_8px_white]"
        />
      </div>
      <motion.div style={opacity}>
        <div className="mb-10 md:mb-14 lg:mb-16">
          <p className="md:text-md">{description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
            {timelineButtons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <img src={image.src} alt={image.alt} />
        </div>
      </motion.div>
    </div>
  );
};

const Content = ({ ...content }: Content) => (
  <div className="bg-neutral-white px-[5%] py-16 md:py-24 lg:py-28">
    <div className="container">
      <div className="mx-auto max-w-lg text-center">
        <p className="mb-3 font-semibold md:mb-4">{content.tagline}</p>
        <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          {content.heading}
        </h1>
        <p className="md:text-md">{content.description}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
          {content.buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const Layout352Defaults: Props = {
  featureContent: {
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
  timelineItems: [
    {
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
      timelineButtons: [
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
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 2",
      },
      timelineButtons: [
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
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 3",
      },
      timelineButtons: [
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
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 4",
      },
      timelineButtons: [
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
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 4",
      },
      timelineButtons: [
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
