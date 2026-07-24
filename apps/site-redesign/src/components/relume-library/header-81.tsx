// @ts-nocheck
"use client"

import { useScroll, motion, useTransform, useSpring, MotionValue } from "framer-motion";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useRef } from "react";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  image: ImageProps;
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

export type Header81Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header81 = (props: Header81Props) => {
  const { heading, description, buttons, image } = {
    ...Header81Defaults,
    ...props,
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 991px)");

  const { scrollYProgress } = useScroll({ target: headerRef });
  const smoothScrollYProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });
  const width = useTransform(smoothScrollYProgress, [0, 1], ["50%", "100%"]);

  return (
    <section id="relume" ref={headerRef} className="relative md:h-[300vh]">
      <div className="static top-0 grid auto-cols-fr grid-cols-1 items-center gap-y-16 pt-16 md:pt-24 lg:sticky lg:h-screen lg:grid-cols-2 lg:gap-y-0 lg:pt-0">
        <div className="relative mx-[5%] max-w-md lg:ml-[5vw] lg:mr-20 lg:justify-self-end">
          <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
        <MotionImage image={image} isMobile={isMobile} width={width} />
      </div>
    </section>
  );
};

const MotionImage = ({
  image,
  isMobile,
  width,
}: {
  image: ImageProps;
  isMobile: boolean;
  width: MotionValue<string>;
}) => (
  <div>
    {isMobile ? (
      <div className="static w-full">
        <div className="relative size-full pt-[100%] lg:pt-0">
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    ) : (
      <motion.div style={{ width }} className="absolute inset-0 left-auto w-auto">
        <div className="relative size-full pt-[100%] lg:pt-0">
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </motion.div>
    )}
  </div>
);

export const Header81Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
};
