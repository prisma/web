// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import React from "react";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type TimelineItem = {
  date: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Tab = {
  value: string;
  trigger: string;
  content: TimelineItem;
};

type Props = {
  defaultValue?: string;
  tabs: Tab[];
};

export type Timeline15Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Timeline15 = (props: Timeline15Props) => {
  const { defaultValue, tabs } = {
    ...Timeline15Defaults,
    ...props,
  };

  const [activeTab, setActiveTab] = useState(defaultValue);

  const isTabActive = (tabIndex: number) => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
    return tabIndex <= activeIndex;
  };

  const progressWidth = () => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
    return `${(100 / (tabs.length * 2)) * (activeIndex * 2 + 1)}%`;
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative">
        <div
          className="absolute bottom-[99px] z-10 h-[3px] bg-neutral-black transition-[width] duration-300 md:bottom-[3.5625rem]"
          style={{ width: progressWidth() }}
        />
        <Tabs
          defaultValue={defaultValue}
          onValueChange={setActiveTab}
          className="relative flex flex-col"
        >
          {tabs.map((tab, index) => (
            <TabsContent
              key={index}
              value={tab.value}
              className="grid grid-cols-1 gap-x-12 gap-y-12 data-[state=active]:animate-tabs md:grid-cols-2 md:items-center md:gap-y-16 lg:gap-x-20"
            >
              <TimelineItem item={tab} />
            </TabsContent>
          ))}
          <TabsList className="no-scrollbar relative mb-12 ml-[-5vw] mt-16 flex w-screen items-center justify-start border-b border-b-transparent px-[5vw] md:mb-0 md:ml-0 md:w-auto md:justify-between md:px-0">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className={clsx(
                  "relative flex flex-1 flex-col items-center justify-center gap-2 border-0 px-0 transition-colors duration-300 data-[state=active]:bg-transparent",
                  isTabActive(index)
                    ? "data-[state=active]:text-text-primary"
                    : "text-neutral-light",
                )}
              >
                {index === 0 && (
                  <div className="absolute left-0 top-3.5 z-20 h-[6px] w-16 bg-gradient-to-l from-transparent to-background-primary" />
                )}
                <div className="flex w-full items-center ">
                  <div className="h-[3px] w-full bg-neutral-lighter" />
                  <div
                    className={clsx(
                      "z-20 flex size-[0.9375rem] flex-none items-center justify-center rounded-full shadow-[0_0_0_8px_white]",
                      isTabActive(index) ? "bg-neutral-black" : "bg-neutral-light",
                    )}
                  />
                  <div className="h-[3px] w-full bg-neutral-lighter" />
                </div>
                <span className="text-xl font-bold md:text-2xl">{tab.trigger}</span>
                {index === tabs.length - 1 && (
                  <div className="absolute right-0 top-3.5 z-0 h-2 w-16 bg-gradient-to-r from-transparent to-background-primary" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
};

const TimelineItem = ({ item }: { item: Tab }) => {
  return (
    <React.Fragment>
      <div>
        <h3 className="mb-3 text-4xl font-bold leading-[1.2] md:mb-4 md:text-5xl lg:text-6xl">
          {item.content.date}
        </h3>
        <h4 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
          {item.content.heading}
        </h4>
        <p className="md:text-md">{item.content.description}</p>
        <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
          {item.content.buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <img
          src={item.content.image.src}
          alt={item.content.image.alt}
          className="w-full object-cover"
        />
      </div>
    </React.Fragment>
  );
};

export const Timeline15Defaults: Props = {
  defaultValue: "tab-one",
  tabs: [
    {
      value: "tab-one",
      trigger: "Date",
      content: {
        date: "Date",
        heading: "Long heading is what you see here in this feature section",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [
          { title: "Button", variant: "secondary" },
          { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
        ],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 1",
        },
      },
    },
    {
      value: "tab-two",
      trigger: "Date",
      content: {
        date: "Date",
        heading: "Long heading is what you see here in this feature section",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [
          { title: "Button", variant: "secondary" },
          { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
        ],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 2",
        },
      },
    },
    {
      value: "tab-three",
      trigger: "Date",
      content: {
        date: "Date",
        heading: "Long heading is what you see here in this feature section",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [
          { title: "Button", variant: "secondary" },
          { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
        ],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 3",
        },
      },
    },
    {
      value: "tab-four",
      trigger: "Date",
      content: {
        date: "Date",
        heading: "Long heading is what you see here in this feature section",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [
          { title: "Button", variant: "secondary" },
          { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
        ],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 4",
        },
      },
    },
    {
      value: "tab-five",
      trigger: "Date",
      content: {
        date: "Date",
        heading: "Long heading is what you see here in this feature section",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [
          { title: "Button", variant: "secondary" },
          { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
        ],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 5",
        },
      },
    },
  ],
};
