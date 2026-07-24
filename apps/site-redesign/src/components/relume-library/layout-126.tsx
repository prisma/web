// @ts-nocheck
import React from "react";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type SectionProps = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  sections: SectionProps[];
  image: ImageProps;
};

export type Layout126Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout126: React.FC<Layout126Props> = (props: Layout126Props) => {
  const { sections, image } = { ...Layout126Defaults, ...props };

  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-8 lg:gap-16">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="rb-5 mb-5 text-2xl font-bold leading-[1.4] text-text-alternative md:mb-6 md:text-3xl md:leading-[1.2] lg:text-4xl">
                {section.heading}
              </h2>
              <p className="mb-6 text-base text-text-alternative md:mb-8">{section.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-text-alternative md:mt-8">
                {section.buttons.map((button, index) => (
                  <Button key={index} {...button}>
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img src={image.src} className="size-full object-cover" alt={image.alt} />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Layout126Defaults: Required<Props> = {
  sections: [
    {
      heading: "Long heading is what you see here in this feature section",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      heading: "Long heading is what you see here in this feature section",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
  ],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume Placeholder image",
  },
};
