// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  images: ImageProps[];
};

export type Header110Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header110 = (props: Header110Props) => {
  const { heading, description, buttons, images } = {
    ...Header110Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container grid grid-cols-1 gap-12 md:grid-cols-[0.5fr_1fr] md:gap-16">
        <div className="flex h-full flex-col justify-between">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <div className="ml-[7.5%]">
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8 md:flex-wrap">
              {buttons.map((button, index) => (
                <Button key={index} {...button} className="">
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_0.75fr] items-start gap-6 sm:gap-8">
          {images.map((image, index) => (
            <div key={index} className="w-full">
              <img
                src={image.src}
                alt={image.alt}
                className={clsx("size-full object-cover", {
                  "aspect-[2/3]": index === 0,
                  "aspect-square": index !== 0,
                })}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Header110Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  images: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 1",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image 2",
    },
  ],
};
