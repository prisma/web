// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type SectionProps = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

type Props = {
  sections: SectionProps[];
  video: string;
  videoType: string;
};

export type Layout256Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout256 = (props: Layout256Props) => {
  const { sections, video, videoType } = { ...props, ...Layout256Defaults };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <p className="mb-3 font-semibold text-text-alternative md:mb-4">{section.tagline}</p>
              <h3 className="mb-5 text-2xl font-bold text-text-alternative md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                {section.heading}
              </h3>
              <p className="text-text-alternative">{section.description}</p>
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
      <div className="absolute inset-0 z-0">
        <video className="aspect-video size-full object-cover" autoPlay loop muted>
          <source src={video} type={videoType} />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Layout256Defaults: Props = {
  sections: [
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
      buttons: [
        { title: "Button", variant: "secondary-alt" },
        {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
      buttons: [
        { title: "Button", variant: "secondary-alt" },
        {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
      buttons: [
        { title: "Button", variant: "secondary-alt" },
        {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
  ],
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
