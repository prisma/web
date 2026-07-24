// @ts-nocheck
"use client"

import { useState } from "react";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type HoverLinkProps = {
  url: string;
  heading: string;
  tag: string;
  image: ImageProps;
};

type Props = {
  hoverLinks: HoverLinkProps[];
};
export type Portfolio22Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Portfolio22 = (props: Portfolio22Props) => {
  const { hoverLinks } = {
    ...Portfolio22Defaults,
    ...props,
  };
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);

  const handleMouseLeave = () => () => {
    setHoveredIndex(null);
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="lg:grid-auto-cols-fr relative block lg:grid lg:grid-cols-2 lg:items-start">
          <div
            className="lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2 lg:pl-10"
            onMouseLeave={handleMouseLeave}
          >
            {hoverLinks.map((link, index) => (
              <div key={index}>
                <div className="absolute left-0 right-0 top-0 hidden h-full w-1/2 pr-10 lg:block">
                  <div
                    className={clsx(
                      "sticky top-8 h-full max-h-[60vh] overflow-hidden",
                      index === 0 ? "z-0" : "-z-10",
                      hoveredIndex === index || hoveredIndex === null ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <img
                      className="size-full object-cover"
                      src={link.image.src}
                      alt={link.image.alt}
                    />
                  </div>
                </div>
                <a
                  href="#"
                  className="relative z-10 flex flex-col flex-wrap items-start justify-start gap-4 border-b border-border-primary py-5 no-underline transition-all duration-300 sm:flex-row sm:items-center md:gap-8 md:py-6"
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <div
                    className={clsx(
                      "text-xl font-bold transition-colors duration-300 md:text-2xl",
                      {
                        "lg:text-black/20": hoveredIndex !== index && hoveredIndex !== null,
                        "lg:text-black": hoveredIndex === index || hoveredIndex === null,
                      },
                    )}
                  >{`${index < 10 && "0"}${index + 1}`}</div>
                  <div className="flex flex-wrap items-center gap-4">
                    <h3
                      className={clsx(
                        "text-2xl font-bold transition-colors duration-300 md:text-3xl md:leading-[1.3] lg:text-4xl",
                        {
                          "lg:text-black/20": hoveredIndex !== index && hoveredIndex !== null,
                          "lg:text-black": hoveredIndex === index || hoveredIndex === null,
                        },
                      )}
                    >
                      {link.heading}
                    </h3>
                    <div className="border border-neutral-lightest bg-neutral-lightest px-2 py-1 text-sm font-semibold">
                      {link.tag}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Portfolio22Defaults: Props = {
  hoverLinks: [
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
        alt: "Relume placeholder image 4",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-5.svg",
        alt: "Relume placeholder image 5",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-6.svg",
        alt: "Relume placeholder image 6",
      },
    },
  ],
};
