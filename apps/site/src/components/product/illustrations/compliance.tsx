import { CheckBold, Shield } from "@/components/icons/forma";
import { CardChrome, SectionLabel, SurfaceCard } from "./parts";

// "Production-ready from day one". Three accuracy points here:
//  - The certifications sit at different plan levels, so each badge group is
//    labelled with the plan it starts from: GDPR on every plan, HIPAA from
//    Pro, SOC 2 Type II and ISO 27001 on Business. The pricing comparison
//    table and the FAQ on this page agree on those boundaries.
//  - Daily backups are paid-plan only (Free has none), spelled out on the row.
//  - "no cold starts" is in the copy but a standing guardrail says not to
//    promote it, so it stays out of the illustration.

const CERT_GROUPS: { label: string; certs: string[] }[] = [
  { label: "Every plan", certs: ["GDPR"] },
  { label: "Pro", certs: ["HIPAA"] },
  { label: "Business", certs: ["SOC 2 Type II", "ISO 27001"] },
];
const ALWAYS = [
  "Daily backups on paid plans",
  "Encrypted in transit and at rest",
  "Full tenant isolation",
];

export function Compliance() {
  return (
    <SurfaceCard label="Illustration of production readiness: daily backups on paid plans, encryption in transit and at rest, full tenant isolation, and compliance badges grouped by plan: GDPR on every plan, HIPAA from Pro, SOC 2 Type II and ISO 27001 on Business">
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
            <SectionLabel>Compliance</SectionLabel>
          </div>
          <div className="flex flex-col gap-1.5">
            {CERT_GROUPS.map((group) => (
              <div key={group.label} className="flex items-center gap-2">
                <SectionLabel>{group.label}</SectionLabel>
                <div className="flex flex-wrap gap-1">
                  {group.certs.map((c) => (
                    <span
                      key={c}
                      className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[0.5625rem] font-semibold text-muted-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
