// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type BaseProps = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

type CardBaseProps = BaseProps & {
  tagline: string;
  image: ImageProps;
};

type SectionProps = BaseProps & {
  icon: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  card: CardBaseProps;
  sections: SectionProps[];
};

export type Layout367Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout367 = (props: Layout367Props) => {
  const { tagline, heading, description, card, sections } = {
    ...Layout367Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {sections.map((section, index) => (
              <div key={index} className="flex flex-col border border-border-primary">
                <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
                  <div>
                    <div className="mb-5 md:mb-6">
                      <img src={section.icon.src} className="size-12" alt={section.icon.alt} />
                    </div>
                    <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                      {section.heading}
                    </h3>
                    <p>{section.description}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                    {section.buttons.map((button, index) => (
                      <Button key={index} {...button}>
                        {button.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col border border-border-primary md:col-span-2 md:row-span-2 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3">
              <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-12">
                <div>
                  <p className="mb-2 text-sm font-semibold">{card.tagline}</p>
                  <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                    {card.heading}
                  </h3>
                  <p>{card.description}</p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                  {card.buttons.map((button, index) => (
                    <Button key={index} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <img src={card.image.src} alt={card.image.alt} className="w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout367Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  card: {
    tagline: "Tagline",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image",
    },
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
  },
  sections: [
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 1",
      },
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 2",
      },
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
  ],
};
