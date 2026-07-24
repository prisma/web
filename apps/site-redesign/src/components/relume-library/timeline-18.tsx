// @ts-nocheck
"use client"

import React, { useState, useEffect } from "react";
import {
  Button,
  CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type TimelineItem = {
  image: ImageProps;
  date: string;
  description: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  timelineItems: TimelineItem[];
};

export type Timeline18Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Timeline18 = (props: Timeline18Props) => {
  const { tagline, heading, description, buttons, timelineItems } = {
    ...Timeline18Defaults,
    ...props,
  };

  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
    api.scrollTo(0);
    api.reInit();
  }, [api]);

  return (
    <section id="relume" className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
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
        <Carousel setApi={setApi} className="relative h-full overflow-hidden">
          <div className="absolute left-0 z-20 h-full w-8 bg-gradient-to-r from-background-primary to-transparent lg:w-16" />
          <div className="absolute right-0 z-20 h-full w-8 bg-gradient-to-l from-background-primary to-transparent lg:w-16" />
          <CarouselContent className="ml-0">
            {timelineItems.map((item, index) => (
              <CarouselItem key={index} className="basis-full pl-0 sm:basis-1/2 md:basis-1/3">
                <TimelineItem {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {currentIndex > 0 && <CarouselPrevious className="z-30 size-12" />}
          <CarouselNext className="z-30 size-12" />
        </Carousel>
      </div>
    </section>
  );
};

const TimelineItem = ({
  image,
  date,
  description,
}: {
  image: ImageProps;
  date: string;
  description: string;
}) => {
  return (
    <div className="mb-4 flex w-full flex-col items-center md:mb-0 md:w-auto">
      <div className="w-3/5 overflow-hidden">
        <img src={image.src} alt={image.alt} className="w-full" />
      </div>
      <div className="mb-4 mt-8 flex w-full items-center">
        <div className="h-[3px] w-full bg-neutral-black" />
        <div className="z-20 size-[0.9375rem] flex-none rounded-full bg-neutral-black shadow-[0_0_0_8px_white]" />
        <div className="h-[3px] w-full bg-neutral-black" />
      </div>
      <div className="px-6 text-center">
        <h3 className="mb-2 text-xl font-bold md:text-2xl">{date}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export const Timeline18Defaults: Props = {
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
  timelineItems: [
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 2",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 3",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 4",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 5",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 6",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
  ],
};
