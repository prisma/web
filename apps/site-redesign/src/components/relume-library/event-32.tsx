// @ts-nocheck
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

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

export type Event32Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event32 = (props: Event32Props) => {
  const { tagline, heading, description, tabs } = {
    ...Event32Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <div className="mx-auto max-w-lg text-center">
              <h4 className="font-semibold">{tagline}</h4>
              <h1 className="mt-3 text-5xl font-bold md:mt-4 md:text-7xl lg:text-8xl">{heading}</h1>
              <p className="mt-5 text-base md:mt-6 md:text-md">{description}</p>
            </div>
          </div>
          <Tabs defaultValue={tabs[0].value} className="flex flex-col justify-start">
            <TabsList className="no-scrollbar mb-12 ml-[-5vw] flex w-screen items-center overflow-auto pl-[5vw] md:ml-0 md:w-full md:justify-center md:overflow-hidden md:pl-0">
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
                {tab.content.map((event, index) => (
                  <ScheduledEvent key={index} {...event} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
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
    <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 last-of-type:border-b md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
      <span className="text-md md:text-lg">{time}</span>
      <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
        <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
          <h5 className="text-xl font-bold md:text-2xl">{title}</h5>
          <div className="flex items-center gap-2">
            {type && (
              <span className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                {type}
              </span>
            )}
            {status && (
              <span className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                {status}
              </span>
            )}
          </div>
        </div>
        <span>{speaker}</span>
        <span>{location}</span>
      </div>
      <div className="flex">
        <Button {...button} asChild>
          <a href={url}>{button.title}</a>
        </Button>
      </div>
    </div>
  );
};

export const Event32Defaults: Props = {
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
      value: "sat-10-feb",
      trigger: "Sat 10 Feb",
      content: [
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
      value: "sun-11-feb",
      trigger: "Sun 11 Feb",
      content: [
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
