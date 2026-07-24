// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type SectionProps = {
  icon: ImageProps;
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
};

export type Layout128Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout128 = (props: Layout128Props) => {
  const { sections } = { ...Layout128Defaults, ...props };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className=" grid grid-cols-1 items-start gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:gap-16">
          {sections.map((section, index) => (
            <div key={index}>
              <div className="mb-5 md:mb-6">
                <img src={section.icon.src} className="size-12" alt={section.icon.alt} />
              </div>
              <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                {section.heading}
              </h3>
              <p className="mt-5 md:mt-6">{section.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
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
    </section>
  );
};

export const Layout128Defaults: Props = {
  sections: [
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 1" },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 2" },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
  ],
};
