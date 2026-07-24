// @ts-nocheck
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
  content: Feature;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  tabs: Tab[];
  defaultValue: string;
};

export type Layout508Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout508 = (props: Layout508Props) => {
  const { tagline, heading, description, tabs, defaultValue } = {
    ...Layout508Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="relative grid auto-cols-fr grid-cols-1 gap-x-12 border border-border-primary lg:gap-x-0">
          <Tabs defaultValue={defaultValue} className="grid">
            <TabsList className="order-2 flex-col md:order-1 md:flex-row">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className="flex w-full items-start justify-start gap-4 whitespace-normal border-0 border-t p-6 text-md font-bold leading-[1.4] duration-0 data-[state=active]:bg-background-primary data-[state=active]:text-text-primary md:items-center md:justify-center md:border-b md:border-r md:border-t-0 md:px-8 md:py-6 md:text-xl md:last-of-type:border-r-0 md:data-[state=active]:[border-bottom:1px_solid_#fff]"
                >
                  {tab.trigger}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="order-1 data-[state=active]:animate-tabs md:order-2"
              >
                <FeatureCard tab={tab} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ tab }: { tab: Tab }) => {
  return (
    <div className="grid grid-cols-1 gap-y-12 p-6 md:grid-cols-2 md:items-center md:gap-x-12 md:p-8 lg:gap-x-20 lg:p-12">
      <div>
        <img
          src={tab.content.image.src}
          className="w-full object-cover"
          alt={tab.content.image.alt}
        />
      </div>
      <div>
        <p className="mb-3 font-semibold md:mb-4">{tab.content.tagline}</p>
        <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
          {tab.content.heading}
        </h2>
        <p>{tab.content.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
          {tab.content.buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Layout508Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  defaultValue: "tab-1",
  tabs: [
    {
      value: "tab-1",
      trigger: "Tab one",
      content: {
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
          alt: "Relume placeholder image",
        },
      },
    },
    {
      value: "tab-2",
      trigger: "Tab two",
      content: {
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
          alt: "Relume placeholder image",
        },
      },
    },
    {
      value: "tab-3",
      trigger: "Tab three",
      content: {
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
          alt: "Relume placeholder image",
        },
      },
    },
    {
      value: "tab-4",
      trigger: "Tab four",
      content: {
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
          alt: "Relume placeholder image",
        },
      },
    },
    {
      value: "tab-5",
      trigger: "Tab five",
      content: {
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
          alt: "Relume placeholder image",
        },
      },
    },
    {
      value: "tab-6",
      trigger: "Tab six",
      content: {
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
          alt: "Relume placeholder image",
        },
      },
    },
  ],
};
