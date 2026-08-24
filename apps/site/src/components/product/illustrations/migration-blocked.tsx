import { ArrowRight, CheckBold, Shield, XCircle } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { CardChrome, HeroPanel, SectionLabel, StatRow } from "./parts";

// The /orm tour's migration-safety stop. Review feedback was that migration
// safety is the strongest differentiator and the page only described it, so
// this panel shows it happening: a real `prisma migrate dev` plan where two
// steps are safe and the third would drop a column that still holds data, and
// Prisma refuses the whole migration before touching the database.
//
// Everything a reader needs to conclude "it stopped, and my data is fine" is
// stated in plain terms — the warning names the column, the resolution line
// says nothing was applied, and the footer counts zero rows affected.

const STEPS = [
  { sql: 'ALTER TABLE "User" ADD COLUMN "handle" TEXT', destructive: false },
  {
    sql: 'CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle")',
    destructive: false,
  },
  { sql: 'ALTER TABLE "User" DROP COLUMN "email"', destructive: true },
];

export function MigrationBlocked() {
  return (
    <HeroPanel label="Illustration of Prisma refusing a destructive migration: a migrate plan with two safe steps checked and a drop-column step flagged as destructive, a warning that the column still contains data, and a confirmation that the migration was not applied and the database is unchanged">
      <CardChrome
        file="prisma migrate dev"
        right={
          <span className="flex items-center gap-1.5 rounded border border-prism-red-200 bg-prism-red-50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-prism-red-700">
            <XCircle className="size-2.5" />
            refused
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-2.5 px-5 py-5">
        <p className="flex items-center gap-1.5 font-mono text-[0.6875rem] leading-none text-foreground">
          <span className="text-prism-cyan-500">$</span>
          prisma migrate dev --name drop_email
        </p>

        {/* the plan, step by step */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <SectionLabel>Migration plan</SectionLabel>
            <span className="ml-auto font-mono text-[0.5625rem] text-muted-foreground">
              3 steps
            </span>
          </div>

          <ol className="flex flex-col gap-1.5">
            {STEPS.map(({ sql, destructive }, i) => (
              <li
                key={sql}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-2.5 py-1.5",
                  destructive
                    ? "border-prism-red-200 bg-prism-red-50/70"
                    : "border-border/70 bg-muted/30",
                )}
              >
                <span className="w-2 shrink-0 font-mono text-[0.5625rem] text-muted-foreground/70">
                  {i + 1}
                </span>
                {destructive ? (
                  <XCircle className="size-3 shrink-0 text-prism-red-600" />
                ) : (
                  <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
                )}
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate font-mono text-[0.625rem]",
                    destructive ? "text-prism-red-700" : "text-foreground",
                  )}
                >
                  {sql}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded border px-1.5 py-0.5 text-[0.5625rem] font-semibold",
                    destructive
                      ? "border-prism-red-200 bg-prism-red-100/60 text-prism-red-700"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {destructive ? "destructive" : "safe"}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* what the destructive step would cost, in concrete terms */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-prism-red-200 bg-prism-red-50/60 p-2.5">
          <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-prism-red-700">
            <Shield className="size-3 shrink-0" />
            Destructive change detected
          </p>
          <p className="text-[0.625rem] leading-relaxed text-prism-red-700/90">
            You are about to drop the column{" "}
            <span className="font-mono font-semibold">&quot;email&quot;</span> on the{" "}
            <span className="font-mono font-semibold">&quot;User&quot;</span> table, which would
            drop 1 column containing data.
          </p>
        </div>

        {/* the resolution, and the way forward */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/50 p-2">
          <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-prism-cyan-800">
            <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
            Migration not applied — no changes were made to your data.
          </p>
          <p className="flex items-center gap-1.5 text-[0.625rem] text-prism-cyan-800/80">
            <ArrowRight className="size-3 shrink-0" />
            Review the generated migration, or add a backfill step, then re-run.
          </p>
        </div>

        <div className="flex flex-col">
          <StatRow label="steps applied" value="0 of 3" />
          <StatRow label="rows affected" value="0" accent />
        </div>
      </div>
    </HeroPanel>
  );
}
