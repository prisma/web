import { IconTile } from "@/components/brand/icon-tile";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Code, Console, Swap, Table, XCircle } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";

// The five items from the copy doc. The icons mostly mirror its Notion glyphs
// (swap / shield / table / command-line), but the ORM now uses Code rather
// than Database — the ORM is a typed client library, not the database.
const INCLUDES = [
  { icon: Code, label: "Prisma ORM (always free)" },
  { icon: Swap, label: "Unlimited Prisma Postgres data transfer" },
  { icon: XCircle, label: "Spend limits" },
  { icon: Table, label: "Prisma Studio" },
  { icon: Console, label: "CLI + Management API" },
];

// "Every plan includes" — a stacked column rather than a full-width strip, so
// it can sit beside the pricing explainer. Not a <section>: the parent owns
// the section wrapper and the grid.
export function PricingIncludes() {
  return (
    <div>
      <Reveal>
        <RoleKicker color="bg-prism-cyan-400">Every plan includes</RoleKicker>
      </Reveal>
      <ul className="mt-6 flex flex-col gap-4">
        {INCLUDES.map(({ icon: Icon, label }, i) => (
          <Reveal key={label} delay={i * 0.06}>
            <li className="flex items-center gap-4">
              <IconTile>
                <Icon className="size-6 text-foreground" aria-hidden />
              </IconTile>
              <span className="text-base font-semibold leading-snug text-foreground">{label}</span>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
