// @ts-nocheck
"use client"

import React from "react";
import type { CarouselApi } from "@relume_io/relume-ui";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { BiSolidStar } from "react-icons/bi";
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
  numberOfStars: number;
  quote: string;
  avatar: ImageProps;
  name: string;
  position: string;
  logo: ImageProps;
};

type Props = {
  testimonials: Testimonial[];
};

export type Testimonial10Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial10 = (props: Testimonial10Props) => {
  const { testimonials } = {
    ...Testimonial10Defaults,
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
                <CarouselItem key={index} className="pl-0 md:px-16 lg:px-6">
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
    <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
      <div className="mb-6 flex md:mb-8">
        {Array(testimonial.numberOfStars)
          .fill(null)
          .map((_, starIndex) => (
            <BiSolidStar key={starIndex} className="size-6" />
          ))}
      </div>
      <blockquote className="text-xl font-bold md:text-2xl">{testimonial.quote}</blockquote>
      <div className="mt-6 flex w-full flex-col items-center gap-3 text-center md:mt-8 md:w-auto md:flex-row md:gap-5 md:text-left">
        <div>
          <img
            src={testimonial.avatar.src}
            alt={testimonial.avatar.alt}
            className="size-14 min-h-14 min-w-14 rounded-full object-cover"
          />
        </div>
        <div className="mb-4 md:mb-0">
          <p className="font-semibold">{testimonial.name}</p>
          <p>{testimonial.position}</p>
        </div>
        <div className="hidden w-px self-stretch bg-background-alternative md:block" />
        <div>
          <img src={testimonial.logo.src} alt={testimonial.logo.alt} className="max-h-12" />
        </div>
      </div>
    </div>
  );
};

const testimonial = {
  numberOfStars: 5,
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."',
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial avatar 1",
  },
  name: "Name Surname",
  position: "Position, Company name",
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    alt: "Webflow logo 1",
  },
};

export const Testimonial10Defaults: Props = {
  testimonials: [testimonial, testimonial],
};
