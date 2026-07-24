// @ts-nocheck
"use client"

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, useScroll, useTransform } from "framer-motion";
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
  images: ImageProps[];
};

export type Layout421Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout421 = (props: Layout421Props) => {
  const { tagline, heading, description, buttons, images } = {
    ...Layout421Defaults,
    ...props,
  };

  const isMobile = useMediaQuery("(max-width: 479px)");
  const { scrollY, scrollYProgress } = useScroll();

  const halfViewportHeight = typeof window !== "undefined" ? window.innerHeight * 0.5 : 100;

  const containerMotion = {
    opacity: useTransform(scrollY, [0, halfViewportHeight], [1, 0]),
    scale: useTransform(scrollY, [0, halfViewportHeight], [1, 0.95]),
  };

  const createTransform = (x: string[], y: string[], rotate: string[]) => ({
    translateX: useTransform(scrollYProgress, [0, 1], x),
    translateY: useTransform(scrollYProgress, [0, 1], y),
    rotateZ: useTransform(scrollYProgress, [0, 1], rotate),
  });

  const imageTransforms = [
    {},
    isMobile
      ? createTransform(["13%", "90%"], ["12%", "80%"], ["0.6deg", "4deg"])
      : createTransform(["0%", "100%"], ["0%", "60%"], ["0deg", "-4deg"]),
    isMobile
      ? createTransform(["-12%", "-80%"], ["-12%", "-80%"], ["-3deg", "4deg"])
      : createTransform(["0%", "-50%"], ["0%", "-90%"], ["4deg", "4deg"]),
    isMobile
      ? createTransform(["17.5%", "120%"], ["-6%", "-40%"], ["-0.6deg", "-6deg"])
      : createTransform(["0%", "140%"], ["0%", "-40%"], ["0deg", "-12deg"]),
    isMobile
      ? createTransform(["-17.5%", "-120%"], ["9%", "60%"], ["4.6deg", "8deg"])
      : createTransform(["0%", "-140%"], ["0%", "60%"], ["8deg", "8deg"]),
  ];

  return (
    <section id="relume" className="relative flex flex-col">
      <motion.div
        className="sticky top-0 z-0 mx-auto flex min-h-0 items-center justify-center md:min-h-[auto]"
        style={containerMotion}
      >
        <div className="py-16 text-center md:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-lg px-[5%]">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="relative z-20 md:text-md">{description}</p>
            <div className="relative z-20 mt-6 flex items-center justify-center gap-x-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="sticky top-0 z-10 -mt-20 flex h-[60svh] flex-col justify-center sm:mt-0 sm:h-[80svh] md:h-[70svh] lg:h-[120vh] lg:justify-normal">
        <div className="relative flex size-full items-center justify-center overflow-hidden">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="absolute w-full max-w-[55vw] md:max-w-[35vw] lg:max-w-[30vw]"
              style={imageTransforms[index]}
            >
              <img src={image.src} alt={image.alt} className="size-full" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 -z-10 mt-[80vh] sm:mt-[100vh]" />
    </section>
  );
};

export const Layout421Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    { title: "Button", variant: "secondary" },
    { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
  ],
  images: [
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
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 5",
    },
  ],
};
