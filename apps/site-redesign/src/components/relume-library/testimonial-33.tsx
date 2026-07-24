// @ts-nocheck
"use client"

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { BiSolidStar } from "react-icons/bi";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Testimonial = {
  quote: string;
  avatar: ImageProps;
  name: string;
  position: string;
  companyName: string;
  numberOfStars: number;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  leftTestimonials: Testimonial[];
  rightTestimonials: Testimonial[];
};

export type Testimonial33Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial33 = (props: Testimonial33Props) => {
  const { heading, description, buttons, leftTestimonials, rightTestimonials } = {
    ...Testimonial33Defaults,
    ...props,
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const isMobile = useMediaQuery("(max-width: 767px)");

  const leftCards = isMobile
    ? useTransform(scrollYProgress, [0, 1], ["20vh", "-70vh"])
    : useTransform(scrollYProgress, [0, 1], ["-10rem", "5rem"]);
  const rightCards = isMobile
    ? useTransform(scrollYProgress, [0, 1], ["20vh", "-70vh"])
    : useTransform(scrollYProgress, [0, 1], ["10rem", "-5rem"]);

  return (
    <section
      id="relume"
      ref={sectionRef}
      className="overflow-hidden px-[5%] py-12 md:py-16 lg:py-20"
    >
      <div className="container grid min-h-svh auto-cols-fr grid-cols-1 overflow-hidden border border-border-primary lg:h-[90vh] lg:min-h-[auto] lg:grid-cols-[0.75fr_1fr] lg:overflow-visible">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <div>
            <h2 className="rb-5 mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              {heading}
            </h2>
            <p className="md:text-md">{description}</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid h-screen auto-cols-fr grid-cols-1 content-center items-center gap-4 overflow-hidden border-t border-border-primary px-4 md:h-[70vh] md:grid-cols-2 md:px-8 lg:h-auto lg:border-none lg:pl-0 lg:pr-12">
          <motion.div
            className="grid size-full columns-2 auto-cols-fr grid-cols-1 gap-4 self-center"
            style={{ y: leftCards }}
          >
            <div className="grid size-full auto-cols-fr grid-cols-1 content-center gap-x-6 gap-y-4">
              {leftTestimonials.map((leftTestimonial, index) => (
                <div key={index} className="relative w-full">
                  <TestimonialCard key={index} {...leftTestimonial} />
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="grid size-full auto-cols-fr grid-cols-1 gap-4"
            style={{ y: rightCards }}
          >
            <div className="grid size-full auto-cols-fr grid-cols-1 content-center gap-4">
              {rightTestimonials.map((rightTestimonial, index) => (
                <div key={index} className="relative w-full">
                  <TestimonialCard key={index} {...rightTestimonial} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = (testimonial: Testimonial) => (
  <div className="flex w-full flex-col items-start justify-between border border-border-primary p-6 md:p-8">
    <div className="rb-5 mb-5 md:mb-6">
      <div className="rb-6 mb-6 flex">
        {Array(testimonial.numberOfStars)
          .fill(null)
          .map((_, starIndex) => (
            <BiSolidStar key={starIndex} className="mr-1 size-6" />
          ))}
      </div>
      <blockquote className="md:text-md">{testimonial.quote}</blockquote>
    </div>
    <div className="flex w-full flex-col items-start text-left md:w-fit md:flex-row md:items-center">
      <img
        src={testimonial.avatar.src}
        alt={testimonial.avatar.alt}
        className="mb-4 size-12 min-h-12 min-w-12 rounded-full object-cover md:mb-0 md:mr-4"
      />
      <div>
        <p className="font-semibold">{testimonial.name}</p>
        <p>
          <span>{testimonial.position}</span>, <span>{testimonial.companyName}</span>
        </p>
      </div>
    </div>
  </div>
);

export const Testimonial33Defaults: Props = {
  heading: "Customer testimonials",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [
    { title: "Button", variant: "secondary" },
    { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
  ],
  leftTestimonials: [
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 1",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 2",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 3",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 4",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 5",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
  ],
  rightTestimonials: [
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 6",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 7",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 8",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 9",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
    {
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 10",
      },
      name: "Name Surname",
      position: "Position",
      companyName: "Company name",
      numberOfStars: 5,
    },
  ],
};
