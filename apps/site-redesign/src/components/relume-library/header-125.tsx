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
  thirdImage: ImageProps;
};

export type Header125Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header125 = (props: Header125Props) => {
  const { heading, description, buttons, firstImage, secondImage, thirdImage } = {
    ...Header125Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
            <div className="w-full max-w-lg">
              <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                {heading}
              </h1>
              <p className="md:text-md">{description}</p>
              <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
                {buttons.map((button, index) => (
                  <Button key={index} {...button}>
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid auto-cols-fr grid-cols-1 items-end sm:grid-cols-[0.4fr_1fr_0.4fr] sm:gap-8">
            <div className="w-full self-start">
              <img
                className="aspect-[3/4] size-full object-cover"
                src={firstImage.src}
                alt={firstImage.alt}
              />
            </div>
            <div className="my-[15%] w-full">
              <img
                className="my-[10%] aspect-[3/2] size-full object-cover sm:my-0"
                src={secondImage.src}
                alt={secondImage.alt}
              />
            </div>
            <div className="w-full">
              <img
                className="aspect-square size-full object-cover"
                src={thirdImage.src}
                alt={thirdImage.alt}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header125Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  firstImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 1",
  },
  secondImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 2",
  },
  thirdImage: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image 3",
  },
};
