// @ts-nocheck
type Props = {
  heading: string;
  description: string;
  video: string;
  videoType: string;
};

export type Header70Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header70 = (props: Header70Props) => {
  const { heading, description, video, videoType } = {
    ...Header70Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10 max-w-lg text-center">
        <h1 className="mb-5 text-6xl font-bold text-text-alternative md:mb-6 md:text-9xl lg:text-10xl">
          {heading}
        </h1>
        <p className="text-text-alternative md:text-md">{description}</p>
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

export const Header70Defaults: Props = {
  heading: "Short heading here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
