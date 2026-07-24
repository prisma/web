// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type FeaturesProps = {
  icon: ImageProps;
  heading: string;
  description: string;
};

type Props = {
  buttons: ButtonProps[];
  image: ImageProps;
  features: FeaturesProps[];
};

export type Layout220Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout220 = (props: Layout220Props) => {
  const { buttons, image, features } = {
    ...Layout220Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-x-20">
          <div className="order-2 md:order-1">
            <img src={image.src} className="w-full object-cover" alt={image.alt} />
          </div>
          <div className="order-1 md:order-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 py-2 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index}>
                  <div className="mb-3 md:mb-4">
                    <img src={feature.icon.src} className="size-12" alt={feature.icon.alt} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">{feature.heading}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout220Defaults: Props = {
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
  features: [
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 1" },
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 2" },
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 3" },
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 4" },
      heading: "Short heading here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
  ],
};
