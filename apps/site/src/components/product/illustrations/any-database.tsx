import { CheckBold, ChevronsUpDown, Code, Database } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { CardChrome, HeroPanel, SectionLabel, StatRow } from "./parts";

// The /orm tour's breadth stop. Review feedback was that the current page makes
// it obvious Prisma works across many databases and the redesign should keep
// that obvious, so this reads as a datasource switcher: the one value that
// changes is the provider string, and the schema and the generated client above
// it are visibly untouched.
//
// No logos — we have no assets for them. Every value here is a real Prisma
// `provider` string, and the list is exactly the set Prisma supports: hosts
// like PlanetScale or Neon are reached through one of these (PlanetScale is
// `mysql`), so listing them beside the engines would misrepresent what the
// provider field actually takes. Six also grids evenly, with no orphan card.

const PROVIDERS = [
  { name: "PostgreSQL", value: "postgresql", active: true },
  { name: "MySQL", value: "mysql" },
  { name: "SQLite", value: "sqlite" },
  { name: "MongoDB", value: "mongodb" },
  { name: "SQL Server", value: "sqlserver" },
  { name: "CockroachDB", value: "cockroachdb" },
];

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-cyan-600">{children}</span>;
}

export function AnyDatabase() {
  return (
    <HeroPanel label="Illustration of one Prisma schema running on any database: a datasource block with the provider value highlighted as the only thing that changes, the same generated client query above it, and a grid of providers — PostgreSQL, MySQL, SQLite, MongoDB, SQL Server and CockroachDB — with PostgreSQL active">
      <CardChrome
        file="schema.prisma"
        right={
          <span className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[0.5625rem] font-semibold text-muted-foreground">
            one schema
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-2.5 px-5 py-5">
        {/* the switch itself: one string in one block */}
        <div className="flex flex-col gap-2 font-mono text-[0.6875rem] leading-none text-foreground">
          <p>
            <Kw>datasource</Kw> db {"{"}
          </p>
          <p className="flex items-center gap-2 pl-4">
            provider =
            <span className="inline-flex items-center gap-1.5 rounded-md border border-prism-cyan-200 bg-prism-cyan-50 px-1.5 py-1 font-semibold text-prism-cyan-800">
              &quot;postgresql&quot;
              <ChevronsUpDown className="size-2.5" />
            </span>
          </p>
          <p className="pl-4">
            url&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = <Kw>env</Kw>(&quot;DATABASE_URL&quot;)
          </p>
          <p>{"}"}</p>
        </div>

        {/* what sits above every one of them, unchanged */}
        <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5">
          <Code className="size-3 shrink-0 text-foreground" />
          <span className="font-mono text-[0.625rem] text-foreground">db.user.findMany()</span>
          <span className="ml-auto text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            same on every provider
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <SectionLabel>Providers</SectionLabel>
            <span className="ml-auto font-mono text-[0.5625rem] text-muted-foreground">
              {PROVIDERS.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {PROVIDERS.map(({ name, value, active }) => (
              <div
                key={name}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-2 py-1.5",
                  active ? "border-prism-cyan-200 bg-prism-cyan-50" : "border-border/70 bg-card",
                )}
              >
                <Database
                  className={cn(
                    "size-3 shrink-0",
                    active ? "text-prism-cyan-700" : "text-muted-foreground/70",
                  )}
                />
                <span
                  className={cn(
                    "shrink-0 text-[0.625rem] font-semibold",
                    active ? "text-prism-cyan-800" : "text-foreground",
                  )}
                >
                  {name}
                </span>
                <span className="ml-auto min-w-0 truncate font-mono text-[0.5625rem] text-muted-foreground">
                  {value}
                </span>
                {active ? <CheckBold className="size-2.5 shrink-0 text-prism-cyan-500" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <StatRow label="schema.prisma" value="unchanged" accent />
          <StatRow label="generated client" value="unchanged" accent />
        </div>
      </div>
    </HeroPanel>
  );
}
