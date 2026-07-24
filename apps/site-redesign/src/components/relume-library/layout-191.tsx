// @ts-nocheck
import { ButtonProps, Button } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type Props = {
  tagline: string;
  description: string;
  buttons: ButtonProps[];
  video: string;
  videoType: string;
};

export type Layout191Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout191 = (props: Layout191Props) => {
  const { tagline, description, buttons, video, videoType } = {
    ...props,
    ...Layout191Defaults,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10 max-w-lg text-center">
        <p className="mb-3 font-semibold text-text-alternative md:mb-4">{tagline}</p>
        <p className="text-lg font-bold leading-[1.4] text-text-alternative md:text-2xl">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
          {buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
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

export const Layout191Defaults: Props = {
  tagline: "Tagline",
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
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
