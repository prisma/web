// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  video: string;
  videoType: string;
};

export type Cta11Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta11 = (props: Cta11Props) => {
  const { heading, description, buttons, video, videoType } = {
    ...Cta11Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="grid w-full grid-cols-1 items-start justify-between gap-6 md:grid-cols-[1fr_max-content] md:gap-x-12 md:gap-y-8 lg:gap-x-20">
          <div className="md:mr-12 lg:mr-0">
            <div className="w-full max-w-lg">
              <h2 className="mb-3 text-4xl font-bold leading-[1.2] text-text-alternative md:mb-4 md:text-5xl lg:text-6xl">
                {heading}
              </h2>
              <p className="text-text-alternative  md:text-md">{description}</p>
            </div>
          </div>
          <div className="flex items-start justify-start gap-4">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
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

export const Cta11Defaults: Props = {
  heading: "Medium length heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary-alt" }],
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
