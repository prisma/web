// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type SectionProps = {
  icon: ImageProps;
  heading: string;
  description: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  sections: SectionProps[];
  buttons: ButtonProps[];
  video: string;
  videoType: string;
};

export type Layout341Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout341 = (props: Layout341Props) => {
  const { tagline, heading, description, sections, buttons, video, videoType } = {
    ...props,
    ...Layout341Defaults,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="rb-12 mb-12 grid grid-cols-1 items-start justify-between gap-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold text-text-alternative md:mb-4">{tagline}</p>
            <h2 className="text-5xl font-bold text-text-alternative md:text-7xl lg:text-8xl">
              {heading}
            </h2>
          </div>
          <p className="text-text-alternative md:text-md">{description}</p>
        </div>
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
          {sections.map((section, index) => (
            <div key={index}>
              <div className="rb-5 mb-5 md:mb-6">
                <img src={section.icon.src} className="size-12" alt={section.icon.alt} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-alternative md:mb-4 md:text-2xl">
                {section.heading}
              </h3>
              <p className="text-text-alternative">{section.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center gap-4 md:mt-18 lg:mt-20">
          {buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <video className="size-full object-cover" autoPlay loop muted>
          <source src={video} type={videoType} />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Layout341Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  sections: [
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 1",
      },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 2",
      },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 3",
      },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg",
        alt: "Relume logo 4",
      },
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
  ],
  buttons: [
    { title: "Button", variant: "secondary-alt" },
    {
      title: "Button",
      variant: "link-alt",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
