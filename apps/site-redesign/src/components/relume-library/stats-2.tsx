// @ts-nocheck
type StatsProps = {
  percentage: string;
  heading: string;
};

type Props = {
  heading: string;
  description: string;
  stats: StatsProps[];
};

export type Stats2Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats2 = (props: Stats2Props) => {
  const { heading, description, stats } = {
    ...Stats2Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container flex flex-col items-start">
        <div className="rb-12 mb-12 grid grid-cols-1 items-start justify-between gap-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">{heading}</h3>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid w-full grid-cols-1 items-start justify-start gap-y-8 md:grid-cols-3 md:gap-x-8 lg:gap-x-12 lg:gap-y-16">
          {stats.map((stat, index) => (
            <div key={index} className="w-full border-l-2 border-border-primary pl-8">
              <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
                {stat.percentage}
              </p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">{stat.heading}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Stats2Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
  stats: [
    { percentage: "30%", heading: "Short heading goes here" },
    { percentage: "30%", heading: "Short heading goes here" },
    { percentage: "30%", heading: "Short heading goes here" },
  ],
};
