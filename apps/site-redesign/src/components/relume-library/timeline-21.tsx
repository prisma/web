// @ts-nocheck
import React from "react";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type TimelineItem = {
  image: ImageProps;
  date: string;
  description: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  timelineItems: TimelineItem[];
};

export type Timeline21Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Timeline21 = (props: Timeline21Props) => {
  const { tagline, heading, description, buttons, timelineItems } = {
    ...Timeline21Defaults,
    ...props,
  };

  return (
    <section id="relume" className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative grid auto-cols-fr grid-flow-row grid-cols-1 items-center justify-items-center md:grid-flow-col md:grid-cols-[max-content_1fr] md:justify-items-stretch">
          <div className="relative hidden md:grid md:grid-cols-1 md:items-end md:gap-4">
            <div className="flex size-full flex-col items-center md:h-auto md:flex-row">
              <div className="h-full w-[3px] bg-black md:h-[3px] md:w-full" />
            </div>
          </div>
          {timelineItems.map((item, index) => (
            <TimelineItem
              key={index}
              index={index}
              isLastItem={index === timelineItems.length - 1}
              {...item}
            />
          ))}
          <div className="absolute right-0 z-0 h-1 w-16 bg-gradient-to-r from-transparent to-white" />
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({
  image,
  date,
  description,
  index,
  isLastItem,
}: {
  image: ImageProps;
  date: string;
  description: string;
  index: number;
  isLastItem: boolean;
}) => {
  const isEven = index % 2 === 0;

  const ContentComponent = ({ className }: { className?: string }) => (
    <div
      className={clsx(
        "order-last mb-4 flex flex-col items-start self-start pr-4 sm:mb-0 md:order-none",
        className,
      )}
    >
      <h3 className="mb-2 text-xl font-bold md:text-2xl">{date}</h3>
      <p>{description}</p>
    </div>
  );

  const LineComponent = () => (
    <div className="flex size-full flex-col items-center md:h-auto md:flex-row">
      <div className="z-20 size-[0.9375rem] flex-none rounded-full bg-black shadow-[0_0_0_8px_white]" />
      <div
        className={clsx("h-full w-[3px] bg-black md:h-[3px] md:w-full", {
          "hidden md:block": isLastItem,
        })}
      />
    </div>
  );

  return (
    <div className="relative grid w-full auto-cols-fr grid-cols-[0.5fr_max-content_1fr] items-start gap-4 sm:w-auto md:grid-cols-1 md:grid-rows-[1fr_max-content_1fr] md:items-end">
      {isEven ? (
        <React.Fragment>
          <div className="mb-8 overflow-hidden md:mb-0 md:mr-10">
            <img src={image.src} alt={image.alt} className="aspect-square w-full object-cover" />
          </div>
          <LineComponent />
          <ContentComponent />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ContentComponent className="md:self-end" />
          <LineComponent />
          <div className="col-end-2 row-end-2 mb-8 self-start overflow-hidden md:col-end-auto md:row-end-auto md:mb-0 md:mr-10">
            <img src={image.src} alt={image.alt} className="aspect-square w-full object-cover" />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export const Timeline21Defaults: Props = {
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
  timelineItems: [
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 2",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 3",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 4",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 5",
      },
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
  ],
};
