// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type CardProps = {
  image: ImageProps;
  logo: ImageProps;
  heading: string;
  description: string;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  cards: CardProps[];
};

export type Layout520Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout520 = (props: Layout520Props) => {
  const { tagline, heading, description, cards } = {
    ...Layout520Defaults,
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
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Card: React.FC<CardProps> = ({ image, logo, heading, description, button }) => (
  <div className="relative p-6 md:p-8">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/50" />
      <img src={image.src} className="size-full object-cover" alt={image.alt} />
    </div>
    <div className="relative z-10">
      <div className="mb-5 md:mb-6">
        <img src={logo.src} className="size-12" alt={logo.alt} />
      </div>
      <h3 className="mb-3 text-2xl font-bold text-text-alternative md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
        {heading}
      </h3>
      <p className="text-text-alternative">{description}</p>
      <div className="mt-5 flex items-center md:mt-6">
        <Button {...button}>{button.title}</Button>
      </div>
    </div>
  </div>
);

const card = {
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

export const Layout520Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  cards: [card, card, card],
};
