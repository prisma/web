// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  firstImage: ImageProps;
  secondImage: ImageProps;
};

export type Layout434Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout434 = (props: Layout434Props) => {
  const { tagline, heading, description, buttons, firstImage, secondImage } = {
    ...Layout434Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-x-16 gap-y-6 sm:gap-y-8 md:grid-cols-2">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
              <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">{heading}</h2>
            </div>
            <img
              src={firstImage.src}
              className="mt:mb-18 mt-12 aspect-square w-full object-cover lg:mt-20"
              alt={firstImage.alt}
            />
          </div>
          <div className="flex h-full flex-col justify-between">
            <img
              src={secondImage.src}
              className="mb-6 w-full object-cover md:mb-8"
              alt={secondImage.alt}
            />
            <div className="ml-[5%] mr-[10%]">
              <p className="md:text-md">{description}</p>
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
      </div>
    </section>
  );
};

export const Layout434Defaults: Props = {
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
  firstImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image 2",
  },
  secondImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 1",
  },
};
