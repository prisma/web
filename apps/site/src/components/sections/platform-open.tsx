import { Database, Layers, Swap } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";

const POINTS = [
  { icon: Database, label: "Prisma Postgres is standard Postgres" },
  { icon: Swap, label: "Prisma ORM works with other databases" },
  { icon: Layers, label: "Each product can be adopted on its own" },
];

// The escape hatch, stated plainly: integrated is the default, not a lock-in.
// Quiet and unwrapped — the claim carries it, so the section stays a two-column
// text block rather than another set of cards.
export function PlatformOpen() {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <h2 className="max-w-[20ch] text-balance text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
              Integrated by default, open by design
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              Prisma gives you a stack that works together out of the box, with room to use the
              tools you already trust.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16} className="flex flex-col justify-center">
          <ul className="flex flex-col">
            {POINTS.map(({ icon: Icon, label }, i) => (
              <li
                key={label}
                className={`flex items-center gap-4 py-5 ${i > 0 ? "border-t border-black/[0.06]" : ""}`}
              >
                <Icon className="size-5 shrink-0 text-foreground/45" aria-hidden />
                <span className="text-pretty font-semibold text-foreground">{label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[44ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            Start with the piece you need today, then add more when it makes sense.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
