import { Bar, CardChrome, SurfaceCard } from "./parts";

// "One config for both halves" — the same Composer module.ts provisioning the
// database and the app that depends on it. Both provision calls sit in one
// file at the same level, because that symmetry is the whole claim. The shape
// follows the docs (composer/databases.mdx, "module.ts"): a module is
// provision() calls over service declarations, not a config object.

function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-cyan-600">{children}</span>;
}

function Keyword({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-yellow-600">{children}</span>;
}

export function ConfigBoth() {
  return (
    <SurfaceCard label="Illustration of a single module.ts file provisioning both the database and the app side by side">
      <CardChrome file="module.ts" />
      <div className="flex flex-1 flex-col justify-center gap-[0.3rem] px-4 py-3 font-mono text-[0.625rem] leading-none text-foreground">
        <p>
          <Keyword>export default</Keyword> <Key>module</Key>(<Bar className="w-8 align-middle" />, (
          {"{ provision }"}) {"=> {"}
        </p>

        <p className="pl-3">
          <Keyword>const</Keyword> db = <Key>provision</Key>(<Key>postgres</Key>(
          <Bar className="w-10 align-middle bg-prism-cyan-100" />));
        </p>
        <p className="pl-3">
          <Key>provision</Key>(<Key>web</Key>, {"{ deps: { db } }"});
        </p>

        <p>{"});"}</p>
      </div>
    </SurfaceCard>
  );
}
