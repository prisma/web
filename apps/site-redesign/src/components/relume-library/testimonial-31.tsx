// @ts-nocheck
"use client"

import React from "react";
import { useState, useEffect } from "react";
import { RxChevronRight } from "react-icons/rx";
import type { ButtonProps, CarouselApi } from "@relume_io/relume-ui";
import clsx from "clsx";
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

export type Testimonial31Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial31 = (props: Testimonial31Props) => {
  const { heading, description, testimonials } = {
    ...Testimonial31Defaults,
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
        <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        {/* for all available options: https://www.embla-carousel.com/api/options/ */}
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="ml-0">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="basis-[95%] pl-0 pr-6 sm:basis-[80%] md:basis-1/2 md:pr-8"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="rt-8 mt-8 flex items-center justify-between">
            <div className="mt-5 flex w-full items-start justify-start">
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
        </Carousel>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="flex w-full flex-col items-start justify-between border border-border-primary p-6 md:p-8">
      <div className="rb-5 mb-5 md:mb-6">
        <div className="rb-12 mb-12">
          <img src={testimonial.logo.src} alt={testimonial.logo.alt} className="max-h-12" />
        </div>
        <blockquote className="md:text-md">{testimonial.quote}</blockquote>
      </div>
      <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center">
        <img
          src={testimonial.avatar.src}
          alt={testimonial.avatar.alt}
          className="size-12 min-h-12 min-w-12 rounded-full object-cover"
        />
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

export const Testimonial31Defaults: Props = {
  heading: "Customer testimonials",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  testimonials: [
    {
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
    },
    {
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
    },
    {
      logo: {
        src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
        alt: "Webflow logo 3",
      },
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 3",
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
    },
    {
      logo: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
        alt: "Relume logo 4",
      },
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 4",
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
    },
  ],
};
