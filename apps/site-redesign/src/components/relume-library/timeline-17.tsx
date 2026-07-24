// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
import { RxChevronRight } from "react-icons/rx";

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

export type Timeline17Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Timeline17 = (props: Timeline17Props) => {
  const { tagline, heading, description, buttons, timelineItems } = {
    ...Timeline17Defaults,
    ...props,
  };

  return (
    <section id="relume" className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="relative flex flex-col md:flex-row">
          <div className="absolute left-0 top-1.5 z-10 hidden h-1 w-16 bg-gradient-to-r from-background-primary to-transparent md:block" />
          {timelineItems.map((item, index) => (
            <TimelineItem key={index} isLastItem={index === timelineItems.length - 1} {...item} />
          ))}
          <div className="absolute right-0 top-1.5 z-0 hidden h-1 w-16 bg-gradient-to-l from-background-primary to-transparent md:block" />
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({
  date,
  description,
  isLastItem,
}: {
  date: string;
  description: string;
  isLastItem: boolean;
}) => {
  return (
    <div className="relative flex gap-4 md:flex-col md:gap-0">
      <div className="flex flex-col items-center md:mb-4 md:w-full md:flex-row">
        <div className="h-2 w-[3px] bg-neutral-black md:h-[3px] md:w-full" />
        <div className="z-20 size-[0.9375rem] flex-none rounded-full bg-neutral-black shadow-[0_0_0_8px_white]" />
        <div
          className={clsx("h-full w-[3px] bg-neutral-black md:h-[3px] md:w-full", {
            "hidden md:block": isLastItem,
          })}
        />
      </div>
      <div className="mb-6 px-3 md:mb-0 md:text-center">
        <h3 className="mb-2 text-xl font-bold md:text-2xl">{date}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export const Timeline17Defaults: Props = {
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
