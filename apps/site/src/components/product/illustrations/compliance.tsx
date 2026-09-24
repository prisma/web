import { CheckBold, Shield } from "@/components/icons/forma";
import { CardChrome, SectionLabel, SurfaceCard } from "./parts";

// "Production-ready from day one". Two accuracy points here:
//  - The certifications are Business-tier in the copy, so the tier is labelled
//    on the badge row rather than left to imply they apply everywhere.
//  - "no cold starts" is in the copy but a standing guardrail says not to
//    promote it, so it stays out of the illustration.

const CERTS = ["SOC 2", "HIPAA", "ISO 27001", "GDPR"];
const ALWAYS = ["Daily backups", "Encrypted in transit and at rest", "Full tenant isolation"];

export function Compliance() {
  return (
    <SurfaceCard label="Illustration of production readiness: daily backups, encryption in transit and at rest, full tenant isolation, and SOC 2, HIPAA, ISO 27001 and GDPR certifications at the Business tier">
      <CardChrome file="compliance" />
      <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-3 text-[0.625rem] leading-none">
        <div className="flex flex-col gap-2">
          {ALWAYS.map((label) => (
            <p key={label} className="flex items-center gap-2 text-muted-foreground">
              <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
              {label}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/30 p-2.5">
          <div className="flex items-center gap-2">
            <Shield className="size-3 shrink-0 text-foreground/60" />
            <SectionLabel>Business tier</SectionLabel>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CERTS.map((c) => (
              <span
                key={c}
                className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[0.5625rem] font-semibold text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
