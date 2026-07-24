// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  firstImage: ImageProps;
  secondImage: ImageProps;
};

export type Header132Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header132 = (props: Header132Props) => {
  const { heading, description, buttons, firstImage, secondImage } = {
    ...Header132Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 grid grid-cols-1 items-start gap-x-12 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-y-8 lg:mb-20 lg:gap-x-20 lg:gap-y-16">
          <h1 className="text-6xl font-bold md:text-9xl lg:text-10xl">{heading}</h1>
          <div>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex gap-x-4 md:mt-8">
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
              className="aspect-square size-full object-cover"
              src={firstImage.src}
              alt={firstImage.alt}
            />
          </div>
          <div className="ml-[15%] w-full">
            <img
              className="aspect-[3/2] size-full object-cover"
              src={secondImage.src}
              alt={secondImage.alt}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header132Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  firstImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait-dim.png",
    alt: "Relume placeholder image 1",
  },
  secondImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 2",
  },
};
