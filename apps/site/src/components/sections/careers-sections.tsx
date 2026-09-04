import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton } from "@/components/brand/prism-button";
import { CAREERS_BENEFITS, CAREERS_STATS, CAREERS_WHY, COMPANY_VALUES } from "@/lib/company";

// Careers page sections, ported from the old site's /careers page.

export function CareersHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[14rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(46% 60% at 32% 100%, color-mix(in srgb, var(--color-prism-red-400) 16%, transparent), transparent 70%)",
                "radial-gradient(40% 52% at 58% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 15%, transparent), transparent 68%)",
                "radial-gradient(38% 46% at 80% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 16%, transparent), transparent 70%)",
              ].join(","),
            }}
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-t from-transparent to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
            <RoleKicker color="bg-prism-red-400" className="justify-center">
              Careers
            </RoleKicker>
            <h1 className="isolate mt-4 max-w-[18ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
              Join Prisma
            </h1>
            <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              Help us empower developers to build data-driven applications.
            </p>
            <div className="mt-8">
              <PrismButton href="#open-positions">View open positions</PrismButton>
            </div>

            <dl className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-4 border-t border-black/[0.07] pt-10">
              {CAREERS_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <dd className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                    {stat.value}
                  </dd>
                  <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CareersCulture() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          Why Prisma?
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {CAREERS_WHY.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-7"
            >
              <h3 className="text-lg leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-card-wash px-6 py-10 sm:px-10">
          <p className="text-center text-sm font-semibold text-foreground/70">Our values</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            {COMPANY_VALUES.map((value, i) => (
              <li key={value} className="flex items-center gap-4">
                <span className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  {value}
                </span>
                {i < COMPANY_VALUES.length - 1 && (
                  <span
                    aria-hidden
                    className={
                      "size-2 rounded-full " +
                      ["bg-prism-cyan-400", "bg-prism-yellow-300", "bg-prism-red-400"][i % 3]
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function CareersBenefits() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-8 sm:pb-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          Benefits
        </h2>
        <ul className="mt-12 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {CAREERS_BENEFITS.map((benefit, i) => (
            <li key={benefit.strong} className="flex items-start gap-3">
              <span
                aria-hidden
                className={
                  "mt-2 size-2 shrink-0 rounded-full " +
                  ["bg-prism-cyan-400", "bg-prism-yellow-300", "bg-prism-red-400"][i % 3]
                }
              />
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                <strong className="font-semibold text-foreground">{benefit.strong}</strong>{" "}
                {benefit.rest}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
