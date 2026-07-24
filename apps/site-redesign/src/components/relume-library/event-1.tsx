// @ts-nocheck
import type { ButtonProps } from "@relume_io/relume-ui";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";

type Date = {
  weekday: string;
  day: string;
  month: string;
  year: string;
};

type FeaturedEvent = {
  url: string;
  date: Date;
  title: string;
  status: string | null;
  location: string;
  description: string;
  button: ButtonProps;
};

type Tab = {
  value: string;
  trigger: string;
  content: FeaturedEvent[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  tabs: Tab[];
};

export type Event1Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event1 = (props: Event1Props) => {
  const { tagline, heading, description, tabs } = {
    ...Event1Defaults,
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
              {tab.content.map((event, index) => (
                <FeaturedEvent key={index} {...event} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

const FeaturedEvent: React.FC<FeaturedEvent> = ({
  date,
  url,
  title,
  location,
  status,
  description,
  button,
}) => {
  return (
    <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-border-primary py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
      <div className="flex min-w-28 flex-col items-center border border-border-primary bg-background-primary px-1 py-3 text-base">
        <span>{date.weekday}</span>
        <span className="text-2xl font-bold md:text-3xl lg:text-4xl">{date.day}</span>
        <span>
          {date.month} {date.year}
        </span>
      </div>
      <div className="flex w-full flex-col items-start justify-start">
        <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
          <a href={url}>
            <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
          </a>
          {status && (
            <p className="bg-background-secondary px-2 py-1 text-sm font-semibold">{status}</p>
          )}
        </div>
        <p className="mb-3 text-sm md:mb-4">{location}</p>
        <p>{description}</p>
      </div>
      <div className="flex">
        <Button {...button} className="flex items-center justify-center">
          {button.title}
        </Button>
      </div>
    </div>
  );
};

export const Event1Defaults: Props = {
  tagline: "Tagline",
  heading: "Events",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  tabs: [
    {
      value: "view-all",
      trigger: "View all",
      content: [
        {
          url: "#",
          date: {
            weekday: "Fri",
            day: "09",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: "Sold out",
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sat",
            day: "10",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: null,
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sun",
            day: "11",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: null,
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
      ],
    },
    {
      value: "category-one",
      trigger: "Category one",
      content: [
        {
          url: "#",
          date: {
            weekday: "Fri",
            day: "09",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: "Sold out",
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sat",
            day: "10",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: null,
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
      ],
    },
    {
      value: "category-two",
      trigger: "Category two",
      content: [
        {
          url: "#",
          date: {
            weekday: "Fri",
            day: "09",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: "Sold out",
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sat",
            day: "10",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: null,
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
      ],
    },
    {
      value: "category-three",
      trigger: "Category three",
      content: [
        {
          url: "#",
          date: {
            weekday: "Fri",
            day: "09",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: "Sold out",
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sat",
            day: "10",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: null,
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
      ],
    },
    {
      value: "category-four",
      trigger: "Category four",
      content: [
        {
          url: "#",
          date: {
            weekday: "Fri",
            day: "09",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: "Sold out",
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
        {
          url: "#",
          date: {
            weekday: "Sat",
            day: "10",
            month: "Feb",
            year: "2024",
          },
          title: "Event title heading",
          status: null,
          location: "Location",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
          button: {
            variant: "secondary",
            size: "sm",
            title: "Save my spot",
          },
        },
      ],
    },
  ],
};
