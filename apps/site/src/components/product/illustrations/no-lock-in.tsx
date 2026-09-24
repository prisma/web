import { ArrowRight } from "@/components/icons/forma";
import { CardChrome, SectionLabel, SurfaceCard } from "./parts";

// "Standard Postgres, no lock-in" — the door out is shown as plainly as the
// things that plug in. Every name here is one the copy names; none are invented.

const ORMS = ["Prisma ORM", "Drizzle", "Kysely", "TypeORM"];
const AUTH = ["BetterAuth", "Clerk", "NextAuth"];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[0.5625rem] text-muted-foreground">
      {children}
    </span>
  );
}

export function NoLockIn() {
  return (
    <SurfaceCard label="Illustration of standard Postgres with no lock-in: pg_dump migrating data in or out, the pgvector extension, and any ORM or auth provider connecting to it">
      <CardChrome file="psql" />
      <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-3 text-[0.625rem] leading-none">
        {/* the way out, stated first */}
        <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 p-2.5 font-mono">
          <span className="text-prism-cyan-500">$</span>
          <span className="text-foreground">pg_dump</span>
          <ArrowRight className="size-3 shrink-0 text-muted-foreground/70" />
          <span className="text-muted-foreground">in or out</span>
          <span className="ml-auto rounded border border-border bg-card px-1.5 py-0.5 text-[0.5625rem] text-muted-foreground">
            pgvector
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <SectionLabel>Any ORM</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {ORMS.map((o) => (
              <Chip key={o}>{o}</Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <SectionLabel>Any auth</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {AUTH.map((a) => (
              <Chip key={a}>{a}</Chip>
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
