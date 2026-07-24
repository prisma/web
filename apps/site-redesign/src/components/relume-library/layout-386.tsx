// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type FeatureSection = {
  icon: ImageProps;
  heading: string;
  description: string;
  button: ButtonProps;
};

type Card = {
  tagline: string;
  image: ImageProps;
  heading: string;
  description: string;
  button: ButtonProps[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  featureSections: FeatureSection[];
  card: Card;
};

export type Layout386Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout386 = (props: Layout386Props) => {
  const { tagline, heading, description, featureSections, card } = {
    ...Layout386Defaults,
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
        <div className="grid auto-cols-fr grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          {featureSections.map((feature, index) => (
            <FeatureSection key={index} {...feature} />
          ))}
          <Card {...card} />
        </div>
      </div>
    </section>
  );
};

const Card = (card: Card) => (
  <div className="flex flex-col border border-border-primary sm:col-span-2 sm:row-span-2 lg:col-start-2 lg:row-start-1">
    <div className="block flex-1 p-6 sm:flex sm:flex-col sm:justify-center md:p-8 lg:p-12">
      <div>
        <p className="mb-2 font-semibold">{card.tagline}</p>
        <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
          {card.heading}
        </h2>
        <p>{card.description}</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
        {card.button.map((button, index) => (
          <Button key={index} {...button}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
    <div className="flex w-full flex-col items-center justify-center self-start">
      <img src={card.image.src} alt={card.image.alt} />
    </div>
  </div>
);

const FeatureSection = (featureSection: FeatureSection) => (
  <div className="flex flex-col justify-center border border-border-primary p-6 md:p-8">
    <div>
      <div className="rb-5 mb-5 md:mb-6">
        <img src={featureSection.icon.src} className="size-12" alt={featureSection.icon.alt} />
      </div>
      <h2 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
        {featureSection.heading}
      </h2>
      <p>{featureSection.description}</p>
    </div>
    <div className="mt-5 md:mt-6">
      <Button {...featureSection.button}>{featureSection.button.title}</Button>
    </div>
  </div>
);

export const Layout386Defaults: Props = {
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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    button: [
      { title: "Button", variant: "secondary" },
      {
        title: "Button",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    ],
  },
  featureSections: [
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 1",
      },
      heading: "Medium length section heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      button: {
        title: "Button",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 2",
      },
      heading: "Medium length section heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      button: {
        title: "Button",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
  ],
};
