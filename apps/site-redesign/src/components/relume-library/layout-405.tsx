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

export type Layout405Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout405 = (props: Layout405Props) => {
  const { defaultTabValue, tabs } = {
    ...Layout405Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <Tabs defaultValue={defaultTabValue}>
          <TabsList className="mb-12 items-center justify-center gap-6 md:mb-16">
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
    <div className="flex flex-col items-center">
      <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
        <img src={feature.image.src} className="size-full object-cover" alt={feature.image.alt} />
      </div>
      <div className="w-full max-w-lg text-center">
        <p className="mb-3 font-semibold md:mb-4">{feature.tagline}</p>
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          {feature.heading}
        </h2>
        <p className="md:text-md">{feature.description}</p>
        <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
          {feature.buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Layout405Defaults: Props = {
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
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
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
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
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
            src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
            alt: "Relume placeholder image 3",
          },
        },
      ],
    },
  ],
};
