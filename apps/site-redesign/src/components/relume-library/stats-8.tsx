// @ts-nocheck
type StatsProps = {
  percentage: string;
  heading: string;
};

type Props = {
  heading: string;
  stats: StatsProps[];
};

export type Stats8Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats8 = (props: Stats8Props) => {
  const { heading, stats } = {
    ...Stats8Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container flex flex-col items-start">
        <div className="rb-12 mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
          <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">{heading}</h3>
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

export const Stats8Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  stats: [
    { percentage: "30%", heading: "Short heading goes here" },
    { percentage: "30%", heading: "Short heading goes here" },
    { percentage: "30%", heading: "Short heading goes here" },
  ],
};
