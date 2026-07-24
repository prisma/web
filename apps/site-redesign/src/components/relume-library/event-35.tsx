// @ts-nocheck
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Date = {
  weekday: string;
  day: string;
  month: string;
  year: string | null;
};

type EventTime = {
  start: string;
  end: string;
};

type ScheduledEvent = {
  url: string;
  date: Date;
  title: string;
  eventTime: EventTime;
  location: string;
  speaker: string;
  description: string;
  image: ImageProps;
  button: ButtonProps;
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

export type Event35Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event35 = (props: Event35Props) => {
  const { tagline, heading, description, tabs } = {
    ...Event35Defaults,
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
  date,
  title,
  eventTime,
  location,
  speaker,
  description,
  image,
  button,
}) => {
  return (
    <div className="grid auto-cols-fr place-items-start gap-8 border border-border-primary p-6 md:p-8 lg:grid-cols-[max-content_1fr_1fr]">
      <div className="w-48 text-xl font-bold md:text-2xl">
        {date.weekday} {date.day} {date.month} {date.year}
      </div>
      <div>
        <div className="text-xl font-bold md:text-2xl">{title}</div>
        <div className="mt-5 md:mt-6">
          <div className="font-semibold">Time</div>
          <div className="mt-2">
            {eventTime.start} - {eventTime.end}
          </div>
        </div>
        <div className="mt-5 md:mt-6">
          <div className="font-semibold">Location</div>
          <div className="mt-2">{location}</div>
        </div>
        <div className="mt-5 md:mt-6">
          <div className="font-semibold">Speaker</div>
          <div className="mt-2">{speaker}</div>
        </div>
        <div className="mt-5 md:mt-6">
          <div className="font-semibold">Details</div>
          <div className="mt-2">{description}</div>
        </div>
        <Button {...button} className="mt-5 md:mt-6" asChild>
          <a href={url}>{button.title}</a>
        </Button>
      </div>
      <a href={url} className="relative block aspect-[3/2] size-full lg:aspect-auto">
        <img src={image.src} alt={image.alt} className="absolute size-full object-cover" />
      </a>
    </div>
  );
};

export const Event35Defaults: Props = {
  tagline: "Tagline",
  heading: "Schedule",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  tabs: [
    {
      value: "week-1",
      trigger: "Week 1",
      content: [
        {
          url: "#",
          date: {
            weekday: "Friday",
            day: "09",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Saturday",
            day: "10",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sunday",
            day: "11",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
      ],
    },
    {
      value: "week-2",
      trigger: "Week 2",
      content: [
        {
          url: "#",
          date: {
            weekday: "Friday",
            day: "09",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Saturday",
            day: "10",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sunday",
            day: "11",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
      ],
    },
    {
      value: "week-3",
      trigger: "Week 3",
      content: [
        {
          url: "#",
          date: {
            weekday: "Friday",
            day: "09",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Saturday",
            day: "10",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sunday",
            day: "11",
            month: "Feb",
            year: null,
          },
          title: "Event title heading",
          eventTime: {
            start: "8:00 am",
            end: "9:00 am",
          },
          location: "123 Sample St, Sydney",
          speaker: "Full name",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
      ],
    },
  ],
};
