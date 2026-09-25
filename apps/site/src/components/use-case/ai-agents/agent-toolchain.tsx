import { AgentRobot } from "@/components/brand/agent-robot";
import { IconTile } from "@/components/brand/icon-tile";
import { Pattern } from "@/components/brand/pattern";
import { Code, Console, Database, Server } from "@/components/icons/forma";

// The intro's 1:1 abstraction: Prismo at the centre of one connected toolchain.
// The four pieces the copy names — schema, database, hosting, CLI — sit on a
// rail wired up to the agent above them, so the picture says the section's
// point: one connected Prisma toolchain the agent drives, not four separate
// contexts. Square by design (1:1), filling its column so it reads as one large
// object; the copy beside it is centred to the square (see AgentIntro).
const NODES = [
  { Icon: Code, label: "Schema" },
  { Icon: Database, label: "Database" },
  { Icon: Server, label: "Hosting" },
  { Icon: Console, label: "CLI" },
];

export function AgentToolchain() {
  return (
    <div
      role="img"
      aria-label="The Prisma agent at the centre of one connected toolchain: schema, database, hosting, and CLI wired to it"
      className="relative flex aspect-square w-full flex-col overflow-hidden rounded-[1.25rem] border border-black/[0.06] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.14)]"
    >
      {/* cube pattern, faint at the top (the panel idiom) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_45%)]"
      >
        <Pattern className="h-full w-full" scale={2.5} />
      </div>
      {/* the spectral bottom wash, as on the hero panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background: [
            "radial-gradient(60% 46% at 24% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 24%, transparent), transparent 70%)",
            "radial-gradient(52% 42% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 20%, transparent), transparent 68%)",
            "radial-gradient(56% 44% at 80% 100%, color-mix(in srgb, var(--color-prism-red-400) 22%, transparent), transparent 70%)",
          ].join(","),
        }}
      />

      {/* Prismo, floating over a soft bloom */}
      <div className="relative flex flex-1 items-center justify-center">
        <div aria-hidden className="absolute size-[52%] rounded-full bg-white/50 blur-2xl" />
        <AgentRobot variant="look" className="relative w-[46%]" />
      </div>

      {/* the connected toolchain: a rail wired up to the agent */}
      <div className="relative px-6 pb-8 pt-2 sm:px-8">
        {/* drop line from the agent to the rail */}
        <span
          aria-hidden
          className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-black/15"
        />
        {/* the rail */}
        <span
          aria-hidden
          className="absolute inset-x-[12%] top-4 h-px bg-gradient-to-r from-prism-cyan-300 via-prism-yellow-300 to-prism-red-400"
        />
        <div className="relative grid grid-cols-4 gap-2 pt-4">
          {NODES.map(({ Icon, label }) => (
            <div key={label} className="relative flex flex-col items-center gap-2">
              {/* connector stub rising to the rail */}
              <span
                aria-hidden
                className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 -translate-y-4 bg-black/15"
              />
              <IconTile className="size-10 sm:size-11">
                <Icon className="size-4 text-foreground sm:size-[1.125rem]" aria-hidden />
              </IconTile>
              <span className="text-center text-[0.6875rem] font-medium text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
