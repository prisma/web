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
  image: ImageProps;
};

export type Header124Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header124 = (props: Header124Props) => {
  const { heading, description, buttons, image } = {
    ...Header124Defaults,
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
        <div className="flex justify-end gap-6 sm:gap-8 md:gap-16">
          <div className="w-full max-w-[35rem] lg:max-w-[60rem]">
            <img className="aspect-[3/2] size-full object-cover" src={image.src} alt={image.alt} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header124Defaults: Props = {
  heading: "Long heading is what you see here in this header section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
};
