// @ts-nocheck
"use client"

import React from "react";
import type { CarouselApi } from "@relume_io/relume-ui";
import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  Button,
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

type Testimonial = {
  logo: ImageProps;
  quote: string;
  avatar: ImageProps;
  name: string;
  position: string;
  companyName: string;
  button: ButtonProps;
};

type Props = {
  heading: string;
  description: string;
  testimonials: Testimonial[];
};

export type Testimonial41Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial41 = (props: Testimonial41Props) => {
  const { heading, description, testimonials } = {
    ...Testimonial41Defaults,
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
    <section id="relume" className="overflow-hidden py-16 md:py-24 lg:py-28">
      <div className="grid auto-cols-fr grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-0">
        <div className="flex lg:justify-self-end">
          <div className="mx-[5%] w-full max-w-md lg:mb-24 lg:ml-[5vw] lg:mr-20">
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
          className="overflow-hidden px-[5%] lg:px-0"
        >
          <CarouselContent className="ml-0">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="basis-[95%] pl-0 pr-6 sm:basis-[80%] md:basis-[60%] md:pr-8"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-12 flex items-center justify-between">
            <div className="flex gap-2 md:gap-4">
              <CarouselPrevious className="static left-0 top-0 size-12 -translate-y-0" />
              <CarouselNext className="static left-0 top-0 size-12 -translate-y-0" />
            </div>
            <div className="absolute right-[5%] mt-5 flex items-center justify-end md:right-8 lg:right-16">
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
          </div>
        </Carousel>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="flex w-full flex-col items-start justify-between border border-border-primary p-6 md:p-8">
      <div className="mb-8 md:mb-10 lg:mb-12">
        <img src={testimonial.logo.src} alt={testimonial.logo.alt} className="max-h-12" />
      </div>
      <blockquote className="md:text-md">{testimonial.quote}</blockquote>
      <div className="mt-5 flex w-full flex-col items-start gap-4 md:mt-6 md:w-auto md:flex-row md:items-center">
        <div>
          <img
            src={testimonial.avatar.src}
            alt={testimonial.avatar.alt}
            className="size-12 min-h-12 min-w-12 rounded-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          <p>
            <span>{testimonial.position}</span>, <span>{testimonial.companyName}</span>
          </p>
        </div>
      </div>
      <div className="mt-6 md:mt-8">
        <Button className="py-1" {...testimonial.button}>
          {testimonial.button.title}
        </Button>
      </div>
    </div>
  );
};

const testimonial1 = {
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    alt: "Webflow logo 1",
  },
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial avatar 1",
  },
  name: "Name Surname",
  position: "Position",
  companyName: "Company name",
  button: {
    title: "Read case study",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
};

const testimonial2 = {
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
    alt: "Relume logo 2",
  },
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial avatar 2",
  },
  name: "Name Surname",
  position: "Position",
  companyName: "Company name",
  button: {
    title: "Read case study",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
};

export const Testimonial41Defaults: Props = {
  heading: "Customer testimonials",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  testimonials: [
    testimonial1,
    testimonial2,
    testimonial1,
    testimonial2,
    testimonial1,
    testimonial2,
    testimonial1,
  ],
};
