// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiCheck } from "react-icons/bi";

type PricingPlan = {
  planName: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  pricingPlan: PricingPlan;
};

export type Pricing3Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Pricing3 = (props: Pricing3Props) => {
  const { tagline, heading, description, pricingPlan } = {
    ...Pricing3Defaults,
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
        <div className="mx-auto w-full max-w-md">
          <PricingPlan plan={pricingPlan} />
        </div>
      </div>
    </section>
  );
};

const PricingPlan = ({ plan }: { plan: PricingPlan }) => (
  <div className="h-full border border-border-primary px-6 py-8 md:p-8">
    <h2 className="mb-1 text-md font-bold leading-[1.4] md:text-xl">{plan.planName}</h2>
    <p>{plan.description}</p>
    <div className="my-8 h-px w-full bg-border-primary" />
    <h3 className="my-2 text-6xl font-bold md:text-9xl lg:text-10xl">
      {plan.monthlyPrice}
      <span className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">/mo</span>
    </h3>
    <p>or {plan.yearlyPrice} yearly</p>
    <div className="mt-6 md:mt-8">
      <Button {...plan.button} className="w-full">
        {plan.button.title}
      </Button>
    </div>
    <div className="my-8 h-px w-full bg-border-primary" />
    <div className="grid grid-cols-1 gap-y-4 py-2">
      {plan.features.map((feature, index) => (
        <div key={index} className="flex self-start">
          <div className="mr-4 flex-none self-start">
            <BiCheck className="size-6" />
          </div>
          <p>{feature}</p>
        </div>
      ))}
    </div>
  </div>
);

export const Pricing3Defaults: Props = {
  tagline: "Tagline",
  heading: "Pricing plan",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  pricingPlan: {
    planName: "Basic plan",
    description: "Lorem ipsum dolor sit amet",
    monthlyPrice: "$19",
    yearlyPrice: "$199",
    features: [
      "Feature text goes here",
      "Feature text goes here",
      "Feature text goes here",
      "Feature text goes here",
      "Feature text goes here",
    ],
    button: { title: "Get started" },
  },
};
