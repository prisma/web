// @ts-nocheck
"use client"

import React, { useState } from "react";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";

type ImageProps = {
  src: string;
  alt?: string;
};

type TabContent = {
  value: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type TabTrigger = {
  value: string;
  text: string;
};

type Tab = {
  trigger: TabTrigger[];
  content: TabContent[];
};

type Props = {
  defaultTabValue: string;
  tabs: Tab;
};

export type Header103Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header103 = (props: Header103Props) => {
  const { defaultTabValue, tabs } = {
    ...Header103Defaults,
    ...props,
  };

  const [activeTab, setActiveTab] = useState(defaultTabValue);

  return (
    <section id="relume" className="relative min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <AnimatePresence initial={false}>
          {tabs.content.map(
            (content, index) =>
              content.value === activeTab && (
                <TabsContent
                  key={index}
                  value={content.value}
                  className="relative max-h-[60rem] min-h-screen overflow-visible"
                >
                  <TabContent {...content} />
                </TabsContent>
              ),
          )}
        </AnimatePresence>
        <TabsList className="absolute bottom-12 left-0 right-0 top-auto z-20 mx-auto flex justify-center gap-4 px-[5vw] md:bottom-16 lg:bottom-20 lg:max-w-xl">
          {tabs.trigger.map((trigger, index) => (
            <TabsTrigger
              key={index}
              value={trigger.value}
              onClick={() => setActiveTab(trigger.value)}
              className="relative flex-1 whitespace-normal border-0 bg-transparent px-4 py-4 text-center text-neutral-light duration-0 data-[state=active]:bg-transparent data-[state=active]:text-neutral-white sm:px-8 md:min-w-32"
            >
              <span>{trigger.text}</span>
              <div className="absolute inset-0 top-auto h-1 w-full bg-white/20">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: activeTab === trigger.value ? "100%" : "0%" }}
                  transition={{
                    duration: activeTab === trigger.value ? 1.5 : 0.3,
                    ...(activeTab === trigger.value
                      ? {
                          type: "spring",
                          stiffness: 25,
                          damping: 30,
                        }
                      : { ease: "easeInOut" }),
                  }}
                />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </section>
  );
};

const TabContent = ({ ...content }: TabContent) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="px-[5%] py-16 md:py-24 lg:py-28">
        <motion.div
          className="relative z-10 mx-auto max-w-lg text-center"
          initial={{ y: "20%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-20%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="mb-5 text-6xl font-bold text-text-alternative md:mb-6 md:text-9xl lg:text-10xl">
            {content.heading}
          </h1>
          <p className="text-text-alternative md:text-md">{content.description}</p>
          <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
            {content.buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/50" />
        <img className="size-full object-cover" src={content.image.src} alt={content.image.alt} />
      </div>
    </div>
  );
};

export const Header103Defaults: Props = {
  defaultTabValue: "tab-one",
  tabs: {
    trigger: [
      {
        value: "tab-one",
        text: "Tab 1",
      },
      {
        value: "tab-two",
        text: "Tab 2",
      },
      {
        value: "tab-three",
        text: "Tab 3",
      },
      {
        value: "tab-four",
        text: "Tab 4",
      },
    ],
    content: [
      {
        value: "tab-one",
        heading: "Medium length hero heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [{ title: "Button" }, { title: "Button", variant: "secondary-alt" }],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 1",
        },
      },
      {
        value: "tab-two",
        heading: "Medium length hero heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [{ title: "Button" }, { title: "Button", variant: "secondary-alt" }],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 2",
        },
      },
      {
        value: "tab-three",
        heading: "Medium length hero heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [{ title: "Button" }, { title: "Button", variant: "secondary-alt" }],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 3",
        },
      },
      {
        value: "tab-four",
        heading: "Medium length hero heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        buttons: [{ title: "Button" }, { title: "Button", variant: "secondary-alt" }],
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 4",
        },
      },
    ],
  },
};
