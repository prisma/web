import { Bar, CardChrome, SurfaceCard } from "./parts";

// "Built for agents, not just humans" — a structured error as the agent
// receives it. The real parts stay: the `--json` flag, Prisma's stable error
// code (P2002 is the unique-constraint failure) and the field names an agent
// keys off. The human-readable strings are what collapse to skeletons, since
// the point is that the agent doesn't need to parse them.

function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-cyan-700">&quot;{children}&quot;</span>;
}

export function AgentErrors() {
  return (
    <SurfaceCard label="Illustration of a structured Prisma error returned as JSON, carrying a stable error code, structured details and a remediation hint">
      <CardChrome file="terminal" />
      <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-3 font-mono text-[0.625rem] leading-none text-foreground">
        <p className="flex items-center gap-1.5">
          <span className="text-prism-cyan-500">$</span>
          <span>prisma db execute</span>
          <span className="rounded border border-border bg-muted px-1 py-0.5 text-muted-foreground">
            --json
          </span>
        </p>

        <div className="flex flex-col gap-1.5 rounded-lg border border-border/80 bg-muted/40 p-2.5">
          <p>{"{"}</p>
          <p className="flex items-center gap-1.5 pl-3">
            <Key>code</Key>:
            <span className="rounded border border-prism-red-200 bg-prism-red-50 px-1.5 py-0.5 font-semibold text-prism-red-700">
              P2002
            </span>
          </p>
          <p className="flex items-center gap-1.5 pl-3">
            <Key>meta</Key>: {"{"} <Bar className="w-12" /> {"}"}
          </p>
          <p className="flex items-center gap-1.5 pl-3">
            <Key>message</Key>: <Bar className="w-16" />
          </p>
          <p className="flex items-start gap-1.5 pl-3">
            <Key>remediation</Key>:
            <span className="flex flex-col gap-1 pt-[0.15rem]">
              <Bar className="w-20" />
              <Bar className="w-12" />
            </span>
          </p>
          <p>{"}"}</p>
        </div>
      </div>
    </SurfaceCard>
  );
}
