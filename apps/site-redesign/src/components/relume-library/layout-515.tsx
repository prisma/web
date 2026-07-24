// @ts-nocheck
"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import { type ButtonProps } from "@relume_io/relume-ui";
import React, { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type ContentProps = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
  imageMobile: ImageProps;
};

type Props = {
  data: ContentProps[];
};

export type Layout515Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout515 = (props: Layout515Props) => {
  const { data } = {
    ...Layout515Defaults,
    ...props,
  };
  const isMobile = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  return (
    <section ref={containerRef} id="relume" className="px-[5%] py-16 md:px-0 md:py-0">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block">
          {data.map((item, index) => (
            <div key={index} className="md:h-screen">
              <img src={item.image.src} alt={item.image.alt} className="size-full object-cover" />
            </div>
          ))}
        </div>
        <div>
          <div className="flex flex-col gap-y-12 md:sticky md:top-0 md:gap-y-0">
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
              const motionStyles = {
                opacity: opacity,
              };

              if (isMobile) {
                return (
                  <div key={index}>
                    <div className="max-w-md">
                      <p className="mb-3 font-semibold">{item.tagline}</p>
                      <h2 className="mb-5 text-5xl font-bold">{item.heading}</h2>
                      <p className="md:text-md">{item.description}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        {item.buttons.map((button, buttonIndex) => (
                          <Button key={buttonIndex} {...button}>
                            {button.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8">
                      <img
                        src={item.imageMobile.src}
                        alt={item.imageMobile.alt}
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <motion.div
                  key={index}
                  style={motionStyles}
                  className="md:absolute md:flex md:h-screen md:flex-col md:justify-center"
                >
                  <div className="max-w-md md:ml-20 md:mr-[5vw]">
                    <p className="font-semibold md:mb-4">{item.tagline}</p>
                    <h2 className="text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                      {item.heading}
                    </h2>
                    <p className="md:text-md">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-4 md:mt-8">
                      {item.buttons.map((button, buttonIndex) => (
                        <Button key={buttonIndex} {...button}>
                          {button.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout515Defaults: Props = {
  data: [
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1-portrait.svg",
        alt: "Relume placeholder image 1",
      },
      imageMobile: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
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
      tagline: "Tagline",
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2-portrait.svg",
        alt: "Relume placeholder image 2",
      },
      imageMobile: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
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
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3-portrait.svg",
        alt: "Relume placeholder image 3",
      },
      imageMobile: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
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
      tagline: "Tagline",
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4-portrait.svg",
        alt: "Relume placeholder image 4",
      },
      imageMobile: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
        alt: "Relume placeholder image 4",
      },
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
