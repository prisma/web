// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type FeatureSection = {
  icon: ImageProps;
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

type Props = {
  featureSections: FeatureSection[];
};

export type Cta36Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta36 = (props: Cta36Props) => {
  const { featureSections } = {
    ...Cta36Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid auto-cols-fr grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-16">
          {featureSections.map((feature, index) => (
            <FeatureSection key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureSection = (featureSection: FeatureSection) => (
  <div className="flex flex-col items-center justify-center text-center">
    <img
      src={featureSection.icon.src}
      className="mb-5 size-12 md:mb-6"
      alt={featureSection.icon.alt}
    />
    <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
      {featureSection.heading}
    </h2>
    <p>{featureSection.description}</p>
    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
      {featureSection.buttons.map((button, index) => (
        <Button key={index} {...button}>
          {button.title}
        </Button>
      ))}
    </div>
  </div>
);

export const Cta36Defaults: Props = {
  featureSections: [
    {
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 1",
      },
    },
    {
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 1",
      },
    },
  ],
};
