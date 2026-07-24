// @ts-nocheck
import React from "react";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type StatCard = {
  percentage: string;
  title: string;
};

type Stat = {
  image: ImageProps;
  statCards: StatCard[];
};

type Props = {
  heading: string;
  description: string;
  stat: Stat;
};

export type Stats54Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats54 = (props: Stats54Props) => {
  const { heading, description, stat } = {
    ...Stats54Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container flex flex-col items-start">
        <div className="rb-12 mb-12 grid grid-cols-1 items-start justify-between gap-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <h1 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
        <Stat {...stat} />
      </div>
    </section>
  );
};

const Stat = (stat: Stat) => {
  return (
    <div className="grid w-full auto-cols-fr grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {stat.statCards.map((statCard, index) => (
        <React.Fragment key={index}>
          <div
            className={clsx(
              "flex w-full flex-col items-center justify-center border border-border-primary p-8 text-center",
              {
                "md:col-span-2 lg:col-span-1 lg:row-span-2": index === 0,
                "order-2 md:order-1": index === 2,
              },
            )}
          >
            <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              {statCard.percentage}
            </p>
            <h2 className="text-md font-bold leading-[1.4] md:text-xl">{statCard.title}</h2>
          </div>
          {index < 2 && (
            <div className={clsx({ "order-1 md:order-2": index === 1 })}>
              <img
                src={stat.image.src}
                alt={stat.image.alt}
                className="aspect-[3/2] size-full object-cover"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const Stats54Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  stat: {
    image: {
      src: "https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-image.svg",
      alt: "Relume placeholder image",
    },
    statCards: [
      {
        percentage: "30%",
        title: "Short heading goes here",
      },
      {
        percentage: "30%",
        title: "Short heading goes here",
      },
      {
        percentage: "30%",
        title: "Short heading goes here",
      },
    ],
  },
};
