// @ts-nocheck
"use client"

import { useState, useEffect } from "react";
import type { ButtonProps, CarouselApi } from "@relume_io/relume-ui";
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { BiMap, BiCalendarAlt } from "react-icons/bi";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Date = {
  weekday: string;
  day: string;
  month: string;
  year: string;
};

type FeaturedEvent = {
  url: string;
  image: ImageProps;
  date: Date;
  category: string;
  title: string;
  location: string;
  description: string;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  button: ButtonProps;
  featuredEvents: FeaturedEvent[];
};

export type Event25Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event25 = (props: Event25Props) => {
  const { tagline, heading, description, button, featuredEvents } = {
    ...Event25Defaults,
    ...props,
  };

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);

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
        <div className="mb-12 grid auto-cols-fr grid-cols-1 items-end gap-12 md:mb-18 md:grid-cols-[1fr_max-content] lg:mb-20 lg:gap-20">
          <div className="max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-3 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
          <Button {...button} className="hidden md:flex">
            {button.title}
          </Button>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="ml-0">
            {featuredEvents.map((event, index) => (
              <CarouselItem
                key={index}
                className="basis-[95%] pl-0 pr-6 sm:basis-4/5 md:basis-1/2 md:pr-8 lg:basis-1/3"
              >
                <FeaturedEvent key={index} {...event} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-[54px] flex items-center justify-between md:mt-[86px]">
            <div className="mt-3.5 flex w-full items-start justify-start">
              {featuredEvents.map((_, index) => (
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
              <CarouselPrevious className="static right-0 top-0 -mt-1.5 size-12 -translate-y-0" />
              <CarouselNext className="static right-0 top-0 -mt-1.5 size-12 -translate-y-0" />
            </div>
          </div>
        </Carousel>
        <div className="mt-12 flex justify-end md:hidden">
          <Button {...button}>{button.title}</Button>
        </div>
      </div>
    </section>
  );
};

const FeaturedEvent: React.FC<FeaturedEvent> = ({
  url,
  image,
  date,
  category,
  title,
  location,
  description,
  button,
}) => {
  return (
    <div className="flex flex-col items-start">
      <a href={url} className="relative block aspect-[3/2] w-full">
        <img src={image.src} alt={image.alt} className="absolute size-full object-cover" />
        <span className="absolute right-4 top-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
          {category}
        </span>
      </a>
      <div className="mt-5 flex flex-col items-start md:mt-6">
        <div className="mb-3 flex flex-wrap gap-2 text-sm sm:gap-4 md:mb-4">
          <div className="flex items-center gap-2">
            <BiCalendarAlt className="size-6 flex-none" />
            {date.weekday} {date.day} {date.month} {date.year}
          </div>
          <div className="flex items-center gap-2">
            <BiMap className="size-6 flex-none" />
            <span>{location}</span>
          </div>
        </div>
        <a href={url} className="mb-2">
          <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        </a>
        <p>{description}</p>
        <Button {...button} className="mt-5 md:mt-6">
          {button.title}
        </Button>
      </div>
    </div>
  );
};

export const Event25Defaults: Props = {
  tagline: "Tagline",
  heading: "Events",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: {
    variant: "secondary",
    size: "primary",
    title: "View all",
  },
  featuredEvents: [
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 1",
      },
      date: {
        weekday: "Tue",
        day: "06",
        month: "Feb",
        year: "2024",
      },
      category: "Category",
      title: "Event title heading",
      location: "Location",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "View event", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 2",
      },
      date: {
        weekday: "Wed",
        day: "07",
        month: "Feb",
        year: "2024",
      },
      category: "Category",
      title: "Event title heading",
      location: "Location",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "View event", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 3",
      },
      date: {
        weekday: "Thu",
        day: "08",
        month: "Feb",
        year: "2024",
      },
      category: "Category",
      title: "Event title heading",
      location: "Location",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "View event", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 4",
      },
      date: {
        weekday: "Fri",
        day: "09",
        month: "Feb",
        year: "2024",
      },
      category: "Category",
      title: "Event title heading",
      location: "Location",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "View event", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 5",
      },
      date: {
        weekday: "Sat",
        day: "10",
        month: "Feb",
        year: "2024",
      },
      category: "Category",
      title: "Event title heading",
      location: "Location",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "View event", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 6",
      },
      date: {
        weekday: "Sun",
        day: "11",
        month: "Feb",
        year: "2024",
      },
      category: "Category",
      title: "Event title heading",
      location: "Location",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "View event", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
  ],
};
