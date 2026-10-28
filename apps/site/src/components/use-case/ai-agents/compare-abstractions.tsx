import { IconTile } from "@/components/brand/icon-tile";
import { Pattern } from "@/components/brand/pattern";
import { Code, Console, Database, Rocket, Server } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// The two abstractions for "How Prisma compares to stitched-together stacks",
// one per column of AgentCompare. Both are labelled only with terms the section
// copy already uses — the five separate concerns on the left ("the database,
// ORM, hosting, logs, and deployment"), the Prisma pieces on the right ("the
// Prisma schema, Prisma Postgres, Prisma Compute … CLIs and Management API").
// No invented product copy.

// Left — five separate tools sitting apart: dashed, muted, staggered, with no
// rail joining them. The agent has to reason across each on its own.
const SEPARATE = [
  { Icon: Database, label: "Database" },
  { Icon: Code, label: "ORM" },
  { Icon: Server, label: "Hosting" },
  { Icon: Console, label: "Logs" },
  { Icon: Rocket, label: "Deployment" },
];

export function StitchedAbstraction() {
  return (
    <div
      role="img"
      aria-label="Five separate tools — database, ORM, hosting, logs, and deployment — sitting apart, each on its own"
      className="flex h-full select-none flex-col justify-center rounded-2xl border border-dashed border-black/15 bg-muted/30 p-8"
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        {SEPARATE.map(({ Icon, label }, i) => (
          <span
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-dashed border-black/15 bg-white/70 px-3.5 py-2.5 text-sm font-medium text-muted-foreground",
              i % 2 === 0 ? "-translate-y-2" : "translate-y-2",
            )}
          >
            <Icon className="size-4 shrink-0 text-foreground/40" aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Right — one connected layer: the Prisma pieces stacked in a single spectrum-
// edged panel, joined by a spine, so they read as one thing rather than five.
const PIECES = [
  { Icon: Code, label: "Prisma schema" },
  { Icon: Database, label: "Prisma Postgres" },
  { Icon: Server, label: "Prisma Compute" },
  { Icon: Console, label: "CLIs & Management API" },
];

export function PrismaAbstraction() {
  return (
    <div
      role="img"
      aria-label="One connected TypeScript layer holding the Prisma schema, Prisma Postgres, Prisma Compute, and Prisma's CLIs and Management API"
      className="spectrum-border spectrum-border-on relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-transparent bg-white p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
      >
        <Pattern className="h-full w-full" scale={2.5} />
      </div>
      <div className="relative flex flex-col gap-2.5">
        {PIECES.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-card px-3.5 py-2.5 shadow-[0_1px_2px_rgba(21,21,21,0.04)]"
          >
            <IconTile className="size-8">
              <Icon className="size-4 text-foreground" aria-hidden />
            </IconTile>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
