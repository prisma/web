// @ts-nocheck
"use client"

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import { type ButtonProps } from "@relume_io/relume-ui";
import React, { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type ContentProps = {
  heading: string;
  description: string;
  image: ImageProps;
  imageMobile: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  data: ContentProps[];
};

export type Layout513Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout513 = (props: Layout513Props) => {
  const { data, tagline, heading, description, buttons } = {
    ...Layout513Defaults,
    ...props,
  };
  const isMobile = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section ref={containerRef} id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start md:gap-20">
          <div className="flex flex-col gap-y-16 md:sticky md:top-20 md:mt-20 md:h-[calc(100vh_-10rem)] md:justify-center">
            <div className="flex flex-col">
              <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
              <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
              <p className="md:text-md">{description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                {buttons.map((button, buttonIndex) => (
                  <Button key={buttonIndex} {...button}>
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-start gap-y-8">
              <AnimatePresence>
                {data.map((item, index) => {
                  const startProgress = index / data.length;
                  const endProgress = (index + 1) / data.length;
                  const opacity = useTransform(
                    scrollYProgress,
                    [
                      Math.max(0, startProgress - 0.07),
                      startProgress,
                      endProgress - 0.07,
                      Math.min(1, endProgress),
                    ],
                    [0, 1, 1, 0],
                  );
                  const y = useTransform(
                    scrollYProgress,
                    [
                      Math.max(0, startProgress - 0.1),
                      startProgress,
                      endProgress - 0.1,
                      Math.min(1, endProgress),
                    ],
                    [100, 0, 0, -100],
                  );
                  const motionStyles = {
                    opacity: opacity,
                    y: y,
                  };

                  if (isMobile) {
                    return (
                      <div key={index}>
                        <h5 className="mb-3 text-xl font-bold">{item.heading}</h5>
                        <p>{item.description}</p>
                        <div className="mt-4">
                          <img
                            src={item.imageMobile.src}
                            alt={item.imageMobile.alt}
                            className="size-full"
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <motion.div
                      key={index}
                      style={motionStyles}
                      initial={index === 0 ? { opacity: 0, y: 100 } : false}
                      animate={index === 0 ? { opacity: 1, y: 0 } : {}}
                      transition={index === 0 ? { duration: 0.5 } : {}}
                      className="md:absolute first:md:relative"
                    >
                      <h5 className="font-bold md:mb-4 md:text-2xl">{item.heading}</h5>
                      <p className="md:text-md">{item.description}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
          <div className="hidden md:grid md:grid-cols-1 md:gap-4">
            {data.map((item, index) => (
              <div key={index} className="h-screen overflow-hidden">
                <img src={item.image.src} alt={item.image.alt} className="size-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout513Defaults: Props = {
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
  data: [
    {
      heading: "01 Feature one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1-portrait.svg",
        alt: "Relume placeholder image 1",
      },
      imageMobile: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      heading: "02 Feature two",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2-portrait.svg",
        alt: "Relume placeholder image 2",
      },
      imageMobile: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      heading: "03 Feature three",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3-portrait.svg",
        alt: "Relume placeholder image 3",
      },
      imageMobile: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
    },
    {
      heading: "04 Feature four",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4-portrait.svg",
        alt: "Relume placeholder image 4",
      },
      imageMobile: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
        alt: "Relume placeholder image 4",
      },
    },
  ],
};
