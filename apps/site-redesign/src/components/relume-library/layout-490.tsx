// @ts-nocheck
"use client"

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VideoIframe,
} from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type VideoProps = {
  image: ImageProps;
  url: string;
};

type TabProps = {
  value: string;
  heading: string;
  description: string;
  image?: ImageProps;
  video?: VideoProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  tabs: TabProps[];
  buttons: ButtonProps[];
  defaultTabValue: string;
};

export type Layout490Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout490 = (props: Layout490Props) => {
  const { tagline, heading, description, tabs, buttons, defaultTabValue } = {
    ...Layout490Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="relative md:flex md:flex-col md:items-end">
          <div className="md:w-1/2 md:pl-6 lg:pl-10">
            <div className="mb-8">
              <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
              <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
              <p className="md:text-md">{description}</p>
            </div>
            <Tabs defaultValue={defaultTabValue}>
              {tabs.map((tab, index) => (
                <TabsContent
                  key={index}
                  value={tab.value}
                  className="relative bottom-0 left-0 top-0 flex size-full items-center justify-center data-[state=active]:animate-tabs md:absolute md:w-1/2 md:pr-6 lg:pr-10"
                >
                  {tab.image && (
                    <img src={tab.image.src} alt={tab.image.alt} className="size-full" />
                  )}
                  {tab.video && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="relative flex w-full items-center justify-center">
                          <img
                            src={tab.video.image.src}
                            alt={tab.video.image.alt}
                            className="size-full object-cover"
                          />
                          <span className="absolute inset-0 z-10 bg-black/50" />
                          <FaCirclePlay className="absolute z-20 size-16 text-white" />
                        </button>
                      </DialogTrigger>

                      <DialogContent>
                        <VideoIframe video={tab.video.url} />
                      </DialogContent>
                    </Dialog>
                  )}
                </TabsContent>
              ))}
              <TabsList className="mt-8 flex-col md:mt-0">
                {tabs.map((tab, index) => (
                  <TabsTrigger
                    key={index}
                    value={tab.value}
                    className="flex-col items-start whitespace-normal border-0 border-l-2 border-transparent bg-transparent py-4 pl-6 pr-9 text-left data-[state=active]:border-l-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
                  >
                    <h3 className="mb-2 text-xl font-bold md:text-2xl">{tab.heading}</h3>
                    <p>{tab.description}</p>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="mt-6 flex items-center gap-x-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout490Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  defaultTabValue: "tab-one",
  tabs: [
    {
      value: "tab-one",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      value: "tab-two",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      video: {
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg",
          alt: "Relume placeholder image 2",
        },
        url: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
      },
    },
    {
      value: "tab-three",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 3",
      },
    },
  ],
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
};
