// @ts-nocheck
import * as React from "react";
import type { ButtonProps } from "@relume_io/relume-ui";
import { Button } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Date = {
  weekday: string;
  day: string;
  monthYear: string;
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

export type Event12Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event12 = (props: Event12Props) => {
  const { tagline, heading, description, button, featuredEvents } = {
    ...Event12Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <h4 className="font-semibold">{tagline}</h4>
          <h1 className="mt-3 text-5xl font-bold md:mt-4 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="mt-5 text-base md:mt-6 md:text-md">{description}</p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:gap-x-12">
          {featuredEvents.map((event, index) => (
            <FeaturedEvent key={index} {...event} />
          ))}
        </div>
        <div className="mt-12 flex justify-center md:mt-18 lg:mt-20">
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
    <div className="flex flex-col items-start border border-border-primary">
      <a href={url} className="relative block aspect-[3/2] w-full">
        <img src={image.src} alt={image.alt} className="absolute size-full object-cover" />
        <div className="absolute right-4 top-4 flex min-w-28 flex-col items-center bg-background-primary px-1 py-3 text-sm">
          <span>{date.weekday}</span>
          <span className="text-2xl font-bold md:text-3xl lg:text-4xl">{date.day}</span>
          <span>{date.monthYear}</span>
        </div>
      </a>
      <div className="flex flex-col items-start p-6">
        <span className="mb-3 bg-background-secondary px-2 py-1 text-sm font-semibold md:mb-4">
          {category}
        </span>
        <a href={url}>
          <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        </a>
        <p className="mb-2">{location}</p>
        <p>{description}</p>
        <Button {...button} className="mt-5 md:mt-6">
          {button.title}
        </Button>
      </div>
    </div>
  );
};

export const Event12Defaults: Props = {
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
        weekday: "Sat",
        day: "10",
        monthYear: "Feb 2024",
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
        weekday: "Sat",
        day: "10",
        monthYear: "Feb 2024",
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
