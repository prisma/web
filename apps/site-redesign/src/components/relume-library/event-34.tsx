// @ts-nocheck
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiMap } from "react-icons/bi";

type ImageProps = {
  src: string;
  alt?: string;
};

type ScheduledEvent = {
  url: string;
  time: string;
  image: ImageProps;
  title: string;
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

export type Event34Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event34 = (props: Event34Props) => {
  const { tagline, heading, description, tabs } = {
    ...Event34Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
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
  time,
  image,
  title,
  speaker,
  location,
  button,
}) => {
  return (
    <div className="grid grid-cols-1 items-center gap-8 border border-border-primary p-6 sm:gap-4 md:grid-cols-[6rem_max-content_1fr_max-content] md:gap-8 md:p-8">
      <div className="text-md md:text-lg">{time}</div>
      <div className="w-full md:w-36">
        <a href={url} className="relative block aspect-[3/2] md:aspect-square">
          <img src={image.src} alt={image.alt} className="absolute size-full object-cover" />
        </a>
      </div>
      <div className="grid auto-cols-fr grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_.25fr]">
        <div>
          <h5 className="text-xl font-bold md:text-2xl">{title}</h5>
          <div>{speaker}</div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BiMap className="size-6 flex-none" />
          <span>{location}</span>
        </div>
      </div>
      <Button {...button} asChild>
        <a href={url}>{button.title}</a>
      </Button>
    </div>
  );
};

export const Event34Defaults: Props = {
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
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "9:00 am",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 2",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "10:00 am",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 3",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
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
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 4",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "9:00 am",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 5",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "10:00 am",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 6",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
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
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 7",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "9:00 am",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 8",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
        },
        {
          url: "#",
          time: "10:00 am",
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 9",
          },
          title: "Event title heading",
          speaker: "Speaker",
          location: "Location",
          button: {
            variant: "secondary",
            size: "primary",
            title: "View details",
          },
        },
      ],
    },
  ],
};
