// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  icon: ImageProps;
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

export type Layout184Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout184 = (props: Layout184Props) => {
  const { tagline, heading, description, buttons, image, icon } = {
    ...props,
    ...Layout184Defaults,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10 max-w-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rb-5 mb-5 flex md:mb-6">
            <img src={icon.src} className="size-20" alt={icon.alt} />
          </div>
          <p className="mb-3 font-semibold text-text-alternative md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold text-text-alternative md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="text-text-alternative md:text-md">{description}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img src={image.src} className="h-full w-full object-cover" alt={image.alt} />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Layout184Defaults: Props = {
  icon: {
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
    alt: "Relume logo 1",
  },
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    {
      title: "Button",
      variant: "secondary-alt",
    },
    {
      title: "Button",
      variant: "link-alt",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume Placeholder image",
  },
};
