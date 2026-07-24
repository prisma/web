// @ts-nocheck
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import { FaCirclePlay } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";

type FeaturedEvent = {
  url: string;
  title: string;
  status: string | null;
  description: string;
  duration: string;
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

export type Event6Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Event6 = (props: Event6Props) => {
  const { tagline, heading, description, tabs } = {
    ...Event6Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto flex w-full max-w-lg flex-col">
          <div className="mb-12 text-center md:mb-18 lg:mb-20">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
          <Tabs defaultValue={tabs[0].value} className="flex flex-col justify-start">
            <TabsList className="no-scrollbar mb-12 flex w-full items-center overflow-auto md:justify-center md:overflow-hidden">
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
                <div className="flex flex-col gap-6 md:gap-8">
                  {tab.content.map((event, index) => (
                    <FeaturedEvent key={index} {...event} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

const FeaturedEvent: React.FC<FeaturedEvent> = ({ duration, status, url, title, description }) => {
  return (
    <div className="grid grid-cols-[1fr_max-content] place-items-center gap-8 overflow-hidden border border-border-primary p-6 md:p-8">
      <div className="flex w-full flex-col items-start justify-start">
        <div className="mb-3 flex flex-wrap items-center gap-4 md:mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MdAccessTime className="size-6 flex-none" />
            <span>{duration} minutes</span>
          </div>
          {status && (
            <p className="bg-background-secondary px-2 py-1 text-sm font-semibold">{status}</p>
          )}
        </div>
        <a href={url} className="mb-3 md:mb-4">
          <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        </a>
        <p>{description}</p>
      </div>
      <Button variant="link" size="link" className="flex">
        <FaCirclePlay className="block text-8xl" />
      </Button>
    </div>
  );
};

export const Event6Defaults: Props = {
  tagline: "Tagline",
  heading: "Webinars",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  tabs: [
    {
      value: "view-all",
      trigger: "View all",
      content: [
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: "Coming soon",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: null,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: null,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
      ],
    },
    {
      value: "category-one",
      trigger: "Category one",
      content: [
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: "Coming soon",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: null,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
      ],
    },
    {
      value: "category-two",
      trigger: "Category two",
      content: [
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: null,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: "Coming soon",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
      ],
    },
    {
      value: "category-three",
      trigger: "Category three",
      content: [
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: "Coming soon",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: null,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
      ],
    },
    {
      value: "category-four",
      trigger: "Category four",
      content: [
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: null,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
        {
          url: "#",
          title: "Webinar title heading",
          duration: "45",
          status: "Coming soon",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        },
      ],
    },
  ],
};
