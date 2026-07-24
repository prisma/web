// @ts-nocheck
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VideoIframe,
} from "@relume_io/relume-ui";
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
  tabs: TabProps[];
  defaultTabValue: string;
};

export type Layout28Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout28 = (props: Layout28Props) => {
  const { tabs, defaultTabValue } = {
    ...Layout28Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <Tabs
          defaultValue={defaultTabValue}
          className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20"
        >
          <TabsList className="col-start-1 col-end-2 row-start-1 row-end-2 grid grid-cols-1 items-center gap-x-4 gap-y-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-col items-start justify-start whitespace-normal border-0 border-l-2 border-transparent py-0 pl-8 pr-0 text-left data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
              >
                <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  {tab.heading}
                </h3>
                <p>{tab.description}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="max-size-full flex items-center justify-center overflow-hidden">
            {tabs.map((tab) => {
              return (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:animate-tabs"
                >
                  {tab.image && (
                    <img
                      src={tab.image.src}
                      alt={tab.image.alt}
                      className="size-full object-cover"
                    />
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
                          <FaCirclePlay className="absolute z-20 size-16 text-white" />
                          <span className="absolute inset-0 z-10 bg-black/50" />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <VideoIframe video={tab.video.url} />
                      </DialogContent>
                    </Dialog>
                  )}
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export const Layout28Defaults: Props = {
  defaultTabValue: "tab-1",
  tabs: [
    {
      value: "tab-1",
      heading: "Short heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      value: "tab-2",
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
      value: "tab-3",
      heading: "Short heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 3",
      },
    },
  ],
};
