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

export type Header120Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header120 = (props: Header120Props) => {
  const { heading, description, buttons, image } = {
    ...Header120Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 grid grid-cols-1 items-start gap-5 md:mb-18 md:grid-cols-2 md:gap-12 lg:mb-20 lg:gap-20">
          <h1 className="text-6xl font-bold md:text-9xl lg:text-10xl">{heading}</h1>
          <div className="mx-[7.5%] flex flex-col justify-end md:mt-48">
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

        <div className="flex justify-end gap-6 sm:gap-8 md:gap-16">
          <div className="w-full max-w-[35rem] lg:max-w-[60rem]">
            <img className="aspect-[3/2] size-full object-cover" src={image.src} alt={image.alt} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header120Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
};
