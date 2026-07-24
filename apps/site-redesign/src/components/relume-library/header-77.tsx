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
  images: ImageProps[];
};

export type Header77Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header77 = (props: Header77Props) => {
  const { heading, description, buttons, images } = {
    ...Header77Defaults,
    ...props,
  };
  return (
    <section
      id="relume"
      className="grid grid-cols-1 items-center gap-y-16 pt-16 md:pt-24 lg:grid-cols-2 lg:pt-0"
    >
      <div className="mx-[5%] sm:max-w-md md:justify-self-start lg:ml-[5vw] lg:mr-20 lg:justify-self-end">
        <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
        <p className="md:text-md">{description}</p>
        <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
          {buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 overflow-hidden bg-background-secondary py-8 md:py-16 lg:h-screen">
        <div className="grid shrink-0 grid-cols-1 gap-y-4">
          <div className="ml-[-8.5%] grid w-full animate-marquee-horizontally auto-cols-fr grid-cols-2 gap-4 self-center">
            {[...new Array(2)].map((e, index) => (
              <div key={index} className="grid w-full grid-flow-col gap-4">
                {images.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className="relative w-[60vw] pt-[75%] sm:w-[18rem] md:w-[26rem]"
                  >
                    <img
                      className="absolute inset-0 size-full object-cover"
                      src={image.src}
                      alt={image.alt}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="grid w-full animate-marquee-horizontally grid-cols-2 gap-4 self-center">
            {[...new Array(2)].map((e, index) => (
              <div key={index} className="grid w-full grid-flow-col gap-4">
                {images.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className="relative w-[60vw] pt-[75%] sm:w-[18rem] md:w-[26rem]"
                  >
                    <img
                      className="absolute inset-0 size-full object-cover"
                      src={image.src}
                      alt={image.alt}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header77Defaults: Props = {
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
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 2",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 3",
    },
  ],
};
