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

export type Stats40Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats40 = (props: Stats40Props) => {
  const { heading, stats } = {
    ...Stats40Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl  lg:text-6xl ">{heading}</h3>
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
    <div className="border border-border-primary p-8">
      <h3 className="mb-8 text-md font-bold leading-[1.4] md:mb-10 md:text-xl lg:mb-12">
        {card.heading}
      </h3>
      <p className="text-right text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
        {card.percentage}
      </p>
      <div className="my-4 h-px w-full bg-border-primary" />
      <p className="text-right">{card.description}</p>
    </div>
  );
};

export const Stats40Defaults: Props = {
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
