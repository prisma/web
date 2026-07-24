// @ts-nocheck
import * as React from "react";
import type { ButtonProps } from "@relume_io/relume-ui";
import {
  Button,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@relume_io/relume-ui";

type ScheduledEvent = {
  url: string;
  time: string;
  title: string;
  type: string | null;
  status: string;
  speaker: string;
  location: string;
  button: ButtonProps;
};

type scheduledDay = {
  title: string;
  scheduledEvents: ScheduledEvent[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  scheduledDays: scheduledDay[];
};

export type Event31Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event31 = (props: Event31Props) => {
  const { tagline, heading, description, scheduledDays } = {
    ...Event31Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <h4 className="font-semibold">{tagline}</h4>
            <h1 className="mt-3 text-5xl font-bold md:mt-4 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="mt-5 text-base md:mt-6 md:text-md">{description}</p>
          </div>
        </div>
        <Accordion type="multiple">
          {scheduledDays.map((scheduledDay, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="first:border-t-0">
              <AccordionTrigger className="text-2xl md:py-5 md:text-3xl md:leading-[1.3] lg:text-4xl">
                {scheduledDay.title}
              </AccordionTrigger>
              <AccordionContent className="mb-6 pb-0 md:mb-0">
                {scheduledDay.scheduledEvents.map((event, index) => (
                  <ScheduledEvent
                    key={index}
                    url={event.url}
                    time={event.time}
                    title={event.title}
                    type={event.type}
                    status={event.status}
                    speaker={event.speaker}
                    location={event.location}
                    button={event.button}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const ScheduledEvent: React.FC<ScheduledEvent> = ({
  url,
  time,
  title,
  type,
  status,
  speaker,
  location,
  button,
}) => {
  return (
    <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
      <div className="text-md md:text-lg">{time}</div>
      <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
        <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
          <h5 className="text-xl font-bold md:text-2xl">{title}</h5>
          <div className="flex items-center gap-2">
            {type && (
              <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">{type}</div>
            )}
            {status && (
              <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                {status}
              </div>
            )}
          </div>
        </div>
        <div>{speaker}</div>
        <div>{location}</div>
      </div>
      <div className="flex">
        <Button {...button} asChild>
          <a href={url}>{button.title}</a>
        </Button>
      </div>
    </div>
  );
};

export const Event31Defaults: Props = {
  tagline: "Tagline",
  heading: "Schedule",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  scheduledDays: [
    {
      title: "Friday 09 Feb",
      scheduledEvents: [
        {
          url: "#",
          time: "8:00 am",
          title: "Event title heading",
          type: "In-person",
          status: "Online",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "9:00 am",
          title: "Event title heading",
          type: null,
          status: "Online",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "10:00 am",
          title: "Event title heading",
          type: null,
          status: "Online",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
      ],
    },
    {
      title: "Saturday 10 Feb",
      scheduledEvents: [
        {
          url: "#",
          time: "8:00 am",
          title: "Event title heading",
          type: "In-person",
          status: "Online",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "9:00 am",
          title: "Event title heading",
          type: null,
          status: "Online",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "10:00 am",
          title: "Event title heading",
          type: null,
          status: "Online",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
      ],
    },
    {
      title: "Sunday 10 Feb",
      scheduledEvents: [
        {
          url: "#",
          time: "8:00 am",
          title: "Event title heading",
          type: "In-person",
          status: "Online",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "9:00 am",
          title: "Event title heading",
          type: null,
          status: "Online",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "sm",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "10:00 am",
          title: "Event title heading",
          type: null,
          status: "Online",
          speaker: "Speaker",
          location: "Location",
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
