// @ts-nocheck
"use client"

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Feature = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Tab = {
  value: string;
  trigger: string;
  content: Feature[];
};

type Props = {
  defaultTabValue: string;
  tabs: Tab[];
};

export type Layout402Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout402 = (props: Layout402Props) => {
  const { defaultTabValue, tabs } = {
    ...Layout402Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <Tabs defaultValue={defaultTabValue}>
          <TabsList className="mb-12 gap-6 overflow-x-auto whitespace-nowrap md:mb-16">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className="border-0 border-b-[1.5px] border-border-alternative px-0 py-2 duration-0 data-[state=active]:border-b-[1.5px] data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
              >
                {tab.trigger}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab, index) => (
            <TabsContent key={index} value={tab.value} className="data-[state=active]:animate-tabs">
              {tab.content.map((feature, featureIndex) => (
                <Feature key={featureIndex} {...feature} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

const Feature = (feature: Feature) => {
  return (
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-x-20">
      <div className="max-w-lg">
        <p className="mb-3 font-semibold md:mb-4">{feature.tagline}</p>
        <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          {feature.heading}
        </h2>
        <p className="md:text-md">{feature.description}</p>
        <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
          {feature.buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
      <img src={feature.image.src} className="w-full object-cover" alt={feature.image.alt} />
    </div>
  );
};

export const Layout402Defaults: Props = {
  defaultTabValue: "tab-one",
  tabs: [
    {
      value: "tab-one",
      trigger: "Tab One",
      content: [
        {
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
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 1",
          },
        },
      ],
    },
    {
      value: "tab-two",
      trigger: "Tab Two",
      content: [
        {
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
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 2",
          },
        },
      ],
    },
    {
      value: "tab-three",
      trigger: "Tab Three",
      content: [
        {
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
          image: {
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
            alt: "Relume placeholder image 3",
          },
        },
      ],
    },
  ],
};
