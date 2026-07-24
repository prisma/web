// @ts-nocheck
"use client"

import React from "react";
import type { CarouselApi } from "@relume_io/relume-ui";
import { useState, useEffect } from "react";
import clsx from "clsx";
import {
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

type Testimonial = {
  quote: string;
  logo: ImageProps;
  avatar: ImageProps;
  name: string;
  position: string;
};

type Props = {
  heading: string;
  description: string;
  testimonials: Testimonial[];
};

export type Testimonial9Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial9 = (props: Testimonial9Props) => {
  const { heading, description, testimonials } = {
    ...Testimonial9Defaults,
    ...props,
  };

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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
    <section id="relume" className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        {/* for all available options: https://www.embla-carousel.com/api/options/ */}
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
          className="overflow-hidden"
        >
          <div className="relative pb-12 md:pb-16 lg:px-8">
            <CarouselContent className="ml-0">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-0 md:basis-full md:px-16 lg:basis-1/3 lg:px-6"
                >
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex md:size-14" />
            <CarouselNext className="hidden md:flex md:size-14" />
            <div className="absolute bottom-0 left-0 right-0 z-20 flex h-7 justify-center pt-2.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={clsx("relative mx-[3px] inline-block size-2 rounded-full", {
                    "bg-black": current === index + 1,
                    "bg-neutral-darker/40": current !== index + 1,
                  })}
                />
              ))}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 md:mb-8">
        <img src={testimonial.logo.src} alt={testimonial.logo.alt} className="max-h-14" />
      </div>
      <blockquote className="text-md font-bold leading-[1.4] md:text-xl">
        {testimonial.quote}
      </blockquote>
      <div className="mt-6 flex flex-col items-center justify-center md:mt-8">
        <div className="mb-3 md:mb-4">
          <img
            src={testimonial.avatar.src}
            alt={testimonial.avatar.alt}
            className="size-14 min-h-14 min-w-14 rounded-full object-cover"
          />
        </div>
        <p className="font-semibold">{testimonial.name}</p>
        <p>{testimonial.position}</p>
      </div>
    </div>
  );
};

const testimonial = {
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."',
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    alt: "Webflow logo 1",
  },
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial avatar 1",
  },
  name: "Name Surname",
  position: "Position, Company name",
};

export const Testimonial9Defaults: Props = {
  heading: "Customer testimonials",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  testimonials: [testimonial, testimonial, testimonial, testimonial, testimonial, testimonial],
};
