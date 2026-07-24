// @ts-nocheck
"use client"

import React, { useState, useEffect } from "react";
import type { CarouselApi } from "@relume_io/relume-ui";
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
  image: ImageProps;
  name: string;
  position: string;
  companyName: string;
  logo: ImageProps;
};

type Props = {
  testimonials: Testimonial[];
};

export type Testimonial15Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial15 = (props: Testimonial15Props) => {
  const { testimonials } = {
    ...Testimonial15Defaults,
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
          <div className="relative pt-20 md:pb-20 md:pt-0">
            <CarouselContent className="ml-0">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-0">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute top-0 flex w-full items-start justify-between md:bottom-0 md:top-auto md:items-end">
              <div className="mt-2.5 flex w-full items-start justify-start md:mb-2.5 md:mt-0">
                {testimonials.map((_, index) => (
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
              <div className="flex items-end justify-end gap-2 md:gap-4">
                <CarouselPrevious className="static right-0 top-0 size-12 -translate-y-0" />
                <CarouselNext className="static right-0 top-0 size-12 -translate-y-0" />
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="grid w-full auto-cols-fr grid-cols-1 items-center justify-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-x-20">
      <div className="order-last md:order-first">
        <img
          src={testimonial.image.src}
          alt={testimonial.image.alt}
          className="aspect-square w-full object-cover"
        />
      </div>
      <div className="flex flex-col items-start">
        <div className="mb-6 flex md:mb-8">
          {Array(testimonial.numberOfStars)
            .fill(null)
            .map((_, starIndex) => (
              <BiSolidStar key={starIndex} className="size-6" />
            ))}
        </div>
        <blockquote className="text-xl font-bold md:text-2xl">{testimonial.quote}</blockquote>
        <div className="mt-6 flex flex-nowrap items-center gap-5 md:mt-8">
          <div>
            <p className="font-semibold">{testimonial.name}</p>
            <p>
              <span>{testimonial.position}</span>, <span>{testimonial.companyName}</span>
            </p>
          </div>
          <div className="mx-4 w-px self-stretch bg-background-alternative sm:mx-0" />
          <div>
            <img src={testimonial.logo.src} alt={testimonial.logo.alt} className="max-h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

const testimonial = {
  numberOfStars: 5,
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."',
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial image 1",
  },
  name: "Name Surname",
  position: "Position",
  companyName: "Company name",
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    alt: "Webflow logo 1",
  },
};

export const Testimonial15Defaults: Props = {
  testimonials: [testimonial, testimonial],
};
