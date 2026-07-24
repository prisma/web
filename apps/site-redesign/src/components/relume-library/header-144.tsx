// @ts-nocheck
"use client"

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, useScroll, useTransform } from "framer-motion";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

export type Header144Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header144 = (props: Header144Props) => {
  const { heading, description, buttons, image } = {
    ...Header144Defaults,
    ...props,
  };

  const isMobile = useMediaQuery("(max-width: 767px)");

  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  return (
    <section id="relume" className="relative md:min-h-screen">
      <div className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="rb-12 mb-12 grid grid-cols-1 items-start gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20 lg:gap-y-16">
            <h1 className="text-6xl font-bold md:text-9xl lg:text-10xl">{heading}</h1>
            <div className="mx-[7.5%] self-end md:mt-48">
              <p className="md:text-md">{description}</p>
              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
                {buttons.map((button, index) => (
                  <Button key={index} {...button}>
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <motion.div
            className="flex origin-top-right flex-col items-end justify-center md:h-[60vh] lg:h-[80vh] lg:justify-start"
            style={{ scale: isMobile ? 1 : videoScale }}
          >
            <img src={image.src} alt={image.alt} className="size-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Header144Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
};
