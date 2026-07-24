// @ts-nocheck
type StatsProps = {
  title: string;
  description: string;
};

type Props = {
  heading: string;
  description: string;
  stats: StatsProps[];
  video: string;
  videoType: string;
};

export type Layout88Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout88 = (props: Layout88Props) => {
  const { heading, description, stats, video, videoType } = {
    ...Layout88Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          <h3 className="text-4xl font-bold leading-[1.2] text-text-alternative md:text-5xl lg:text-6xl">
            {heading}
          </h3>
          <div>
            <p className="mb-6 text-text-alternative md:mb-8 md:text-md">{description}</p>
            <div className="grid grid-cols-1 gap-6 py-2 sm:grid-cols-2">
              {stats.map((stat, index) => (
                <div key={index}>
                  <h3 className="mb-2 text-5xl font-bold text-text-alternative md:text-7xl lg:text-8xl">
                    {stat.title}
                  </h3>
                  <p className="text-text-alternative">{stat.description}</p>
                </div>
              ))}
            </div>
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

export const Layout88Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  stats: [
    {
      title: "50%",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "50%",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ],
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
