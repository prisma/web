// @ts-nocheck
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

export type Layout499Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout499 = (props: Layout499Props) => {
  const { tagline, heading, description, tabs, buttons, defaultTabValue } = {
    ...Layout499Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 md:w-auto lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
          <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
        <Tabs
          defaultValue={defaultTabValue}
          className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20"
        >
          <TabsList className="col-start-1 col-end-2 row-start-1 row-end-2 grid grid-cols-1 items-center gap-x-4">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className="flex-col items-start whitespace-normal border-0 border-l-2 border-transparent bg-transparent py-4 pl-6 pr-0 text-left data-[state=active]:border-l-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary md:pl-8"
              >
                <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  {tab.heading}
                </h3>
                <p>{tab.description}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab, index) => (
            <TabsContent key={index} value={tab.value} className="data-[state=active]:animate-tabs">
              {tab.image && <img src={tab.image.src} alt={tab.image.alt} className="size-full" />}
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
        </Tabs>
      </div>
    </section>
  );
};

export const Layout499Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  defaultTabValue: "tab-one",
  tabs: [
    {
      value: "tab-one",
      heading: "Short heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      value: "tab-two",
      heading: "Short heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
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
