// @ts-nocheck
type ImageProps = {
  src: string;
  alt?: string;
};

type StatsProps = {
  percentage: string;
  heading: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  stats: StatsProps[];
  image: ImageProps;
};

export type Stats19Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats19 = (props: Stats19Props) => {
  const { tagline, heading, description, stats, image } = {
    ...Stats19Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 md:gap-y-0 lg:grid-cols-[1fr_0.5fr]">
          <div>
            <img className="aspect-[3/2] size-full object-cover" src={image.src} alt={image.alt} />
          </div>

          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12 md:p-8 lg:grid-cols-1 lg:gap-x-0 lg:p-12">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="mb-2 text-6xl font-bold leading-[1.2] md:text-9xl lg:text-10xl">
                  {stat.percentage}
                </p>
                <h3 className="text-md font-bold leading-[1.4] md:text-xl">{stat.heading}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Stats19Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
};
