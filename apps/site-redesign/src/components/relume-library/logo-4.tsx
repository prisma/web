// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  logos: ImageProps[];
};

export type Logo4Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Logo4 = (props: Logo4Props) => {
  const { heading, description, buttons, logos } = {
    ...Logo4Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex w-full items-start justify-center justify-self-center bg-neutral-lightest px-4 pb-4 pt-[0.875rem] md:p-[0.875rem]"
              >
                <img src={logo.src} className="max-h-12 md:max-h-14" alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Logo4Defaults: Props = {
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
  logos: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
      alt: "Relume placeholder image",
    },
  ],
};
