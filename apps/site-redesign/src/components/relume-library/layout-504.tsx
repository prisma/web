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
  content: Feature[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  tabs: Tab[];
  defaultTabValue: string;
};

export type Layout504Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout504 = (props: Layout504Props) => {
  const { tagline, heading, description, buttons, tabs, defaultTabValue } = {
    ...Layout504Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
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
        </div>
        <Tabs defaultValue={defaultTabValue} className="flex flex-col items-center">
          <TabsList className="no-scrollbar relative mb-12 flex w-screen flex-nowrap items-center gap-x-6 overflow-auto px-[5vw] md:mb-16 md:w-auto md:max-w-full md:px-0">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className="border-0 border-b-[1.5px] border-transparent px-0 py-2 duration-0 data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
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
    <div className="grid grid-cols-1 border border-border-primary md:grid-cols-2 md:items-center">
      <div className="aspect-square">
        <img src={feature.image.src} className="w-full object-cover" alt={feature.image.alt} />
      </div>
      <div className="p-6 md:p-8 lg:p-12">
        <p className="mb-3 font-semibold md:mb-4">{feature.tagline}</p>
        <h2 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
          {feature.heading}
        </h2>
        <p>{feature.description}</p>
        <div className="mt-6 flex items-center gap-x-4 md:mt-8">
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

export const Layout504Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
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
