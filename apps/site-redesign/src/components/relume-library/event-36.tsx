// @ts-nocheck
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiMap } from "react-icons/bi";

type ImageProps = {
  src: string;
  alt?: string;
};

type EventTime = {
  start: string;
  end: string;
};

type ScheduledEvent = {
  url: string;
  eventTime: EventTime;
  title: string;
  speaker: string;
  description: string;
  button: ButtonProps;
  image: ImageProps;
  location: string;
};

type Tab = {
  value: string;
  trigger: string;
  content: ScheduledEvent[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  tabs: Tab[];
};

export type Event36Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event36 = (props: Event36Props) => {
  const { tagline, heading, description, tabs } = {
    ...Event36Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="flex flex-col justify-start">
          <TabsList className="no-scrollbar mb-12 ml-[-5vw] flex w-screen items-center overflow-auto pl-[5vw] md:ml-0 md:w-full md:overflow-hidden md:pl-0">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className="px-4 data-[state=active]:border data-[state=active]:border-border-primary data-[state=inactive]:border-transparent data-[state=active]:bg-transparent data-[state=active]:text-neutral-black"
              >
                {tab.trigger}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:animate-tabs"
            >
              <div className="flex flex-col gap-y-6 md:gap-y-8">
                {tab.content.map((event, index) => (
                  <ScheduledEvent key={index} {...event} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

const ScheduledEvent: React.FC<ScheduledEvent> = ({
  url,
  eventTime,
  title,
  speaker,
  description,
  button,
  image,
  location,
}) => {
  return (
    <div className="grid auto-cols-fr items-center border border-border-primary lg:grid-cols-2">
      <div className="p-6 md:p-8">
        <div className="text-md md:text-lg">
          {eventTime.start} - {eventTime.end}
        </div>
        <div className="mt-5 text-xl font-bold md:mt-6 md:text-2xl">{title}</div>
        <div className="mt-5 md:mt-6">
          <div className="font-semibold">Speaker</div>
          <div className="mt-2">{speaker}</div>
        </div>
        <div className="mt-5 md:mt-6">
          <div className="font-semibold">Details</div>
          <div className="mt-2">{description}</div>
        </div>
        <Button {...button} className="mt-5 md:mt-6" asChild>
          <a href={url} className="w-full">
            {button.title}
          </a>
        </Button>
      </div>
      <a href={url} className="relative block aspect-video size-full lg:aspect-auto">
        <img src={image.src} alt={image.alt} className="absolute size-full object-cover" />
        <div className="absolute right-6 top-6 flex items-center bg-background-secondary px-2 py-1 text-sm font-semibold md:right-8 md:top-8">
          <div className="flex items-center gap-2">
            <BiMap className="size-6 flex-none" />
            <span>{location}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export const Event36Defaults: Props = {
  tagline: "Tagline",
  heading: "Schedule",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  tabs: [
    {
      value: "fri-09-feb",
      trigger: "Fri 09 Feb",
      content: [
        {
          url: "#",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 1",
          },
          location: "Location",
        },
        {
          url: "#",
          eventTime: {
            start: "9:00 am",
            end: "10:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 2",
          },
          location: "Location",
        },
        {
          url: "#",
          eventTime: {
            start: "10:00 am",
            end: "11:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 3",
          },
          location: "Location",
        },
      ],
    },
    {
      value: "sat-10-feb",
      trigger: "Sat 10 Feb",
      content: [
        {
          url: "#",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 4",
          },
          location: "Location",
        },
        {
          url: "#",
          eventTime: {
            start: "9:00 am",
            end: "10:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 5",
          },
          location: "Location",
        },
        {
          url: "#",
          eventTime: {
            start: "10:00 am",
            end: "11:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 6",
          },
          location: "Location",
        },
      ],
    },
    {
      value: "sun-11-feb",
      trigger: "Sun 11 Feb",
      content: [
        {
          url: "#",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 7",
          },
          location: "Location",
        },
        {
          url: "#",
          eventTime: {
            start: "9:00 am",
            end: "10:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 8",
          },
          location: "Location",
        },
        {
          url: "#",
          eventTime: {
            start: "10:00 am",
            end: "11:00 am",
          },
          title: "Event title heading",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 9",
          },
          location: "Location",
        },
      ],
    },
  ],
};
