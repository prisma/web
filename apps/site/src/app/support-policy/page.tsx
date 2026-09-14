import { createPageMetadata } from "@/lib/page-metadata";
import type { ReactNode } from "react";
import { RoleKicker } from "@/components/brand/role-kicker";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import {
  publicHolidays,
  responseTimes,
  severityLevels,
  supportChannels,
} from "@/data/support-policy";

export const metadata = createPageMetadata({
  title: "Support Policy",
  description: "Read our support policy and see how it relates to you.",
  path: "/support-policy",
  ogKicker: "Support",
});

// Restyled from the old support-policy page: same data tables and prose, on
// the legal-document shell of the new design system.

function Check({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <span aria-label="Included" className="font-semibold text-prism-cyan-700">
      Yes
    </span>
  ) : (
    <span aria-label="Not included" className="text-muted-foreground">
      -
    </span>
  );
}

function PolicyTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[#eef4f3]">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:px-4 [&_td]:py-3 [&_tr]:border-t [&_tr]:border-black/[0.05]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-black/[0.05] py-8 last:border-b-0">
      <h2 className="text-xl leading-snug sm:text-2xl">{title}</h2>
      <div className="mt-4 flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-prism-cyan-700">
        {children}
      </div>
    </section>
  );
}

export default function SupportPolicyPage() {
  return (
    <article className="bg-white px-4 pb-24 pt-32 sm:px-8 sm:pb-32 md:pt-40">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-black/[0.07] pb-10">
          <RoleKicker color="bg-prism-cyan-400">Support</RoleKicker>
          <h1 className="mt-4 text-balance text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
            Prisma Support Policy
          </h1>
          <p className="mt-5 max-w-[58ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            At Prisma, developer experience is at the heart of everything we do. This page explains
            how to get help, which support channels are available, and how requests are prioritized.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <PrismButton href="/docs">Read the docs</PrismButton>
            <PrismButtonOutline href="/support">Visit support</PrismButtonOutline>
          </div>
        </header>

        <div className="mt-4 flex flex-col">
          <Section title="Getting help">
            <p>
              Getting help when you need it is an essential part of developer experience, just like
              great tooling, docs, or a great API are.
            </p>
            <p>
              To resolve issues with our products, we recommend starting with our comprehensive{" "}
              <a href="/docs">documentation</a>. Additionally, our Ask AI feature within the docs is
              available to assist all users and customers.
            </p>
          </Section>

          <Section title="Support services for Prisma ORM">
            <p>
              Support for Prisma&apos;s open-source software, including{" "}
              <a href="https://github.com/prisma/orm">Prisma ORM</a>, is provided through our
              community channels on <a href="https://github.com/prisma/orm/discussions">GitHub</a>{" "}
              and <a href="https://pris.ly/discord">Discord</a>.
            </p>
            <p>
              Prisma also offers custom support packages for enterprises and solutions providers.
            </p>
          </Section>

          <Section title="Support services for Prisma Data Platform">
            <p>
              Prisma provides support for Prisma Data Platform customers based on their selected
              plan. More details are available on our <a href="/pricing">pricing page</a>.
            </p>
          </Section>

          <Section title="Support channels">
            <p>
              Whenever possible, we recommend contacting us through the built-in integration on{" "}
              <a href="https://console.prisma.io">console.prisma.io</a> instead of direct email
              support. It gives us additional context and helps us respond faster and more
              accurately.
            </p>
            <PolicyTable
              head={[
                "Platform plan",
                "Support plan",
                "Discord",
                "Contact via Console",
                "Email via support@prisma.io",
                "Dedicated contact",
              ]}
            >
              {supportChannels.map((row) => (
                <tr key={row.platformPlan}>
                  <td className="font-semibold text-foreground">{row.platformPlan}</td>
                  <td>{row.supportPlan}</td>
                  <td>
                    <Check enabled={row.discord} />
                  </td>
                  <td>
                    <Check enabled={row.console} />
                  </td>
                  <td>
                    <Check enabled={row.email} />
                  </td>
                  <td>
                    <Check enabled={row.dedicatedContact} />
                  </td>
                </tr>
              ))}
            </PolicyTable>
          </Section>

          <Section title="Response times">
            <p>
              We aim to respond to all requests in a timely manner. Requests are prioritized based
              on the requester&apos;s plan and the severity of the issue.
            </p>
            <PolicyTable head={["Platform plan", "Support plan", "Response time"]}>
              {responseTimes.map((row) => (
                <tr key={row.platformPlan}>
                  <td className="font-semibold text-foreground">{row.platformPlan}</td>
                  <td>{row.supportPlan}</td>
                  <td>{row.responseTime}</td>
                </tr>
              ))}
            </PolicyTable>
          </Section>

          <Section title="Business hours">
            <p>
              Our business hours are 9am-5pm CET on regular weekdays, Monday to Friday, except for
              public holidays in Germany.
            </p>
            <p>
              We provide additional coverage under our dedicated support plans for customers on our
              Enterprise plan.
            </p>
          </Section>

          <Section title="Severity levels">
            <p>
              The severity level is indicated by the customer when submitting a support request.
              Prisma may set, upgrade, or downgrade the severity level at its discretion based on
              the information available.
            </p>
            <PolicyTable head={["Level", "Definition"]}>
              {severityLevels.map((row) => (
                <tr key={row.level}>
                  <td className="font-semibold text-foreground">{row.level}</td>
                  <td>{row.definition}</td>
                </tr>
              ))}
            </PolicyTable>
          </Section>

          <Section title="Definitions and terminology">
            <ol className="list-decimal pl-6 [&_li]:mt-2">
              <li>
                <strong className="font-semibold text-foreground">Production Environment</strong>{" "}
                means an environment serving your end-users or customers.
              </li>
              <li>
                <strong className="font-semibold text-foreground">Initial Response</strong> means an
                initial response to a support request that, at a minimum, acknowledges receipt of
                the request.
              </li>
              <li>
                <strong className="font-semibold text-foreground">Support Services</strong> means
                the product and services support that Prisma has agreed to provide to you, the
                customer.
              </li>
              <li>
                <strong className="font-semibold text-foreground">Workaround</strong> means a method
                that can be used by the customer to avoid an error or issue without substantially
                impairing their use of the software or services.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Unscheduled Service Outage
                </strong>{" "}
                refers to an interruption of the service, not previously communicated to the
                customer, that causes the customer&apos;s projects to be unavailable to end users.
                This does not include any downtime planned by the customer.
              </li>
            </ol>
            <p>
              More information is available in our <a href="/legal/privacy">Privacy Policy</a> and{" "}
              <a href="/legal/terms">Terms of Service</a>.
            </p>
          </Section>

          <Section title="Etiquette">
            <p>
              Prisma is dedicated to providing a positive experience for everyone using our support
              services. Please communicate in a professional and respectful manner. Prisma reserves
              the right to cease providing support services if communication includes abusive,
              profane, or otherwise inappropriate language. More information is available in our{" "}
              <a href="/event-code-of-conduct">Code of Conduct</a>.
            </p>
          </Section>

          <Section title="List of public holidays">
            <ul className="list-disc pl-6 [&_li]:mt-1">
              {publicHolidays.map((holiday) => (
                <li key={holiday}>{holiday}</li>
              ))}
            </ul>
            <p>Prisma reserves the right to update this Support Policy.</p>
          </Section>
        </div>
      </div>
    </article>
  );
}
