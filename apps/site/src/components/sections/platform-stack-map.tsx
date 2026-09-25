import { Swap } from "@/components/icons/forma";
import { Pattern } from "@/components/brand/pattern";
import { cn } from "@/lib/utils";

// Node centers in a 3-column grid with gap-5 (1.25rem): the outer columns are
// each (100% - 2.5rem)/3 wide, so their centers sit one half-column in from
// the edges. Every wire below is positioned off these values, which is why the
// bus and the drops line up with the cards exactly at any width.
const COL = "calc((100% - 2.5rem) / 6)";
// Midpoint between the middle and right node centers — where the co-location
// bracket hangs its caption.
const MID = "calc(75% - (100% - 2.5rem) / 12)";

const CO_LOCATED = "Postgres and your app on the same host — single-digit ms queries";

const NODES = [
  { name: "Prisma ORM", role: "Type-safe data layer", dot: "bg-prism-cyan-400" },
  { name: "Prisma Postgres", role: "Managed database", dot: "bg-prism-yellow-400" },
  { name: "Prisma Compute", role: "App hosting", dot: "bg-prism-red-500" },
];

// `flow` carries the brand's sliding spectrum gradient along the wire (the
// same motif as .spectrum-border / .spectrum-ink, on a hairline) — "x" runs
// along the wire, "y" runs down it. Without it the wire is a plain hairline.
function Wire({
  className,
  style,
  flow,
}: {
  className?: string;
  style?: React.CSSProperties;
  flow?: "x" | "y";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute",
        flow === "x" && "spectrum-wire-x",
        flow === "y" && "spectrum-wire-y",
        !flow && "bg-border",
        className,
      )}
      style={style}
    />
  );
}

// The schema chip — the same file-chip idiom as the homepage's ConnectorStrip,
// promoted to the thing the whole diagram hangs off.
function SchemaChip() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-2 shadow-[0_8px_20px_-8px_rgba(21,21,21,0.25)]">
      <Swap className="size-4 shrink-0 text-foreground/70" aria-hidden />
      <code className="font-mono text-[0.8125rem] text-foreground">config.prisma</code>
      <span className="text-sm text-muted-foreground">one config</span>
    </div>
  );
}

function Node({ name, role, dot }: (typeof NODES)[number]) {
  return (
    <div className="relative rounded-xl border border-black/[0.06] bg-card p-5 text-center shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-8px_rgba(21,21,21,0.08)]">
      <p className="flex items-center justify-center gap-2 text-[0.9375rem] font-semibold text-foreground">
        <span aria-hidden className={`size-2 shrink-0 rounded-full ${dot}`} />
        {name}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{role}</p>
    </div>
  );
}

// The system overview the page opens on: one schema up top, the three products
// wired to it, and the two runtime pieces bracketed together because they share
// a host. The pulse travelling the bus is the schema propagating — the whole
// claim of the page in one movement.
export function StackMap() {
  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-black/[0.06] bg-white px-6 py-10 sm:px-10 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      >
        <Pattern className="h-full w-full" scale={2.5} />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="flex justify-center">
          <SchemaChip />
        </div>

        {/* mobile: one spine straight down instead of the bus */}
        <div aria-hidden className="mx-auto h-8 w-px bg-border md:hidden" />

        {/* desktop wiring: drop from the chip, a bus across the three node
            centers, then a drop into each node — every segment carrying the
            spectrum, so the schema visibly runs out into all three products */}
        <div aria-hidden className="relative hidden h-16 md:block">
          <Wire flow="y" className="left-1/2 top-0 h-6 w-px -translate-x-1/2" />
          <Wire flow="x" className="top-6 h-px" style={{ left: COL, right: COL }} />
          <Wire flow="y" className="top-6 h-10 w-px -translate-x-1/2" style={{ left: COL }} />
          <Wire flow="y" className="left-1/2 top-6 h-10 w-px -translate-x-1/2" />
          <Wire flow="y" className="top-6 h-10 w-px translate-x-1/2" style={{ right: COL }} />
        </div>

        <div className="relative grid gap-5 md:grid-cols-3">
          {/* the mobile spine, showing through the gaps between stacked nodes */}
          <Wire className="inset-y-0 left-1/2 w-px -translate-x-1/2 md:hidden" />
          {NODES.map((node) => (
            <Node key={node.name} {...node} />
          ))}
        </div>

        {/* co-location bracket joining the two runtime pieces */}
        <div className="relative hidden h-[4.75rem] md:block">
          <Wire className="left-1/2 top-0 h-4 w-px -translate-x-1/2" />
          <Wire className="top-0 h-4 w-px translate-x-1/2" style={{ right: COL }} />
          <Wire className="top-4 h-px" style={{ left: "50%", right: COL }} />
          <Wire className="top-4 h-4 w-px -translate-x-1/2" style={{ left: MID }} />
          <p
            className="absolute top-9 w-[30ch] -translate-x-1/2 text-center text-sm text-muted-foreground"
            style={{ left: MID }}
          >
            {CO_LOCATED}
          </p>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground md:hidden">{CO_LOCATED}</p>
      </div>
    </div>
  );
}
