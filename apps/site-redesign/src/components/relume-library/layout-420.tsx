// @ts-nocheck
"use client"
import { Button } from "@relume_io/relume-ui";
import { type ButtonProps } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type DataProps = {
  subheading: string;
  description: string;
  image: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  data: DataProps[];
};

export type Layout420Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout420 = (props: Layout420Props) => {
  const { data, tagline, heading, description, buttons } = {
    ...Layout420Defaults,
    ...props,
  };

  return (
    <section id="relume" className="pt-24 md:pt-0">
      <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-y-0">
        <div>
          <div className="md:sticky md:top-0 md:gap-y-0">
            <div className="flex flex-col items-end md:h-screen md:justify-center">
              <div className="mx-[5%] max-w-md md:ml-[5vw] md:mr-12 lg:mr-20">
                <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
                <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                  {heading}
                </h2>
                <p className="md:text-md">{description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                  {buttons.map((button, buttonIndex) => (
                    <Button key={buttonIndex} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {data.map((item, index) => (
            <div key={index} className="sticky top-0 flex h-screen flex-col justify-center p-10">
              <div className="max-w-md text-text-alternative">
                <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">{item.subheading}</h3>
                <p>{item.description}</p>
              </div>
              <div className="absolute inset-0 -z-10">
                <img src={item.image.src} className="size-full object-cover" alt={item.image.alt} />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Layout420Defaults: Props = {
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
  data: [
    {
      subheading: "Subheading one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      subheading: "Subheading two",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      subheading: "Subheading three",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
    },
    {
      subheading: "Subheading four",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
        alt: "Relume placeholder image 4",
      },
    },
  ],
};
