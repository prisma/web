// @ts-nocheck
"use client"

import { useState, useEffect } from "react";
import type { ButtonProps, CarouselApi } from "@relume_io/relume-ui";
import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  images: ImageProps[];
  carouselHeading: string;
  carouselDescription: string;
};

const options = {
  loop: true,
};

const plugins = [
  Autoplay({
    delay: 5000,
  }),
];

export type Header102Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header102 = (props: Header102Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { heading, description, buttons, images, carouselHeading, carouselDescription } = {
    ...Header102Defaults,
    ...props,
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section
      id="relume"
      className="grid grid-cols-1 items-center gap-y-16 overflow-hidden pt-16 sm:overflow-auto md:pt-24 lg:grid-cols-[50%_50%] lg:gap-y-0 lg:pt-0"
    >
      <div className="mx-[5%] max-w-md justify-self-start lg:ml-[5vw] lg:mr-20 lg:justify-self-end">
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
      <div className="relative clear-both h-[300px] max-h-[60rem] min-h-screen w-full bg-[#ddd] text-center">
        <Carousel
          opts={options}
          plugins={plugins}
          setApi={setApi}
          className="relative left-0 right-0 z-10 block h-full overflow-hidden whitespace-nowrap pl-4"
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative inline-block size-full whitespace-normal text-left align-top">
                  <div className="flex h-screen flex-col">
                    <div className="relative flex-1">
                      <img
                        className="absolute size-full object-cover"
                        src={image.src}
                        alt={image.alt}
                      />
                    </div>
                    <div className="relative bg-background-secondary px-6 pb-32 pt-6 sm:px-8 sm:pt-8">
                      <div className="w-full max-w-lg">
                        <h6 className="mb-1 text-md font-bold leading-[1.4] md:text-xl">
                          {carouselHeading}
                        </h6>
                        <p>{carouselDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-between pl-4">
            <div className="absolute bottom-[52px] left-8 right-auto top-auto flex w-full items-start justify-start">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={clsx("mx-[3px] inline-block size-2 rounded-full", {
                    "bg-black": current === index + 1,
                    "bg-neutral-light": current !== index + 1,
                  })}
                />
              ))}
            </div>
            <CarouselPrevious className="bottom-2 left-auto right-[5.5rem] top-auto size-12 bg-transparent md:right-24" />
            <CarouselNext className="bottom-2 left-auto right-8 top-auto size-12 bg-transparent" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export const Header102Defaults: Props = {
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
  ],
  carouselHeading: "Short heading goes here",
  carouselDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};
