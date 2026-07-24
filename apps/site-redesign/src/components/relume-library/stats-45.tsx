// @ts-nocheck
type ImageProps = {
  src: string;
  alt?: string;
};

type StatsProps = {
  percentage: string;
  title: string;
  description: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  image: ImageProps;
  stats: StatsProps[];
};

export type Stats45Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats45 = (props: Stats45Props) => {
  const { tagline, heading, description, stats, image } = {
    ...Stats45Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:gap-x-6 sm:gap-y-6 lg:grid-cols-[1fr_0.5fr] lg:gap-x-8 lg:gap-y-8">
          <div className="flex w-full flex-col items-center justify-center">
            <img src={image.src} alt={image.alt} className="aspect-[3/2] size-full object-cover" />
          </div>

          <div className="flex flex-col justify-center gap-x-6 gap-y-6 md:flex-row md:gap-y-8 lg:flex-col lg:gap-x-8">
            {stats.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Card = (card: StatsProps) => {
  return (
    <div className="flex w-full flex-col border border-border-primary p-8">
      <h3 className="mb-5 text-md font-bold leading-[1.4] md:mb-6 md:text-xl">{card.title}</h3>
      <p className="text-right text-6xl font-bold md:text-9xl lg:text-10xl">{card.percentage}</p>
      <div className="my-4 h-px w-full bg-border-primary" />
      <p className="text-right">{card.description}</p>
    </div>
  );
};

export const Stats45Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  image: {
    src: "https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
  stats: [
    {
      percentage: "30%",
      title: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      percentage: "30%",
      title: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      percentage: "30%",
      title: "Short heading goes here",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ],
};
