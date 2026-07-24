// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiCheck } from "react-icons/bi";

type PricingPlan = {
  planName: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  pricingPlans: PricingPlan[];
};

export type Pricing18Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Pricing18 = (props: Pricing18Props) => {
  const { tagline, heading, description, pricingPlans } = {
    ...Pricing18Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="flex h-full flex-col justify-between border border-border-primary px-6 py-8 md:p-8"
            >
              <div>
                <div className="rb-6 mb-6 text-center md:mb-8">
                  <h6 className="text-md font-bold md:text-xl">{plan.planName}</h6>
                  <h1 className="my-2 text-6xl font-bold md:text-9xl lg:text-10xl">
                    {plan.monthlyPrice}
                    <span className="text-2xl font-bold md:text-3xl lg:text-4xl">/mo</span>
                  </h1>
                  <p>or {plan.yearlyPrice} yearly</p>
                </div>
                <div className="mb-8 grid grid-cols-1 gap-4 py-2">
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
              <div>
                <Button {...plan.button} className="w-full">
                  {plan.button.title}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Pricing18Defaults: Props = {
  tagline: "Tagline",
  heading: "Pricing plan",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  pricingPlans: [
    {
      planName: "Basic plan",
      monthlyPrice: "$19",
      yearlyPrice: "$199",
      features: ["Feature text goes here", "Feature text goes here", "Feature text goes here"],
      button: { title: "Get started" },
    },
    {
      planName: "Business plan",
      monthlyPrice: "$29",
      yearlyPrice: "$299",
      features: [
        "Feature text goes here",
        "Feature text goes here",
        "Feature text goes here",
        "Feature text goes here",
      ],
      button: { title: "Get started" },
    },
    {
      planName: "Enterprise plan",
      monthlyPrice: "$49",
      yearlyPrice: "$499",
      features: [
        "Feature text goes here",
        "Feature text goes here",
        "Feature text goes here",
        "Feature text goes here",
        "Feature text goes here",
      ],
      button: { title: "Get started" },
    },
  ],
};
