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

export type Layout447Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout447 = (props: Layout447Props) => {
  const { tagline, heading, description, buttons, firstImage, secondImage, thirdImage } = {
    ...Layout447Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 gap-x-12 gap-y-12 md:mb-18 md:grid-cols-2 lg:mb-20 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">{heading}</h2>
          </div>
          <div className="ml-[5%] mr-[10%] md:mt-48">
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
        <div className="mb-12 grid grid-cols-[1fr_0.75fr] items-start gap-6 sm:gap-8 md:gap-16 lg:grid-cols-2">
          <img
            src={firstImage.src}
            className="aspect-square w-full object-cover"
            alt={firstImage.alt}
          />
          <div className="grid gap-6 sm:gap-8 md:gap-16">
            <img
              src={secondImage.src}
              className="aspect-square w-full max-w-[10rem] object-cover lg:max-w-[15rem]"
              alt={secondImage.alt}
            />
            <img
              src={thirdImage.src}
              className="aspect-[3/2] w-full object-cover"
              alt={thirdImage.alt}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout447Defaults: Props = {
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
    alt: "Relume placeholder image 1",
  },
  secondImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image 2",
  },
  thirdImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image 3",
  },
};
