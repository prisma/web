"use client";

import Image from "next/image";
import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@prisma/eclipse";
import {
  type Symbol,
  type PlanPoint,
  planActions,
  planOrder,
  plans,
  renderPlanPoint,
  symbols,
} from "./pricing-data";

export function PricingHeroPlans({
  currency,
  onCurrencyChange,
}: {
  currency: Symbol;
  onCurrencyChange: (currency: Symbol) => void;
}) {
  const getPlanPointKey = (planKey: string, item: PlanPoint, index: number) => {
    if (typeof item === "string") {
      return `${planKey}-${item}`;
    }

    return `${planKey}-${item.text}-${index}`;
  };

  return (
    <>
      <section className="relative pt-28 pb-8 md:pt-28 md:pb-16 px-4 ">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(20,184,166,0.22),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto flex flex-col items-center gap-3 md:gap-6">
          <Badge
            color="ppg"
            size="lg"
            className="rounded-md gap-2"
            label={
              <>
                <i className="fa-regular fa-message-code text-xs" />
                Prisma ORM will always be free
              </>
            }
          />
          <h1 className="stretch-display m-0 text-center text-foreground-neutral text-3xl md:text-7xl leading-tight font-sans-display [font-variation-settings:'wght'_900]">
            Scale as You Grow <br /> with Prisma Postgres
          </h1>
          <p className="m-0 text-center text-base md:text-xl text-foreground-neutral-weak">
            Operation-based pricing. We only charge for what you use.
          </p>
        </div>
      </section>

      <section className="px-4 py-6 md:py-12">
        <div className="max-w-[1288px] mx-auto">
          <div className="mb-6 flex justify-end">
            <Select value={currency} onValueChange={(value) => onCurrencyChange(value as Symbol)}>
              <SelectTrigger className="h-10 min-w-[90px] border-stroke-neutral bg-background-default text-sm text-foreground-neutral-weak">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {Object.entries(symbols).map(([code, symbol]) => (
                  <SelectItem key={code} value={code}>
                    {code} {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {planOrder.map((planKey) => {
              const plan = plans[planKey];
              const highlighted = planKey === "pro";

              return (
                <article
                  key={planKey}
                  className={`relative rounded-2xl border ${
                    highlighted
                      ? "border-stroke-ppg mt-4 md:mt-0"
                      : "border-stroke-neutral-weak"
                  } bg-background-default p-5 text-foreground-neutral shadow-[0px_18px_42px_0px_rgba(23,43,77,0.08)]`}
                >
                  {highlighted && (
                    <Badge
                      color="ppg"
                      className="absolute -top-8 left-0 rounded-md"
                      label="POPULAR"
                    />
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <p className="m-0 text-base stretch-display uppercase tracking-[1.6px] font-sans-display [font-variation-settings:'wght'_800]">
                      {plan.title}
                    </p>
                    {(planKey === "pro" || planKey === "business") && (
                      <Button
                        type="button"
                        variant="default"
                        size="lg"
                        href="https://pris.ly/pay-via-aws"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2 px-2"
                      >
                        <span>Pay via</span>
                        <Image
                          src="/icons/companies/aws.svg"
                          alt="AWS"
                          width={36}
                          height={14}
                          className="w-auto h-auto"
                        />
                      </Button>
                    )}
                  </div>
                  <p className="m-0 mt-1 text-sm text-foreground-neutral-weak">{plan.subtitle}</p>
                  <p className="m-0 mt-3 text-4xl leading-tight font-sans-display slashed-zero tabular-nums [font-variation-settings:'wght'_800] text-foreground-neutral">
                    {plan.price[currency]}
                    <span className="text-2xl text-foreground-neutral-weak"> / month</span>
                  </p>
                  <Button
                    href="https://console.prisma.io/login?utm_source=website&utm_medium=pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant={highlighted ? "ppg" : "default-stronger"}
                    size="xl"
                    className="mt-4 w-full"
                  >
                    {planActions[planKey]}
                  </Button>
                  <ul className="list-none p-0 m-0 mt-5 space-y-2">
                    {plan.points.map((item, index) => (
                      <li
                        key={getPlanPointKey(planKey, item, index)}
                        className="flex items-start gap-2 text-base"
                      >
                        <span className="text-foreground-ppg mt-1">
                          <i className="fa-solid fa-circle-check text-xs" />
                        </span>
                        <span
                          className="[&_b]:font-semibold [&_span]:text-foreground-neutral-weak"
                          dangerouslySetInnerHTML={{
                            __html: renderPlanPoint(item, currency),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <div className="mt-8 text-center text-xs text-foreground-ppg-weak">
            *An operation is each time you interact with your database, no matter the compute time.
            <br />
            We count the Prisma ORM queries you make, not the SQL statements you run.{" "}
            <a
              href="https://www.prisma.io/blog/operations-based-billing"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Read more
            </a>{" "}
            about our pricing model.
          </div>
          <p className="mt-2 mb-0 text-center text-xs text-foreground-neutral-weak">
            All quotas and limits are shared across all databases in your account.
          </p>
        </div>
      </section>
    </>
  );
}
