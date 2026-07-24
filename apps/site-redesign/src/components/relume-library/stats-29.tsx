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

type CardProps = {
  percentage?: string;
  heading?: string;
  description?: string;
  image?: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  cards: CardProps[];
};

export type Stats29Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats29 = (props: Stats29Props) => {
  const { tagline, heading, description, cards, buttons } = {
    ...Stats29Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 lg:mb-20 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">{heading}</h2>
          </div>

          <div>
            <p className=" md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Card key={index} {...card} isFirst={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Card = ({ isFirst, ...card }: CardProps & { isFirst?: boolean }) => {
  return (
    <React.Fragment>
      {card.image ? (
        <div>
          <img
            className="aspect-[3/2] size-full object-cover"
            src={card.image.src}
            alt={card.image.alt}
          />
        </div>
      ) : (
        <div className="border border-border-primary p-8 first:flex first:flex-col first:md:col-span-2 first:md:row-span-1 first:lg:col-span-1 first:lg:row-span-2 [&:nth-last-child(2)]:order-last [&:nth-last-child(2)]:md:order-none">
          <p className="mb-8 text-10xl font-bold leading-[1.3] md:mb-10 md:text-[4rem] lg:mb-12 lg:text-[5rem]">
            {card.percentage}
          </p>
          <h3
            className={clsx("text-md font-bold leading-[1.4] first:mt-auto md:text-xl", {
              "mt-auto": isFirst,
            })}
          >
            {card.heading}
          </h3>
          <p className="mt-2">{card.description}</p>
        </div>
      )}
    </React.Fragment>
  );
};

export const Stats29Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
  cards: [
    {
      percentage: "30%",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image",
      },
    },
    {
      percentage: "30%",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      percentage: "30%",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image",
      },
    },
  ],
};
