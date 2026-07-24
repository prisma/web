// @ts-nocheck
"use client"

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";

type ImageProps = {
  src: string;
  alt: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  images: ImageProps[];
};

export type Header106Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header106 = (props: Header106Props) => {
  const { heading, description, buttons, images } = {
    ...Header106Defaults,
    ...props,
  };

  const { scrollYProgress } = useScroll();

  const containerMotion = {
    y: useTransform(scrollYProgress, [0, 1], ["0%", "5%"]),
    scale: useTransform(scrollYProgress, [0, 1], [1, 0]),
    opacity: useTransform(scrollYProgress, [0, 1], [1, 0]),
  };

  const imageMotions = [
    {
      x: useTransform(scrollYProgress, [0, 1], ["0vw", "45vw"]),
      y: useTransform(scrollYProgress, [0, 1], ["0%", "110%"]),
    },
    {
      x: useTransform(scrollYProgress, [0, 1], ["0vw", "30vw"]),
      y: useTransform(scrollYProgress, [0, 1], ["0%", "80%"]),
    },
    { x: undefined, y: useTransform(scrollYProgress, [0, 1], ["0%", "70%"]) },
    {
      x: useTransform(scrollYProgress, [0, 1], ["0vw", "-30vw"]),
      y: useTransform(scrollYProgress, [0, 1], ["0%", "90%"]),
    },
    {
      x: useTransform(scrollYProgress, [0, 1], ["0vw", "-45vw"]),
      y: useTransform(scrollYProgress, [0, 1], ["0%", "120%"]),
    },
  ];

  return (
    <section id="relume">
      <div className="relative h-[110vh] md:h-[500vh]">
        <div className="sticky top-0 min-h-screen overflow-hidden">
          <div className="px-[5%] py-16 md:py-24 lg:py-28">
            <div className="container max-w-lg">
              <div className="relative z-20 text-center">
                <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                  {heading}
                </h1>
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
          </div>
          <motion.div
            style={containerMotion}
            className="absolute inset-0 z-10 flex origin-bottom items-end justify-center"
          >
            {images.map((image, index) => (
              <motion.div
                style={imageMotions[index]}
                className={clsx("absolute w-full max-w-[9rem] sm:max-w-[15rem] lg:max-w-xs", {
                  "left-[-25%] top-[65%] sm:top-[45%] md:left-[-20%] lg:left-[-10%] lg:top-[12%] ":
                    index === 0,
                  "bottom-[5%] left-[-8%] md:left-[5%] lg:bottom-[10%]": index === 1,
                  "bottom-[0%]": index === 2,
                  "bottom-[4%] right-[-5%] sm:bottom-[7%] md:right-[8%] lg:bottom-[15%] lg:right-[10%]":
                    index === 3,
                  "right-[-30%] top-[65%] sm:right-[-15%] sm:top-[45%] lg:right-[-8%] lg:top-[5%]":
                    index === 4,
                })}
              >
                <img className="size-full" src={image.src} alt={image.alt} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10 mt-[100vh]" />
      </div>
    </section>
  );
};

export const Header106Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
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
