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
  image1: ImageProps;
  image2: ImageProps;
};

export type Layout480Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout480 = (props: Layout480Props) => {
  const { tagline, heading, description, buttons, image1, image2 } = {
    ...Layout480Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start justify-between gap-x-12 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">{heading}</h2>
          </div>
          <div>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex items-center gap-x-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="relative flex">
          <div className="absolute left-0 top-[10%] w-[30%]">
            <img
              src={image1.src}
              className="aspect-square size-full object-cover"
              alt={image1.alt}
            />
          </div>
          <div className="ml-[15%]">
            <img
              src={image2.src}
              className="aspect-[3/2] size-full object-cover"
              alt={image2.alt}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout480Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  buttons: [
    { title: "Button", variant: "secondary" },
    { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
  ],
  image1: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-dim.png",
    alt: "Relume placeholder image 1",
  },
  image2: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 2",
  },
};
