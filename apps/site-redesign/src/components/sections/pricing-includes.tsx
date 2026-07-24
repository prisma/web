import { IconTile } from "@/components/brand/icon-tile"
import { Console, Database, Shield, Swap, Table } from "@/components/icons/forma"
import { Reveal } from "@/components/motion/reveal"

// The five items from the copy doc, icon mapping mirroring its Notion glyphs
// (database / swap / shield / table / command-line).
const INCLUDES = [
  { icon: Database, label: "Prisma ORM (always free)" },
  { icon: Swap, label: "Unlimited Prisma Postgres data transfer" },
  { icon: Shield, label: "Spend limits" },
  { icon: Table, label: "Prisma Studio" },
  { icon: Console, label: "CLI + Management API" },
]

// "Every plan includes" — a slim strip between the pricing explainer and the
// plan cards: five icon tiles, nothing louder (design notes: less information
// upfront, detail lives below the decision).
export function PricingIncludes() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl border-y border-black/[0.06] px-4 py-12 sm:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Every plan includes
          </p>
        </Reveal>
        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:max-w-none lg:grid-cols-5">
          {INCLUDES.map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <li className="flex flex-col items-center gap-3 text-center">
                <IconTile>
                  <Icon className="size-6 text-foreground" aria-hidden />
                </IconTile>
                <span className="max-w-[16ch] text-balance text-sm font-semibold leading-snug text-foreground">
                  {label}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
