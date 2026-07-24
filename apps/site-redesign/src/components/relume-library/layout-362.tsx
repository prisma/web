// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type SectionProps = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  sections: SectionProps[];
};

export type Layout362Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout362 = (props: Layout362Props) => {
  const { tagline, heading, description, sections } = {
    ...Layout362Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2">
          {sections.map((section, index) => (
            <div
              key={index}
              className="grid grid-cols-1 items-start border border-border-primary sm:grid-cols-2"
            >
              <div className="flex h-full flex-col justify-center p-6">
                <p className="mb-2 text-sm font-semibold">{section.tagline}</p>
                <h3 className="mb-2 text-xl font-bold md:text-2xl">{section.heading}</h3>
                <p>{section.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4 md:mt-6">
                  {section.buttons.map((button, index) => (
                    <Button key={index} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex size-full items-center justify-center">
                <img
                  src={section.image.src}
                  className="size-full object-cover"
                  alt={section.image.alt}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Layout362Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  sections: [
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      buttons: [
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      buttons: [
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 2",
      },
    },
  ],
};
