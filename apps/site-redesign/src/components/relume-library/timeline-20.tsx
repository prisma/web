// @ts-nocheck
import React from "react";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import clsx from "clsx";

type TimelineItem = {
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

export type Timeline20Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Timeline20 = (props: Timeline20Props) => {
  const { tagline, heading, description, buttons, timelineItems } = {
    ...Timeline20Defaults,
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
        <div className="relative grid auto-cols-fr grid-flow-row grid-cols-1 items-center justify-center md:grid-flow-col md:grid-cols-[max-content_1fr] md:justify-normal">
          <div className="relative hidden md:grid md:grid-cols-1 md:gap-4">
            <div className="flex flex-col items-center md:w-full md:flex-row">
              <div className="h-full w-[3px] bg-black md:h-[3px] md:w-full" />
            </div>
          </div>
          <React.Fragment>
            {timelineItems.map((item, index) => (
              <TimelineItem
                key={index}
                index={index}
                isLastItem={index === timelineItems.length - 1}
                {...item}
              />
            ))}
          </React.Fragment>
          <div className="absolute right-0 z-0 h-1 w-16 bg-gradient-to-r from-transparent to-white" />
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({
  date,
  description,
  index,
  isLastItem,
}: {
  date: string;
  description: string;
  index: number;
  isLastItem: boolean;
}) => {
  const isEven = index % 2 === 0;

  const ContentComponent = ({ className }: { className?: string }) => (
    <React.Fragment>
      <div className={clsx("mb-8 flex flex-col items-start md:mb-0 md:mr-4", className)}>
        <h3 className="mb-2 text-xl font-bold md:text-2xl">{date}</h3>
        <p>{description}</p>
      </div>
    </React.Fragment>
  );

  const LineComponent = () => (
    <div className="flex flex-col items-center md:w-full md:flex-row">
      <div className="z-20 size-[0.9375rem] flex-none rounded-full bg-black shadow-[0_0_0_8px_white]" />
      <div
        className={clsx("h-full w-[3px] bg-black md:h-[3px] md:w-full", {
          "hidden md:block": isLastItem,
        })}
      />
    </div>
  );

  return (
    <div className="relative grid auto-cols-fr grid-cols-[max-content_1fr] gap-4 md:grid-cols-1 md:grid-rows-[1fr_max-content_1fr]">
      {isEven ? (
        <React.Fragment>
          <div className="hidden md:block" />
          <LineComponent />
          <ContentComponent />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ContentComponent className="order-last md:order-none" />
          <LineComponent />
          <div className="hidden md:block" />
        </React.Fragment>
      )}
    </div>
  );
};

export const Timeline20Defaults: Props = {
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
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      date: "Date",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
  ],
};
