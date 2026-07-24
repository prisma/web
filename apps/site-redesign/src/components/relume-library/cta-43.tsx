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

export type Cta43Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta43 = (props: Cta43Props) => {
  const { heading, description, buttons, video, videoType } = {
    ...Cta43Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative">
        <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-lg">
            <h2 className="mb-5 text-5xl font-bold text-text-alternative md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <p className="text-text-alternative md:text-md">{description}</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
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

export const Cta43Defaults: Props = {
  heading: "Medium length heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [
    { title: "Button", variant: "primary" },
    { title: "Button", variant: "secondary-alt" },
  ],
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
