// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
import { RxChevronRight } from "react-icons/rx";

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

export type Timeline19Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Timeline19 = (props: Timeline19Props) => {
  const { tagline, heading, description, buttons, timelineItems } = {
    ...Timeline19Defaults,
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
        <div className="relative grid auto-cols-fr grid-cols-1 md:flex">
          {timelineItems.map((item, index) => (
            <TimelineItem
              key={index}
              isFirstItem={index === 0}
              isLastItem={index === timelineItems.length - 1}
              {...item}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({
  image,
  date,
  description,
  isFirstItem,
  isLastItem,
}: {
  image: ImageProps;
  date: string;
  description: string;
  isFirstItem: boolean;
  isLastItem: boolean;
}) => {
  return (
    <div className="relative grid auto-cols-fr grid-cols-[0.5fr_max-content_1fr] items-start gap-4 md:flex md:flex-col md:items-center md:gap-0">
      <div className="mb-8 w-full overflow-hidden md:mb-0 md:w-3/5">
        <img src={image.src} alt={image.alt} className="w-full" />
      </div>
      <div className="relative flex flex-col items-center self-stretch md:mb-4 md:mt-8 md:w-full md:flex-row md:self-auto">
        {isFirstItem && (
          <div className="absolute left-0 top-1.5 z-10 hidden h-1 w-16 bg-gradient-to-r from-background-primary to-transparent md:block" />
        )}
        <div className="h-2 w-[3px] bg-neutral-black md:h-[3px] md:w-full" />
        <div className="z-20 size-[0.9375rem] flex-none rounded-full bg-neutral-black shadow-[0_0_0_8px_white]" />
        <div
          className={clsx("h-full w-[3px] bg-neutral-black md:h-[3px] md:w-full", {
            "hidden md:block": isLastItem,
          })}
        />
        {isLastItem && (
          <div className="absolute right-0 top-1.5 z-0 hidden h-1 w-16 bg-gradient-to-l from-background-primary to-transparent md:block" />
        )}
      </div>
      <div className="pb-4 sm:pb-0 md:mb-0 md:px-3 md:text-center">
        <h3 className="mb-2 text-xl font-bold md:text-2xl">{date}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export const Timeline19Defaults: Props = {
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
