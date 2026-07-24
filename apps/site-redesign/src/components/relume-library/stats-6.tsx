// @ts-nocheck
type StatsProps = {
  percentage: string;
  heading: string;
};

type Props = {
  heading: string;
  description: string;
  stats: StatsProps[];
  video: string;
  videoType: string;
};

export type Stats6Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats6 = (props: Stats6Props) => {
  const { heading, description, stats, video, videoType } = {
    ...Stats6Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="mb-12 grid grid-cols-1 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 lg:mb-20 lg:gap-x-20">
          <div>
            <h3 className="text-4xl font-bold leading-[1.2] text-text-alternative md:text-5xl lg:text-6xl">
              {heading}
            </h3>
          </div>
          <div>
            <p className="text-text-alternative md:text-md">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-8 lg:gap-x-12 lg:gap-y-16">
          {stats.map((stat, index) => (
            <div key={index} className="border-l-2 border-border-alternative pl-8">
              <p className="mb-2 text-10xl font-bold leading-[1.3] text-text-alternative md:text-[4rem] lg:text-[5rem]">
                {stat.percentage}
              </p>
              <h3 className="text-md font-bold leading-[1.4] text-text-alternative md:text-xl">
                {stat.heading}
              </h3>
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

export const Stats6Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  stats: [
    { percentage: "30%", heading: "Short heading goes here" },
    { percentage: "30%", heading: "Short heading goes here" },
    { percentage: "30%", heading: "Short heading goes here" },
  ],
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
