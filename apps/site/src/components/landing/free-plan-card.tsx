import { CheckBold, Code, Database, Server } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// The Free plan, as the hero visual of /lp/free: what you get, per product,
// in the product's own hue, with the three things a visitor from a "free
// tier" ad wants to know (price, card, time limit) as the card's footer.
// Figures are the Free column of prisma.io/pricing.
const GROUPS = [
  {
    product: "Prisma Postgres",
    Icon: Database,
    tone: {
      text: "text-prism-yellow-800",
      bg: "bg-prism-yellow-50",
      border: "border-prism-yellow-200",
      dot: "bg-prism-yellow-400",
    },
    lines: ["200k operations a month", "1.01 GB storage", "50 databases"],
  },
  {
    product: "Prisma Compute",
    Icon: Server,
    tone: {
      text: "text-prism-red-800",
      bg: "bg-prism-red-50",
      border: "border-prism-red-200",
      dot: "bg-prism-red-500",
    },
    lines: [
      "1M requests a month",
      "360 GB-hours memory, 4 active vCPU-hours",
      "10 GB bandwidth, scale to zero",
    ],
  },
  {
    product: "Prisma ORM 8",
    Icon: Code,
    tone: {
      text: "text-prism-cyan-800",
      bg: "bg-prism-cyan-50",
      border: "border-prism-cyan-200",
      dot: "bg-prism-cyan-400",
    },
    lines: ["Free and open source, on every plan"],
  },
] as const;

export function FreePlanCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]">
      <div className="flex items-end justify-between gap-4 border-b border-border/70 bg-muted/40 px-5 py-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-foreground/70">Free plan</p>
          <p className="mt-1 font-heading text-[2.25rem] leading-none text-foreground">
            $0<span className="text-base text-muted-foreground"> / month</span>
          </p>
        </div>
        <p className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-semibold text-foreground">
          No credit card
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {GROUPS.map(({ product, Icon, tone, lines }) => (
          <div key={product} className={cn("rounded-xl border p-4", tone.border, tone.bg)}>
            <p className={cn("flex items-center gap-2 text-sm font-semibold", tone.text)}>
              <Icon className="size-4" aria-hidden />
              {product}
            </p>
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {lines.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-[0.9375rem] leading-snug text-foreground"
                >
                  <CheckBold className={cn("mt-1 size-3.5 shrink-0", tone.text)} aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="border-t border-border/70 bg-muted/40 px-5 py-3 text-sm text-muted-foreground sm:px-6">
        No time limit. Allowances reset monthly. Upgrade when you need to.
      </p>
    </div>
  );
}
