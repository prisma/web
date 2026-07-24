// @ts-nocheck
"use client"

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  images: ImageProps[];
};

export type Gallery24Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Gallery24 = (props: Gallery24Props) => {
  const { heading, description, images } = {
    ...Gallery24Defaults,
    ...props,
  };

  const transformRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: transformRef,
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <section id="relume" ref={transformRef}>
      <div className="px-[5%] pt-16 md:pt-24 lg:pt-28">
        <div className="container text-center ">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
      </div>

      <div className="h-[400vh]">
        <div className="sticky top-0 mt-[-10vh] flex h-screen w-screen max-w-full flex-col items-start justify-center overflow-hidden px-[5%] md:mt-0">
          <motion.div
            style={{ x }}
            className="flex w-[150vh] items-center gap-x-6 sm:w-[200vh] md:gap-x-8 lg:w-[400vh]"
          >
            {images.map((image, index) => (
              <a key={index} className="inline-block max-w-full">
                <div className="relative size-full max-w-full overflow-hidden">
                  <img
                    className="h-[80vh] max-h-[25rem] object-cover sm:max-h-[30rem] sm:w-[90vw] md:max-h-[40rem] md:w-[80vw] lg:max-h-none"
                    src={image.src}
                    alt={image.alt}
                  />
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Gallery24Defaults: Props = {
  heading: "Image Gallery",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
  ],
};
