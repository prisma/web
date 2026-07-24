// @ts-nocheck
"use client"
import { motion, MotionStyle, useScroll, useTransform } from "framer-motion";
import type { ButtonProps } from "@relume_io/relume-ui";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import React, { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  image: ImageProps;
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

export type Layout517Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout517 = (props: Layout517Props) => {
  const { image, tagline, heading, description, buttons } = {
    ...Layout517Defaults,
    ...props,
  };
  const isMobile = useMediaQuery("(max-width: 991px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["center end", "center start"],
  });
  const initialImageWidth = isMobile ? "60%" : "20%";
  const initialImageHeight = "40%";
  const imageWidth = useTransform(scrollYProgress, [0, 1], [initialImageWidth, "100%"]);
  const imageHeight = useTransform(scrollYProgress, [0, 1], [initialImageHeight, "100%"]);
  const imageYPosition = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);
  const cardYPosition = useTransform(scrollYProgress, [0, 0.5, 1], ["100%", "100%", "0%"]);
  const imageStyle = {
    width: imageWidth,
    height: imageHeight,
    y: imageYPosition,
  } as MotionStyle;

  const cardStyle = {
    y: cardYPosition,
  } as MotionStyle;
  return (
    <section id="relume" ref={containerRef} className="h-[200vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.img
          src={image.src}
          alt={image.alt}
          className="size-full object-cover"
          style={imageStyle}
        />
        <motion.div
          className="absolute inset-0 mx-auto flex size-full max-w-xxl items-center justify-end px-[5%]"
          style={cardStyle}
        >
          <div className="flex w-[90%] flex-col border border-border-primary bg-white p-6 md:max-w-[658px] md:p-12">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const Layout517Defaults: Props = {
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image 2",
  },
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
};
