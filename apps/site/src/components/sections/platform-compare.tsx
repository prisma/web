import { CheckBold, X } from "@/components/icons/forma";
import { Pattern } from "@/components/brand/pattern";
import { StackMap } from "@/components/sections/platform-stack-map";
import { Reveal } from "@/components/motion/reveal";

const WITHOUT = [
  "An ORM, a database, and a host picked separately, then glued together by hand",
  "Preview databases that don't line up with preview deploys",
  "Latency you can't tune away, because the app and the database sit in different clouds",
  "Three dashboards, three bills, three support queues",
];

const WITH = [
  "One ORM, one database, one host, all built against the same schema",
  "Every preview deploy gets its own database, wired automatically",
  "App and Postgres co-located on the same host, single-digit ms queries",
  "One platform, one bill, one place to look when something breaks",
];

// Why the index page exists at all: the three products are worth more together
// than apart. The system diagram makes the claim first — one schema, three
// products, two of them sharing a host — and the two columns below it are the
// evidence: the assembled-by-hand stack against the integrated one.
export function PlatformCompare() {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="mx-auto max-w-[26ch] text-balance text-center text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
            Why the three belong on one platform
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-14 max-w-5xl">
          <StackMap />
        </Reveal>

        <div className="mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-2">
          {/* without — quiet, on the page's own white */}
          <Reveal
            delay={0.05}
            className="flex flex-col rounded-[1.25rem] border border-black/[0.06] p-7 sm:p-9"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Without an integrated stack
            </h3>
            <ul className="mt-8 flex flex-col gap-4">
              {WITHOUT.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground"
                >
                  <X
                    className="mt-1 size-4 shrink-0 text-foreground/35"
                    strokeWidth={3}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* with — lifted on white behind the spectrum border, the brand mark
              standing in for the heading (same idiom as the homepage's After) */}
          <Reveal
            delay={0.15}
            className="spectrum-border spectrum-border-on relative flex flex-col overflow-hidden rounded-[1.25rem] border border-transparent bg-white p-7 sm:p-9"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.04] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
            >
              <Pattern className="h-full w-full" scale={2.5} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/full-color.svg"
              alt="Prisma"
              className="relative h-7 w-auto self-start"
            />
            <ul className="relative mt-8 flex flex-col gap-4">
              {WITH.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-pretty text-[0.9375rem] font-semibold leading-relaxed text-foreground"
                >
                  <CheckBold className="mt-1 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
