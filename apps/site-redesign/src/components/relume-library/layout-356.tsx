// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Anchor = {
  url: string;
  number: string;
  title: string;
};

type Feature = {
  anchor: Anchor;
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Props = {
  features: Feature[];
};

export type Layout356Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout356 = (props: Layout356Props) => {
  const { features } = {
    ...Layout356Defaults,
    ...props,
  };
  return (
    <section id="relume">
      <div className="sticky top-0">
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <div className="relative -top-32 h-0" />
            <div
              className={clsx(
                "relative border-t border-border-primary bg-neutral-white pb-8 md:pb-14 lg:sticky lg:pb-0",
                { "top-0 lg:mb-32": index === 0 },
                { "lg:top-16 lg:-mt-16 lg:mb-16": index === 1 },
                { "lg:top-32 lg:mb-16": index === 2 },
              )}
            >
              <FeatureCard {...feature} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

const FeatureCard = (feature: Feature) => {
  return (
    <div className="px-[5%]">
      <div className="container">
        <a href={feature.anchor.url} className="flex h-16 w-full items-center underline">
          <span className="mr-5 font-semibold md:mr-6 md:text-md">{feature.anchor.number}</span>
          <h1 className="font-semibold md:text-md">{feature.anchor.title}</h1>
        </a>
        <div className="py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
            <div>
              <p className="mb-3 font-semibold md:mb-4">{feature.tagline}</p>
              <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                {feature.heading}
              </h2>
              <p className="md:text-md">{feature.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                {feature.buttons.map((button, index) => (
                  <Button key={index} {...button}>
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={feature.image.src}
                className="h-[25rem] w-full object-cover sm:h-[30rem] lg:h-[60vh]"
                alt={feature.image.alt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Layout356Defaults: Props = {
  features: [
    {
      anchor: {
        url: "#",
        number: "01",
        title: "Feature one",
      },
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
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      anchor: {
        url: "#",
        number: "02",
        title: "Feature two",
      },
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
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      anchor: {
        url: "#",
        number: "03",
        title: "Feature three",
      },
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
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
    },
  ],
};
