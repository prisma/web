// @ts-nocheck
import { Button, ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type SectionProps = {
  heading: string;
  description: string;
  button: ButtonProps;
  icon: ImageProps;
};

type Props = {
  sections: SectionProps[];
  heading: string;
  image: ImageProps;
};

export type Layout269Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout269 = (props: Layout269Props) => {
  const { sections, image, heading } = {
    ...Layout269Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-4xl font-bold leading-[1.2] text-text-alternative md:mb-6 md:text-5xl lg:text-6xl">
            {heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          {sections.map((section, index) => (
            <div key={index} className="w-full text-center">
              <div className="mb-5 h-12 md:mb-6">
                <div className="inline-block">
                  <img src={section.icon.src} className="size-12" alt={section.icon.alt} />
                </div>
              </div>
              <div>
                <h3 className="mb-5 text-xl font-bold text-text-alternative md:mb-6 md:text-2xl md:leading-[1.4] lg:text-2xl">
                  {section.heading}
                </h3>
                <p className="text-text-alternative">{section.description}</p>
                <div className="mt-6 md:mt-8">
                  <Button {...section.button}>{section.button.title}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img src={image.src} className="absolute inset-0 size-full object-cover" alt={image.alt} />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Layout269Defaults: Props = {
  sections: [
    {
      heading: "Long heading is what you see here in this feature section",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
      button: {
        title: "Button",
        variant: "link-alt",
        size: "link",
        iconRight: <RxChevronRight />,
      },
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 1",
      },
    },
    {
      heading: "Long heading is what you see here in this feature section",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
      button: {
        title: "Button",
        variant: "link-alt",
        size: "link",
        iconRight: <RxChevronRight />,
      },
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 2",
      },
    },
    {
      heading: "Long heading is what you see here in this feature section",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
      button: {
        title: "Button",
        variant: "link-alt",
        size: "link",
        iconRight: <RxChevronRight />,
      },
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 3",
      },
    },
  ],
  heading: "Long heading is what you see here in this feature section",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
};
