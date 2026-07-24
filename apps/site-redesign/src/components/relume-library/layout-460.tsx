// @ts-nocheck
"use client"

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Feature = {
  image: ImageProps;
  heading: string;
  description: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  firstFeature: Feature;
  secondFeature: Feature;
  thirdFeature: Feature;
};

export type Layout460Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout460 = (props: Layout460Props) => {
  const { tagline, heading, description, buttons, firstFeature, secondFeature, thirdFeature } = {
    ...Layout460Defaults,
    ...props,
  };

  return (
    <section id="relume" className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 gap-x-12 gap-y-5 md:mb-18 md:grid-cols-2 lg:mb-20 lg:gap-x-16">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">{heading}</h2>
          </div>
          <div className="mx-[7.5%] md:mt-48">
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 items-start gap-8 sm:grid-cols-2 md:gap-16">
          <div className="grid items-end gap-12 md:gap-28">
            <div className="flex max-w-xs flex-col items-start">
              <img
                src={firstFeature.image.src}
                className="mb-6 aspect-square w-full object-cover md:mb-8"
                alt={firstFeature.image.alt}
              />
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl lg:text-4xl">
                {firstFeature.heading}
              </h3>
              <p>{firstFeature.description}</p>
            </div>
            <div className="flex flex-col items-start">
              <img
                src={secondFeature.image.src}
                className="mb-6 aspect-[3/2] w-full object-cover md:mb-8"
                alt={secondFeature.image.alt}
              />
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl lg:text-4xl">
                {secondFeature.heading}
              </h3>
              <p>{secondFeature.description}</p>
            </div>
          </div>
          <div className="flex max-w-xs flex-col items-start justify-self-end">
            <div className="mt-0 sm:mt-[50%]">
              <img
                src={thirdFeature.image.src}
                className="mb-6 aspect-[3/4] w-full object-cover md:mb-8"
                alt={thirdFeature.image.alt}
              />
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl lg:text-4xl">
                {thirdFeature.heading}
              </h3>
              <p>{thirdFeature.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout460Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    { title: "Button", variant: "secondary" },
    { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
  ],
  firstFeature: {
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image 1",
    },
    heading: "Medium length section heading goes here",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  },
  secondFeature: {
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image 2",
    },
    heading: "Medium length section heading goes here",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  },
  thirdFeature: {
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image 3",
    },
    heading: "Medium length section heading goes here",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  },
};
