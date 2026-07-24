// @ts-nocheck
"use client"

import { ButtonProps, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import React from "react";

type ImageProps = {
  src: string;
  alt?: string;
};

type Address = {
  line1: string;
  line2: string;
};

type Location = {
  image: ImageProps;
  title: string;
  address: Address;
  button: ButtonProps;
};

type Tab = {
  value: string;
  content: Location;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  tabs: Tab[];
};

export type Contact30Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Contact30 = (props: Contact30Props) => {
  const { tagline, heading, description, tabs } = {
    ...Contact30Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 flex max-w-lg flex-col justify-start md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <Tabs
          defaultValue={tabs[0].value}
          orientation="vertical"
          className="relative grid auto-cols-fr grid-cols-1 gap-12 md:grid-cols-[.5fr_1fr] md:gap-y-16 lg:gap-x-20 lg:gap-y-16"
        >
          <TabsList className="relative grid h-full auto-cols-fr grid-cols-1 gap-x-4 gap-y-10">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className="items-start justify-start border-0 border-l-2 border-border-primary border-transparent px-0 py-0 pl-8 data-[state=active]:border-black data-[state=active]:bg-background-primary data-[state=active]:text-text-primary"
              >
                <div className="text-left">
                  <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                    {tab.content.title}
                  </h3>
                  <div className="inline-block whitespace-normal">
                    <span className="block">{tab.content.address.line1}</span>
                    <span className="block">{tab.content.address.line2}</span>
                  </div>
                  <div className="mt-5 font-semibold md:mt-6">
                    <p>{tab.content.button.title}</p>
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:animate-tabs"
            >
              <div className="relative size-full">
                <img
                  src={tab.content.image.src}
                  alt={tab.content.image.alt}
                  className="size-full object-cover"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export const Contact30Defaults: Props = {
  tagline: "Tagline",
  heading: "Locations",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  tabs: [
    {
      value: "tab-1",
      content: {
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 1",
        },
        title: "Sydney",
        address: { line1: "123 Sample St,", line2: "Sydney NSW 2000 AU" },
        button: {
          title: "View Office",
        },
      },
    },
    {
      value: "tab-2",
      content: {
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 2",
        },
        title: "New York",
        address: { line1: "123 Sample St,", line2: "New York NY 10000 USA" },
        button: {
          title: "View Office",
        },
      },
    },
    {
      value: "tab-3",
      content: {
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 3",
        },
        title: "London",
        address: { line1: "123 Sample St,", line2: "London W1C 1DE, United Kingdom" },
        button: {
          title: "View Office",
        },
      },
    },
  ],
};

export default Contact30;
