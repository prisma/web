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

export type Header122Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header122 = (props: Header122Props) => {
  const { heading, description, buttons, firstImage, secondImage, thirdImage } = {
    ...Header122Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="ml-[5%]">
          <div className="mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
            <h2 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex gap-x-4 md:mt-8">
              {buttons.map((button: ButtonProps, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 items-end gap-6 sm:grid-cols-[1fr_0.4fr_0.4fr] sm:gap-8">
          <div className="my-[15%] w-full">
            <img
              className="aspect-[3/2] size-full object-cover"
              src={firstImage.src}
              alt={firstImage.alt}
            />
          </div>
          <div className="w-full">
            <img
              className="aspect-square size-full object-cover"
              src={secondImage.src}
              alt={secondImage.alt}
            />
          </div>
          <div className="w-full self-start">
            <img
              className="aspect-[3/4] size-full object-cover"
              src={thirdImage.src}
              alt={thirdImage.alt}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header122Defaults: Props = {
  heading: "Long heading is what you see here in this header section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
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
