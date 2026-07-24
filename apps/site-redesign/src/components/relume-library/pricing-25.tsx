// @ts-nocheck
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiCheck } from "react-icons/bi";

type Billing = "monthly" | "yearly";

type Feature = {
  icon: React.ReactNode;
  text: string;
};

type PricingPlan = {
  planName: string;
  description: string;
  price: string;
  discount?: string;
  features: Feature[];
  button: ButtonProps;
};

type Tab = {
  value: Billing;
  tabName: string;
  plans: PricingPlan[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  defaultTabValue: Billing;
  tabs: Tab[];
};

export type Pricing25Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Pricing25 = (props: Pricing25Props) => {
  const { tagline, heading, description, defaultTabValue, tabs } = {
    ...Pricing25Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-8 max-w-lg text-center md:mb-10 lg:mb-12">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
        <Tabs defaultValue={defaultTabValue}>
          <TabsList className="mx-auto mb-12 w-fit">
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab.value}>
                {tab.tabName}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab, index) => (
            <TabsContent
              key={index}
              value={tab.value}
              className="grid grid-cols-1 gap-8 data-[state=active]:animate-tabs lg:grid-cols-3"
            >
              {tab.plans.map((plan, index) => (
                <PricingPlan key={index} plan={plan} billing={tab.value} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

const PricingPlan = ({ plan, billing }: { plan: PricingPlan; billing: Billing }) => (
  <div className="flex h-full flex-col justify-start border border-border-primary px-6 py-8 md:p-8">
    <h2 className="mb-1 text-md font-bold leading-[1.4] md:text-xl">{plan.planName}</h2>
    <p>{plan.description}</p>
    <div className="my-8 h-px w-full shrink-0 bg-border" />
    <h3 className="my-2 text-6xl font-bold md:text-9xl lg:text-10xl">
      {plan.price}
      <span className="text-2xl font-bold md:text-3xl lg:text-4xl">
        {billing === "monthly" ? "/mo" : "/yr"}
      </span>
    </h3>
    {billing === "yearly" && "discount" in plan && <p className="font-medium">{plan.discount}</p>}
    <div className="mt-6 md:mt-8">
      <Button {...plan.button} className="w-full">
        {plan.button.title}
      </Button>
    </div>
    <div className="my-8 h-px w-full shrink-0 bg-border" />
    <div className="grid grid-cols-1 gap-y-4 py-2">
      {plan.features.map((feature, index) => (
        <div key={index} className="flex self-start">
          <div className="mr-4 flex-none self-start">{feature.icon}</div>
          <p>{feature.text}</p>
        </div>
      ))}
    </div>
  </div>
);

export const Pricing25Defaults: Props = {
  tagline: "Tagline",
  heading: "Pricing plan",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  defaultTabValue: "monthly",
  tabs: [
    {
      value: "monthly",
      tabName: "Monthly",
      plans: [
        {
          planName: "Basic plan",
          description: "Lorem ipsum dolor sit amet",
          price: "$19",
          features: [
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
          ],
          button: { title: "Get started" },
        },
        {
          planName: "Business plan",
          description: "Lorem ipsum dolor sit amet",
          price: "$29",
          features: [
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
          ],
          button: { title: "Get started" },
        },
        {
          planName: "Enterprise plan",
          description: "Lorem ipsum dolor sit amet",
          price: "$49",
          features: [
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
          ],
          button: { title: "Get started" },
        },
      ],
    },

    {
      value: "yearly",
      tabName: "Yearly",
      plans: [
        {
          planName: "Basic plan",
          description: "Lorem ipsum dolor sit amet",
          price: "$180",
          discount: "Save 20%",
          features: [
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
          ],
          button: { title: "Get started" },
        },
        {
          planName: "Business plan",
          description: "Lorem ipsum dolor sit amet",
          price: "$280",
          discount: "Save 20%",
          features: [
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
          ],
          button: { title: "Get started" },
        },
        {
          planName: "Enterprise plan",
          description: "Lorem ipsum dolor sit amet",
          price: "$480",
          discount: "Save 20%",
          features: [
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
            { icon: <BiCheck className="size-6" />, text: "Feature text goes here" },
          ],
          button: { title: "Get started" },
        },
      ],
    },
  ],
};
