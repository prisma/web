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
};

export type Pricing21Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Pricing21 = (props: Pricing21Props) => {
  const { tagline, heading, description, pricingPlans, featureCategories } = {
    ...Pricing21Defaults,
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
          <div className="sticky top-0 grid grid-cols-3 border-b border-border-primary bg-white md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="hidden md:block" />
            {pricingPlans.map((plan, index) => (
              <PricingPlan key={index} {...plan} index={index} />
            ))}
          </div>
          <FeaturesSection featureCategories={featureCategories} />
        </div>
      </div>
    </section>
  );
};

const PricingPlan = ({
  planName,
  monthlyPrice,
  description,
  button,
  index,
}: PricingPlan & { index: number }) => {
  return (
    <div
      className={clsx(
        "flex h-full flex-col justify-between border-border-primary px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8",
        {
          "border-0 md:border-l": index === 0,
          "border-l": index > 0,
        },
      )}
    >
      <div>
        <h2 className="text-md font-bold leading-[1.4] md:text-xl">{planName}</h2>
        <div className="my-3 md:my-4">
          <p className="text-2xl font-bold leading-[1.2] sm:text-6xl md:text-9xl lg:text-10xl">
            {monthlyPrice}
          </p>
          <p className="font-bold">Per month</p>
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
            <div className="border-b border-border-primary py-5">
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                {featureCategory.title}
              </h3>
            </div>
          )}
          {featureCategory.features.map((feature, index) => (
            <div
              key={index}
              className="grid grid-cols-3 border-b border-border-primary md:grid-cols-[1.5fr_1fr_1fr_1fr]"
            >
              <p className="col-span-3 row-span-1 border-b border-border-primary py-4 pr-4 md:col-span-1 md:border-0 md:pr-6">
                {feature.text}
              </p>
              {feature.items.map((item, index) => (
                <div
                  key={index}
                  className={clsx(
                    "flex items-center justify-center border-border-primary px-4 py-4 text-center font-semibold md:px-6",
                    {
                      "border-0 md:border-l": index === 0,
                      "border-l": index > 0,
                    },
                  )}
                >
                  <p>{item}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Pricing21Defaults: Props = {
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
};
