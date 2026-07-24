// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Card = {
  tagline: string;
  image: ImageProps;
  heading: string;
  description: string;
};

type BigCard = Card & {
  buttons: ButtonProps[];
};

type SmallCard = Card & {
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  bigCard: BigCard;
  smallCard: SmallCard;
};

export type Layout382Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout382 = (props: Layout382Props) => {
  const { tagline, heading, description, bigCard, smallCard } = {
    ...Layout382Defaults,
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
          <BigCard {...bigCard} />
          <SmallCard {...smallCard} />
        </div>
      </div>
    </section>
  );
};

const BigCard = (bigCard: BigCard) => {
  return (
    <div className="flex flex-col border border-border-primary lg:col-span-2">
      <div className="block p-6 sm:flex sm:flex-col sm:justify-start md:p-8 lg:p-12">
        <div>
          <p className="mb-2 font-semibold">{bigCard.tagline}</p>
          <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
            {bigCard.heading}
          </h2>
          <p>{bigCard.description}</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
          {bigCard.buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center self-start">
        <img src={bigCard.image.src} alt={bigCard.image.alt} />
      </div>
    </div>
  );
};

const SmallCard = (smallCard: SmallCard) => {
  return (
    <div className="flex flex-col border border-border-primary">
      <div className="block flex-1 p-6 sm:flex sm:flex-col sm:justify-start md:p-8">
        <div>
          <p className="mb-2 font-semibold">{smallCard.tagline}</p>
          <h2 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            {smallCard.heading}
          </h2>
          <p>{smallCard.description}</p>
        </div>
        <div className="mt-5 md:mt-6">
          <Button {...smallCard.button}>{smallCard.button.title}</Button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center self-start">
        <img src={smallCard.image.src} alt={smallCard.image.alt} />
      </div>
    </div>
  );
};

export const Layout382Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  bigCard: {
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
  smallCard: {
    tagline: "Tagline",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-bento-portrait.svg",
      alt: "Relume placeholder image 2",
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
};
