// @ts-nocheck
import { Button, ButtonProps } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Location = {
  image: ImageProps;
  title: string;
  address: string;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  locations: Location[];
};

export type Contact26Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Contact26 = (props: Contact26Props) => {
  const { tagline, heading, description, locations } = {
    ...Contact26Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mx-auto mb-12 flex max-w-lg flex-col justify-center text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 items-center gap-x-12 gap-y-12 md:grid-cols-2 md:gap-16">
          {locations.map((location, index) => (
            <div key={index} className="flex flex-col items-center justify-start text-center">
              <div className="mb-6 aspect-[3/2] md:mb-8">
                <img
                  src={location.image.src}
                  className="h-full w-full object-cover"
                  alt={location.image.alt}
                />
              </div>
              <h3 className="mb-3 text-2xl font-bold leading-[1.4] md:text-3xl lg:mb-4 lg:text-4xl">
                {location.title}
              </h3>
              <p className="text-center">{location.address}</p>
              <div className="mt-5 md:mt-6">
                <Button {...location.button}>{location.button.title}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Contact26Defaults: Props = {
  tagline: "Tagline",
  heading: "Locations",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  locations: [
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image",
      },
      title: "Sydney",
      address: "123 Sample St, Sydney NSW 2000 AU",
      button: {
        title: "Get Directions",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image",
      },
      title: "New York",
      address: "123 Sample St, New York NY 10000 USA",
      button: {
        title: "Get Directions",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
  ],
};
