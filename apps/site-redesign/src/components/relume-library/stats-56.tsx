// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type StatsProps = {
  percentage: string;
  heading: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  stats: StatsProps[];
};

export type Stats56Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats56 = (props: Stats56Props) => {
  const { tagline, heading, description, stats, buttons } = {
    ...Stats56Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:items-center lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-8 py-2">
            {stats.map((stat, index) => (
              <Card key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Card = (card: StatsProps) => {
  return (
    <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
      <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
        {card.percentage}
      </p>
      <h3 className="text-md font-bold leading-[1.4] md:text-xl">{card.heading}</h3>
    </div>
  );
};

export const Stats56Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
  stats: [
    {
      percentage: "50%",
      heading: "Short heading goes here",
    },
    {
      percentage: "50%",
      heading: "Short heading goes here",
    },
  ],
};
