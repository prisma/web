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

export type Cta49Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta49 = (props: Cta49Props) => {
  const { heading, description, buttons, video, videoType } = {
    ...Cta49Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative">
        <div className="relative z-10 grid grid-cols-1 items-start justify-start gap-6 p-8 md:grid-cols-[1fr_max-content] md:items-center md:justify-between md:gap-x-12 md:gap-y-8 lg:gap-x-20 lg:p-12">
          <div className="md:mr-12 lg:mr-0">
            <div className="w-full max-w-lg">
              <h3 className="mb-3 text-4xl font-bold leading-[1.2] text-text-alternative md:mb-4 md:text-5xl lg:text-6xl">
                {heading}
              </h3>
              <p className="text-text-alternative md:text-md">{description}</p>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-start gap-4 md:w-auto md:justify-end">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <video
            className="absolute inset-0 aspect-video size-full object-cover"
            autoPlay
            loop
            muted
          >
            <source src={video} type={videoType} />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>
    </section>
  );
};

export const Cta49Defaults: Props = {
  heading: "Medium length heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary-alt" }],
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
