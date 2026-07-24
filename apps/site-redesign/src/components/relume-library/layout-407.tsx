// @ts-nocheck
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type TabTrigger = {
  heading: string;
  description: string;
};

type Tab = {
  value: string;
  trigger: TabTrigger;
  content: ImageProps[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  defaultTabValue: string;
  tabs: Tab[];
};

export type Layout407Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout407 = (props: Layout407Props) => {
  const { tagline, heading, description, defaultTabValue, tabs } = {
    ...Layout407Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <Tabs defaultValue={defaultTabValue}>
          {tabs.map((tab, index) => (
            <TabsContent key={index} value={tab.value} className="data-[state=active]:animate-tabs">
              {tab.content.map((feature, featureIndex) => (
                <div key={featureIndex}>
                  <img src={feature.src} className="size-full object-cover" alt={feature.alt} />
                </div>
              ))}
            </TabsContent>
          ))}
          <TabsList className="mt-12 flex-col md:mt-16 md:flex-row">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className="flex w-full flex-col gap-1 whitespace-normal border-0 border-t-[1.5px] border-border-alternative px-6 py-4 text-center duration-0 data-[state=active]:border-t-[1.5px] data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
              >
                <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                  {tab.trigger.heading}
                </h3>
                <p>{tab.trigger.description}</p>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
};

export const Layout407Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  defaultTabValue: "tab-one",
  tabs: [
    {
      value: "tab-one",
      trigger: {
        heading: "Short heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      },
      content: [
        {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 1",
        },
      ],
    },
    {
      value: "tab-two",
      trigger: {
        heading: "Short heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      },
      content: [
        {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 2",
        },
      ],
    },
    {
      value: "tab-three",
      trigger: {
        heading: "Short heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      },
      content: [
        {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 3",
        },
      ],
    },
  ],
};
