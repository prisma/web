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
  thirdImage: ImageProps;
};

export type Layout432Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout432 = (props: Layout432Props) => {
  const { tagline, heading, description, buttons, firstImage, secondImage, thirdImage } = {
    ...Layout432Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-x-16 gap-y-12 md:grid-cols-2">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="rb-5 mb-12 text-5xl font-bold md:mb-18 md:text-7xl lg:mb-20 lg:text-8xl">
              {heading}
            </h2>
            <img
              src={firstImage.src}
              className="aspect-square w-full object-cover"
              alt={firstImage.alt}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-12 grid grid-cols-2 gap-6 sm:gap-8 md:mb-18 lg:mb-20">
              <img
                src={secondImage.src}
                className="mt-[50%] w-full object-cover"
                alt={secondImage.alt}
              />
              <img
                src={thirdImage.src}
                className="mt-[25%] w-full object-cover"
                alt={thirdImage.alt}
              />
            </div>
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

export const Layout432Defaults: Props = {
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
    alt: "Relume placeholder image 3",
  },
  secondImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 2",
  },
  thirdImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 1",
  },
};
