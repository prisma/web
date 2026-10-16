import { ArrowDown, Database, GitBranch, Server } from "lucide-react";

export function EnvironmentDiagram() {
  return (
    <figure className="not-prose my-10 rounded-xl border border-border p-5 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {[
          {
            name: "Test environment",
            branch: "feature branch",
            database: "Synthetic test records",
          },
          { name: "Production", branch: "protected main", database: "Customer records" },
        ].map(({ name, branch, database }) => (
          <div key={name} className="flex flex-col items-center text-center">
            <h3 className="text-base font-semibold text-foreground">{name}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="size-4" aria-hidden /> {branch}
            </p>
            <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-foreground">
              <Server className="size-4" aria-hidden /> Own app and API
            </div>
            <ArrowDown className="my-3 size-5 text-muted-foreground" aria-hidden />
            <div className="flex w-full flex-col items-center gap-2 rounded-lg bg-muted px-4 py-4 text-sm text-foreground">
              <Database className="size-5" aria-hidden />
              <span className="font-semibold">Separate database</span>
              <span>{database}</span>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
        Each app uses its own database credentials. The assistant gets access to the test
        environment.
      </figcaption>
    </figure>
  );
}
