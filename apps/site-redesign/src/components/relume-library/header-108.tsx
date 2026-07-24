// @ts-nocheck
"use client"

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, useScroll, useTransform } from "framer-motion";

type ImageProps = {
  src: string;
  alt: string;
};

type Props = {
  title: string;
  description: string;
  buttons: ButtonProps[];
  images: ImageProps[];
};

export type Header108Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header108 = (props: Header108Props) => {
  const { title, description, buttons, images } = {
    ...Header108Defaults,
    ...props,
  };

  const isMobile = useMediaQuery("(max-width: 767px)");
  const { scrollYProgress } = useScroll();

  const createTransform = (mobileValues: string[], desktopValues: string[]) =>
    useTransform(scrollYProgress, [0, 1], isMobile ? mobileValues : desktopValues);

  const leftImageGroup = {
    x: createTransform(["0vw", "-25vw"], ["0vw", "-32vw"]),
  };

  const centerImageContainer = {
    x: createTransform(["0vw", "-25vw"], ["0vw", "-32vw"]),
    width: createTransform(["50vw", "100vw"], ["36vw", "100vw"]),
    height: createTransform(["60vh", "100vh"], ["80vh", "100vh"]),
  };

  const rightImageGroup = {
    x: createTransform(["0vw", "25vw"], ["0vw", "32vw"]),
  };

  return (
    <section id="relume" className="relative h-[250vh]">
      <div className="px-[5%] pt-16 md:pt-24 lg:pt-28">
        <div className="container">
          <div className="mx-auto w-full max-w-lg text-center">
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{title}</h1>
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

      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div className="z-10 grid h-[60vh] w-full grid-flow-col grid-cols-[25%_50%_25%]  content-center items-center justify-center md:h-[70vh] md:grid-cols-[32%_36%_32%] lg:h-[80vh]">
          <motion.div
            className="grid grid-flow-col grid-cols-1 items-center justify-items-end gap-4 justify-self-end px-4"
            style={leftImageGroup}
          >
            <div className="relative hidden md:block md:w-[25vw] lg:w-[20vw]">
              <img className="aspect-[2/3] w-full object-cover" {...images[0]} />
            </div>

            <div className="relative grid w-[40vw] grid-cols-1 grid-rows-[auto_auto] gap-4 self-center md:w-[18vw]">
              <div className="relative">
                <img className="aspect-square w-full object-cover" {...images[1]} />
              </div>
              <div className="relative">
                <img className="aspect-[3/4] w-full object-cover" {...images[2]} />
              </div>
            </div>
          </motion.div>

          <motion.div className="relative" style={centerImageContainer}>
            <img className="size-full object-cover" {...images[3]} />
          </motion.div>

          <motion.div
            className="grid grid-flow-col items-center justify-items-start gap-4 justify-self-start px-4"
            style={rightImageGroup}
          >
            <div className="relative grid w-[40vw] grid-cols-1 grid-rows-[auto_auto] gap-4 self-center md:w-[18vw]">
              <div className="relative w-[40vw] sm:w-auto">
                <img className="aspect-[3/4] w-full object-cover" {...images[4]} />
              </div>
              <div className="relative w-[40vw] sm:w-auto">
                <img className="aspect-square w-full object-cover" {...images[5]} />
              </div>
            </div>

            <div className="relative hidden md:block md:w-[25vw] lg:w-[20vw]">
              <img className="aspect-[2/3] w-full object-cover" {...images[6]} />
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 mt-[100vh]" />
    </section>
  );
};

export const Header108Defaults: Props = {
  title: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    {
      title: "Button",
    },
    {
      title: "Button",
      variant: "secondary",
    },
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
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 6",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 7",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 8",
    },
  ],
};
