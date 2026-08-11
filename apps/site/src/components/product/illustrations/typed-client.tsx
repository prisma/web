import { Bar, CardChrome, SurfaceCard } from "./parts";

// "Type-safe client" — the generated client's autocomplete, and the inferred
// return type spelled out underneath. Same idiom as the homepage's
// orm-illustration, held still: inside a feature card the motion would compete
// with the three cards around it.

const OPTIONS = [
  { label: "where", bar: "w-10" },
  { label: "select", bar: "w-8" },
  { label: "include", bar: "w-9" },
];

export function TypedClient() {
  return (
    <SurfaceCard label="Illustration of a typed Prisma query client: an autocomplete menu over a query, with the inferred result type shown below">
      <CardChrome file="app.ts" />
      <div className="flex flex-1 flex-col justify-between px-4 py-3 font-mono text-[0.6875rem] leading-none text-foreground">
        <div>
          <p className="flex items-center gap-1.5">
            <span className="text-prism-cyan-600">const</span> users ={" "}
            <span className="text-prism-cyan-600">await</span>
          </p>
          <p className="mt-2.5">db.user.findMany(</p>

          {/* autocomplete, first row selected */}
          <div className="relative ml-6 mt-2 w-40 rounded-lg border border-border bg-card py-1 shadow-[0_12px_28px_-10px_rgba(21,21,21,0.22)]">
            <span
              aria-hidden
              className="absolute inset-x-1 top-1 h-[1.15rem] rounded bg-prism-cyan-50"
            />
            {OPTIONS.map(({ label, bar }) => (
              <p key={label} className="relative flex items-center gap-2 px-2.5 py-1">
                {label}
                <Bar className={`ml-auto ${bar}`} />
              </p>
            ))}
          </div>

          <p className="mt-2.5">)</p>
        </div>

        <p className="flex items-center gap-2 border-t border-border/60 pt-2.5 text-[0.6875rem]">
          <span className="size-1.5 shrink-0 rounded-full bg-prism-cyan-400" />
          users: <span className="text-prism-yellow-600">User[]</span>
          <Bar className="ml-auto w-10" />
        </p>
      </div>
    </SurfaceCard>
  );
}
