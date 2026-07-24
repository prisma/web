// @ts-nocheck
import { Button, ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type SectionProps = {
  heading: string;
  description: string;
  button: ButtonProps;
};

type Props = {
  sections: SectionProps[];
  video: string;
  videoType: string;
};

export type Layout262Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout262 = (props: Layout262Props) => {
  const { sections, video, videoType } = {
    ...Layout262Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="mb-3 text-xl font-bold text-text-alternative md:mb-4 md:text-2xl">
                {section.heading}
              </h3>
              <p className="text-text-alternative">{section.description}</p>
              <div className="mt-6 md:mt-8">
                <Button {...section.button}>{section.button.title}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <video className="absolute inset-0 aspect-video size-full object-cover" autoPlay loop muted>
          <source src={video} type={videoType} />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Layout262Defaults: Props = {
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
    },
  ],
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
