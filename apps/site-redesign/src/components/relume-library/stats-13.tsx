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

export type Stats13Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Stats13 = (props: Stats13Props) => {
  const { tagline, heading, description, buttons, stats } = {
    ...Stats13Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid w-full grid-cols-1 items-start justify-start gap-y-8 py-2 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:gap-x-8 lg:gap-y-12">
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
      </div>
    </section>
  );
};

export const Stats13Defaults: Props = {
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
    { percentage: "50%", heading: "Short heading goes here" },
    { percentage: "50%", heading: "Short heading goes here" },
    { percentage: "50%", heading: "Short heading goes here" },
    { percentage: "50%", heading: "Short heading goes here" },
  ],
};
