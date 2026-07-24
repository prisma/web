// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type BaseCardProps = {
  image: ImageProps;
  heading: string;
  description: string;
};

type CardBigProps = BaseCardProps & {
  tagline: string;
  buttons: ButtonProps[];
};

type CardMediumProps = BaseCardProps & {
  logo: ImageProps;
  buttons: ButtonProps[];
};

type CardSmallProps = BaseCardProps & {
  logo: ImageProps;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  cardBig1: CardBigProps;
  cardBig2: CardBigProps;
  cardMedium: CardMediumProps;
  cardsSmall: CardSmallProps[];
};

export type Layout527Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout527 = (props: Layout527Props) => {
  const { tagline, heading, description, cardBig1, cardBig2, cardMedium, cardsSmall } = {
    ...Layout527Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-8">
            <CardBig {...cardBig1} />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {cardsSmall.map((card, index) => (
                <CardSmall key={index} {...card} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <CardMedium {...cardMedium} />
            <CardBig {...cardBig2} />
          </div>
        </div>
      </div>
    </section>
  );
};

const CardBig: React.FC<CardBigProps> = ({ image, tagline, heading, description, buttons }) => (
  <div className="relative flex flex-col justify-center p-6 sm:min-h-[32rem] md:p-8 lg:p-12">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/50" />
      <img src={image.src} className="size-full object-cover" alt={image.alt} />
    </div>
    <div className="relative z-10">
      <p className="mb-2 inline-block text-sm font-semibold text-text-alternative">{tagline}</p>
      <h2 className="mb-5 text-4xl font-bold leading-[1.2] text-text-alternative md:mb-6 md:text-5xl lg:text-6xl">
        {heading}
      </h2>
      <p className="text-text-alternative">{description}</p>
      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4 md:mt-8">
        {buttons.map((button, index) => (
          <Button key={index} {...button}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

const CardMedium: React.FC<CardMediumProps> = ({ image, logo, heading, description, buttons }) => (
  <div className="relative flex flex-col p-6 md:p-8 lg:p-12">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/50" />
      <img src={image.src} className="size-full object-cover" alt={image.alt} />
    </div>
    <div className="relative z-10 flex flex-1 flex-col justify-between">
      <div>
        <div className="mb-3 md:mb-4">
          <img src={logo.src} className="size-12" alt={logo.alt} />
        </div>
        <h3 className="mb-5 text-4xl font-bold leading-[1.2] text-text-alternative md:mb-6 md:text-5xl lg:text-6xl">
          {heading}
        </h3>
        <p className="text-text-alternative">{description}</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
        {buttons.map((button, index) => (
          <Button key={index} {...button}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

const CardSmall: React.FC<CardSmallProps> = ({ image, logo, heading, description, button }) => (
  <div className="relative flex flex-col p-6 md:p-8 lg:p-6">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/50" />
      <img src={image.src} className="size-full object-cover" alt={image.alt} />
    </div>
    <div className="relative z-10 flex flex-1 flex-col justify-between">
      <div>
        <div className="mb-3 md:mb-4">
          <img src={logo.src} className="size-12" alt={logo.alt} />
        </div>
        <h3 className="mb-2 text-xl font-bold text-text-alternative md:text-2xl">{heading}</h3>
        <p className="text-text-alternative">{description}</p>
      </div>
      <div className="mt-5 flex items-center md:mt-6">
        <Button {...button}>{button.title}</Button>
      </div>
    </div>
  </div>
);

const cardBig: CardBigProps = {
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    { title: "Button", variant: "secondary-alt" },
    { title: "Button", variant: "link-alt", size: "link", iconRight: <RxChevronRight /> },
  ],
};

const cardMedium: CardMediumProps = {
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
    alt: "Relume logo",
  },
  heading: "Short heading here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [
    { title: "Button", variant: "secondary-alt" },
    { title: "Button", variant: "link-alt", size: "link", iconRight: <RxChevronRight /> },
  ],
};

const cardSmall: CardSmallProps = {
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
    alt: "Relume logo",
  },
  heading: "Medium length section heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "Button", variant: "link-alt", size: "link", iconRight: <RxChevronRight /> },
};

export const Layout527Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  cardBig1: cardBig,
  cardBig2: cardBig,
  cardMedium: cardMedium,
  cardsSmall: [cardSmall, cardSmall],
};
