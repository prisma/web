// @ts-nocheck
type StatsProps = {
  percentage: string;
  heading: string;
};

type Props = {
  heading: string;
  stats: StatsProps[];
};

export type Stats52Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats52 = (props: Stats52Props) => {
  const { heading, stats } = {
    ...Stats52Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl  lg:text-6xl">{heading}</h3>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Card = (card: StatsProps) => {
  return (
    <div className="border border-border-primary p-8 text-center">
      <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
        {card.percentage}
      </p>
      <h3 className="text-md font-bold leading-[1.4] md:text-xl">{card.heading}</h3>
    </div>
  );
};

export const Stats52Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  stats: [
    {
      percentage: "30%",
      heading: "Short heading goes here",
    },
    {
      percentage: "30%",
      heading: "Short heading goes here",
    },
    {
      percentage: "30%",
      heading: "Short heading goes here",
    },
  ],
};
