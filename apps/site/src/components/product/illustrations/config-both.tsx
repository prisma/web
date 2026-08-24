import { Bar, CardChrome, SurfaceCard } from "./parts";

// "One config for both halves" — the same prisma.config.ts declaring the app and
// the database. Both keys sit in one file at the same level, because that
// symmetry is the whole claim.

function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-cyan-600">{children}</span>;
}

export function ConfigBoth() {
  return (
    <SurfaceCard label="Illustration of a single prisma.config.ts file declaring both the app and the database side by side">
      <CardChrome file="prisma.config.ts" />
      <div className="flex flex-1 flex-col justify-center gap-[0.3rem] px-4 py-3 font-mono text-[0.625rem] leading-none text-foreground">
        <p>
          <span className="text-prism-yellow-600">export default</span> {"{"}
        </p>

        <p className="flex items-center gap-1.5 pl-3">
          <Key>app</Key>: {"{"}
        </p>
        <p className="flex items-center gap-1.5 pl-6">
          <Key>runtime</Key>: <Bar className="w-10" />
        </p>
        <p className="pl-3">{"},"}</p>

        <p className="flex items-center gap-1.5 pl-3">
          <Key>database</Key>: {"{"}
        </p>
        <p className="flex items-center gap-1.5 pl-6">
          <Key>region</Key>: <Bar className="w-12 bg-prism-cyan-100" />
        </p>
        <p className="pl-3">{"},"}</p>

        <p>{"}"}</p>
      </div>
    </SurfaceCard>
  );
}
