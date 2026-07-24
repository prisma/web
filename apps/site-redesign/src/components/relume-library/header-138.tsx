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

export type Header138Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header138 = (props: Header138Props) => {
  const { heading, description, buttons, firstImage, secondImage } = {
    ...Header138Defaults,
    ...props,
  };
  return (
    <section id="relume" className="flex min-h-svh flex-col md:h-svh">
      <div className="relative flex flex-1 flex-col">
        <div className="relative flex-1">
          <img
            className="absolute inset-0 aspect-[3/2] size-full object-cover"
            src={firstImage.src}
            alt={firstImage.alt}
          />
        </div>
        <div className="absolute bottom-[-15%] right-[5%] w-[30%] md:w-1/5">
          <img
            className="aspect-square size-full object-cover"
            src={secondImage.src}
            alt={secondImage.alt}
          />
        </div>
      </div>
      <div className="px-[5%]">
        <div className="container">
          <div className="py-12 md:py-18 lg:py-20">
            <div className="auto-cols-1fr mt-[5%] grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:gap-x-20 lg:gap-y-16">
              <h1 className="text-6xl font-bold text-text-primary md:text-9xl lg:text-10xl">
                {heading}
              </h1>
              <div>
                <p className="text-base text-text-primary md:text-md">{description}</p>
                <div className="mt-6 flex gap-x-4 md:mt-8">
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
      </div>
    </section>
  );
};

export const Header138Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  firstImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 1",
  },
  secondImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait-dim.png",
    alt: "Relume placeholder image 2",
  },
};
