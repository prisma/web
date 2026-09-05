import { createPageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { PrismButton } from "@/components/brand/prism-button";

export const metadata = createPageMetadata({
  title: "Security & Compliance",
  description:
    "Prisma's certifications and standards: SOC 2, ISO 27001, GDPR, and HIPAA, with full details and reports in the Prisma Trust Center.",
  path: "/legal/security-and-compliance",
  ogKicker: "Legal",
});

// Compliance claims sourced from the pricing spec table (plan availability)
// and the partner terms; the Trust Center carries the authoritative reports.
const STANDARDS = [
  {
    name: "SOC 2 Type II",
    description:
      "Independently audited controls for security, availability, and confidentiality. Available on the Business plan and above.",
  },
  {
    name: "ISO 27001",
    description:
      "Certified information security management system. Available on the Business plan and above.",
  },
  {
    name: "GDPR",
    description:
      "Data processing aligned with EU data-protection law, on every plan including Free.",
  },
  {
    name: "HIPAA",
    description:
      "Support for workloads with protected health information. Available from the Pro plan.",
  },
];

const RELATED = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Service Level Agreement", href: "/legal/sla" },
];

export default function SecurityCompliancePage() {
  return (
    <article className="bg-card px-4 pb-24 pt-32 sm:px-8 sm:pb-32 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-foreground/[0.07] pb-10">
          <RoleKicker color="bg-prism-cyan-400">Legal</RoleKicker>
          <h1 className="mt-4 text-balance text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
            Security &amp; Compliance
          </h1>
          <p className="mt-5 max-w-[58ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            Prisma runs production infrastructure for teams in regulated environments. Audit
            reports, control details, and live subprocessor lists live in the Prisma Trust Center.
          </p>
          <div className="mt-6">
            <PrismButton href="https://trust.prisma.io/">Open the Trust Center</PrismButton>
          </div>
        </header>

        <section className="py-10">
          <h2 className="text-xl leading-snug sm:text-2xl">Certifications and standards</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {STANDARDS.map((standard) => (
              <div
                key={standard.name}
                className="rounded-2xl border border-foreground/[0.06] bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)]"
              >
                <h3 className="text-base font-semibold">{standard.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Plan-by-plan compliance coverage is listed in the{" "}
            <Link href="/pricing" className="font-semibold text-prism-cyan-700">
              pricing spec table
            </Link>
            .
          </p>
        </section>

        <section className="border-t border-foreground/[0.05] py-10">
          <h2 className="text-xl leading-snug sm:text-2xl">Related policies</h2>
          <div className="mt-5 flex flex-col gap-2.5">
            {RELATED.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
              >
                {item.label}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
