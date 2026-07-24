// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
import { BiCheck } from "react-icons/bi";

type Feature = {
  text: string;
  items: React.ReactNode[];
};

type FeatureCategory = {
  title?: string;
  features: Feature[];
};

type PricingPlan = {
  planName: string;
  monthlyPrice: string;
  description: string;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  pricingPlans: PricingPlan[];
  featureCategories: FeatureCategory[];
  buttons: ButtonProps[];
};

export type Pricing22Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Pricing22 = (props: Pricing22Props) => {
  const { tagline, heading, description, pricingPlans, featureCategories, buttons } = {
    ...Pricing22Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-3 gap-x-4 bg-white md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-x-8">
            <div className="hidden md:block" />
            {pricingPlans.map((plan, index) => (
              <PricingPlan key={index} {...plan} />
            ))}
          </div>
          <FeaturesSection featureCategories={featureCategories} />
          <div className="rt-8 mt-8 grid grid-cols-3 gap-x-4 bg-white md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-x-8">
            <div className="hidden md:block" />
            {buttons.map((button, index) => (
              <Button
                key={index}
                {...button}
                className="w-full whitespace-normal px-3 py-1 sm:px-4 sm:py-3"
              >
                {button.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PricingPlan = ({ planName, monthlyPrice, description, button }: PricingPlan) => {
  return (
    <div className="flex h-full flex-col justify-between text-center">
      <div>
        <h2 className="text-md font-bold leading-[1.4] md:text-xl">{planName}</h2>
        <div className="my-3 md:my-4">
          <p className="text-2xl font-bold leading-[1.2] sm:text-6xl md:text-9xl lg:text-10xl">
            {monthlyPrice}
            <span className="text-sm leading-[1.4] sm:text-xl md:text-2xl">/mo</span>
          </p>
        </div>
        <p>{description}</p>
      </div>
      <div className="mt-6 md:mt-8">
        <Button {...button} className="w-full whitespace-normal px-3 py-1 sm:px-4 sm:py-3">
          {button.title}
        </Button>
      </div>
    </div>
  );
};

const FeaturesSection = ({ featureCategories }: { featureCategories: FeatureCategory[] }) => {
  return (
    <div>
      {featureCategories.map((featureCategory, index) => (
        <div key={index}>
          {featureCategory.title && (
            <h3 className="mt-8 py-5 text-md font-bold leading-[1.4] md:text-xl">
              {featureCategory.title}
            </h3>
          )}
          {featureCategory.features.map((feature, index) => (
            <div
              key={index}
              className={clsx("grid grid-cols-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]", {
                "bg-background-secondary": index % 2 === 0,
              })}
            >
              <p className="col-span-3 row-span-1 p-4 md:col-span-1 md:px-6 md:py-4">
                {feature.text}
              </p>
              {feature.items.map((item, index) => (
                <p
                  key={index}
                  className="flex items-center justify-center px-4 py-4 text-center font-semibold md:px-6"
                >
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Pricing22Defaults: Props = {
  tagline: "Tagline",
  heading: "Pricing plan",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  pricingPlans: [
    {
      planName: "Basic",
      monthlyPrice: "$19",
      description: "Lorem ipsum dolor sit amet",
      button: {
        title: "Get started",
      },
    },
    {
      planName: "Business",
      monthlyPrice: "$29",
      description: "Lorem ipsum dolor sit amet",
      button: {
        title: "Get started",
      },
    },
    {
      planName: "Enterprise",
      monthlyPrice: "$49",
      description: "Lorem ipsum dolor sit amet",
      button: {
        title: "Get started",
      },
    },
  ],
  featureCategories: [
    {
      title: "Feature Category",
      features: [
        {
          text: "Feature text goes here",
          items: ["10", "25", "Unlimited"],
        },
        {
          text: "Feature text goes here",
          items: [
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
          ],
        },
        {
          text: "Feature text goes here",
          items: [
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
          ],
        },
        {
          text: "Feature text goes here",
          items: ["", <BiCheck className="size-6" />, <BiCheck className="size-6" />],
        },
        {
          text: "Feature text goes here",
          items: ["", "", <BiCheck className="size-6" />],
        },
      ],
    },

    {
      title: "Feature Category",
      features: [
        {
          text: "Feature text goes here",
          items: ["10", "25", "Unlimited"],
        },
        {
          text: "Feature text goes here",
          items: [
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
          ],
        },
        {
          text: "Feature text goes here",
          items: [
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
          ],
        },
        {
          text: "Feature text goes here",
          items: ["", <BiCheck className="size-6" />, <BiCheck className="size-6" />],
        },
        {
          text: "Feature text goes here",
          items: ["", "", <BiCheck className="size-6" />],
        },
      ],
    },

    {
      title: "Feature Category",
      features: [
        {
          text: "Feature text goes here",
          items: ["10", "25", "Unlimited"],
        },
        {
          text: "Feature text goes here",
          items: [
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
          ],
        },
        {
          text: "Feature text goes here",
          items: [
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
            <BiCheck className="size-6" />,
          ],
        },
        {
          text: "Feature text goes here",
          items: ["", <BiCheck className="size-6" />, <BiCheck className="size-6" />],
        },
        {
          text: "Feature text goes here",
          items: ["", "", <BiCheck className="size-6" />],
        },
      ],
    },
  ],
  buttons: [
    {
      title: "Get started",
    },
    {
      title: "Get started",
    },
    {
      title: "Get started",
    },
  ],
};
