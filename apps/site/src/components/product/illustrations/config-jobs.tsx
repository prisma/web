import { Bar, CardChrome, SurfaceCard } from "./parts";

// "Cron and background jobs as a first-class concept" — declared in the same
// config as the rest of the app. Real: the filename the copy names, the config
// keys, and cron syntax. Abstracted: the handler paths.

function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-cyan-600">{children}</span>;
}

export function ConfigJobs() {
  return (
    <SurfaceCard label="Illustration of a prisma.config.ts file declaring scheduled crons and background jobs alongside the rest of the app">
      <CardChrome file="prisma.config.ts" />
      <div className="flex flex-1 flex-col justify-center gap-[0.3rem] px-4 py-3 font-mono text-[0.625rem] leading-none text-foreground">
        <p>
          <span className="text-prism-yellow-600">export default</span> {"{"}
        </p>
        <p className="flex items-center gap-1.5 pl-3">
          <Key>crons</Key>: [
        </p>
        <p className="flex items-center gap-1.5 pl-6">
          {"{"} <Key>schedule</Key>:{" "}
          <span className="rounded border border-border bg-muted px-1 py-0.5 text-muted-foreground">
            0 * * * *
          </span>
        </p>
        <p className="flex items-center gap-1.5 pl-6">
          <Key>run</Key>: <Bar className="w-16" /> {"},"}
        </p>
        <p className="pl-3">],</p>
        <p className="flex items-center gap-1.5 pl-3">
          <Key>jobs</Key>: [ <Bar className="w-14" /> ],
        </p>
        <p>{"}"}</p>
      </div>
    </SurfaceCard>
  );
}
