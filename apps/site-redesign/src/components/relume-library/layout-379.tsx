// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type CardBaseProps = {
  heading: string;
  description: string;
};

type CardsSmallProps = CardBaseProps & {
  button: ButtonProps;
  icon: ImageProps;
};

type CardProps = CardBaseProps & {
  buttons: ButtonProps[];
  image: ImageProps;
  tagline: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  cardsSmall: CardsSmallProps[];
  cardMedium: CardProps;
  cardBig: CardProps;
};

export type Layout379Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout379 = (props: Layout379Props) => {
  const { tagline, heading, description, cardsSmall, cardBig, cardMedium } = {
    ...Layout379Defaults,
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <div className="flex flex-col border border-border-primary sm:col-span-2 sm:row-span-2">
              <div className="flex items-center justify-center">
                <img
                  src={cardBig.image.src}
                  alt={cardBig.image.alt}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-12">
                <div>
                  <p className="mb-2 text-sm font-semibold">{cardBig.tagline}</p>
                  <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                    {cardBig.heading}
                  </h3>
                  <p>{cardBig.description}</p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                  {cardBig.buttons.map((button, index) => (
                    <Button key={index} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {cardsSmall.map((card, index) => (
              <div key={index} className="flex flex-col border border-border-primary">
                <div className="flex h-full flex-col justify-between p-6 md:p-8 lg:p-6">
                  <div>
                    <div className="mb-3 md:mb-4">
                      <img src={card.icon.src} className="size-12" alt={card.icon.alt} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold md:text-2xl">{card.heading}</h3>
                    <p>{card.description}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-4 md:mt-6">
                    <Button {...card.button}>{card.button.title}</Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-1 border border-border-primary sm:col-span-2 sm:row-span-1 sm:grid-cols-2">
              <div className="flex items-center justify-center">
                <img
                  src={cardMedium.image.src}
                  alt={cardMedium.image.alt}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-6">
                <div>
                  <p className="mb-2 text-sm font-semibold">{cardMedium.tagline}</p>
                  <h3 className="mb-2 text-xl font-bold md:text-2xl">{cardMedium.heading}</h3>
                  <p>{cardMedium.description}</p>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-4 md:mt-6">
                  {cardMedium.buttons.map((button, index) => (
                    <Button key={index} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout379Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  cardsSmall: [
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
  cardMedium: {
    tagline: "Tagline",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait.svg",
      alt: "Relume placeholder image 3",
    },
    heading: "Medium length section heading goes here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    buttons: [
      {
        title: "Button",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    ],
  },
  cardBig: {
    tagline: "Tagline",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image 1",
    },
    heading: "Medium length section heading goes here",
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
};
