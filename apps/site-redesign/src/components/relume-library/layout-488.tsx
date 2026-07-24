// @ts-nocheck
"use client"

import { useMediaQuery } from "@relume_io/relume-ui";
import { motion, useScroll, useTransform } from "framer-motion";

type ImageProps = {
  src: string;
  alt: string;
};

type Props = {
  leftHeading: string;
  image: ImageProps;
  rightHeading: string;
  mobileHeading: string;
};

export type Layout488Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout488 = (props: Layout488Props) => {
  const { leftHeading, image, rightHeading, mobileHeading } = {
    ...Layout488Defaults,
    ...props,
  };

  const isMobile = useMediaQuery("(max-width: 767px)");

  const { scrollYProgress } = useScroll();

  const createTransform = (mobileValues: number[], desktopValues: number[]) =>
    useTransform(scrollYProgress, [0, 0.6], isMobile ? mobileValues : desktopValues);

  const leftHeadingTranslate = { x: useTransform(scrollYProgress, [0, 0.6], ["10rem", "0rem"]) };
  const rightHeadingTranslate = { x: useTransform(scrollYProgress, [0, 0.6], ["-10rem", "0rem"]) };

  const imageScale = createTransform([0.7, 1], [0.2, 1]);

  const overlayMotion = {
    width: useTransform(
      scrollYProgress,
      [0.6, 1],
      isMobile ? ["10vw", "250vw"] : ["10vw", "200vw"],
    ),
    height: useTransform(
      scrollYProgress,
      [0.6, 1],
      isMobile ? ["10vw", "250vw"] : ["10vw", "200vw"],
    ),
  };

  return (
    <section id="relume" className="relative h-[200vh]">
      <div className="sticky top-0 grid h-svh grid-cols-[60%] content-center items-center justify-center justify-items-center gap-4 overflow-hidden px-[5%] md:grid-cols-[40%_max-content_40%] md:gap-8 lg:h-screen">
        <motion.h2
          className="relative z-10 hidden justify-self-end whitespace-nowrap text-[4rem] font-bold md:flex lg:text-[6rem]"
          style={leftHeadingTranslate}
        >
          {leftHeading}
        </motion.h2>
        <motion.div
          className="relative order-first flex w-full min-w-16 max-w-[24rem] items-center justify-center md:order-none"
          style={{ scale: imageScale }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="aspect-square size-full rounded-full object-cover"
          />
          <motion.div
            className="absolute -z-10 rounded-full bg-neutral-lightest"
            style={overlayMotion}
          />
        </motion.div>
        <motion.h2
          className="relative z-10 hidden justify-self-start whitespace-nowrap text-[4rem] font-bold md:flex lg:text-[6rem]"
          style={rightHeadingTranslate}
        >
          {rightHeading}
        </motion.h2>
        <motion.h2 className="relative z-10 mt-10 flex justify-self-center whitespace-nowrap text-3xl font-bold leading-[1.2] sm:text-8xl md:hidden">
          {mobileHeading}
        </motion.h2>
      </div>
      <div className="absolute inset-0 -z-10 mt-[100vh]" />
    </section>
  );
};

export const Layout488Defaults: Props = {
  leftHeading: "Heading",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder",
  },
  rightHeading: "goes here",
  mobileHeading: "Heading goes here",
};
