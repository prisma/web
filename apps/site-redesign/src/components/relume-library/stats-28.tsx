// @ts-nocheck
type StatsProps = {
  percentage: string;
  heading: string;
  description: string;
};

type Props = {
  heading: string;
  stats: StatsProps[];
};

export type Stats28Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats28 = (props: Stats28Props) => {
  const { heading, stats } = {
    ...Stats28Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl  lg:text-6xl ">{heading}</h3>
        </div>

        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
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
    <div className="border border-border-primary p-8">
      <p className="mb-8 text-10xl font-bold leading-[1.3] md:mb-10 md:text-[4rem] lg:mb-12 lg:text-[5rem]">
        {card.percentage}
      </p>
      <h3 className="text-md font-bold leading-[1.4]  md:text-xl">{card.heading}</h3>
      <p className="mt-2">{card.description}</p>
    </div>
  );
};

export const Stats28Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  stats: [
    {
      percentage: "30%",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      percentage: "30%",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      percentage: "30%",
      heading: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ],
};
