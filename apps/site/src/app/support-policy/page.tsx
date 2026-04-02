import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@prisma/eclipse";
import {
  publicHolidays,
  responseTimes,
  severityLevels,
  supportChannels,
} from "@/data/support-policy";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Prisma Support Policy | Prisma",
  description:
    "Read our support policy and see how it relates to you.",
  path: "/support-policy",
  ogImage: "/og/og-support.png",
});

function SupportPolicyTableCheck({ enabled }: { enabled: boolean }) {
  return enabled ? <span aria-label="Included">Yes</span> : <span aria-label="Not included">-</span>;
}

export default function SupportPolicyPage() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 pt-40 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 my-12 py-12 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-orm-weak uppercase tracking-widest text-sm font-sans-display font-black">
              <i className="fa-regular fa-headset" />
              <span>Support</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
              Prisma Support Policy
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-3xl mx-auto text-xl">
            At Prisma, developer experience is at the heart of everything we do.
            This page explains how to get help, which support channels are
            available, and how requests are prioritized.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="orm"
              href="https://www.prisma.io/docs"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Read the docs</span>
              <i className="fa-regular fa-book-open ml-2" />
            </Button>
            <Button
              variant="default-stronger"
              href="/support"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Visit support</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-[996px] flex-col gap-12">
          <div className="rounded-2xl border border-stroke-neutral bg-background-default p-6 md:p-8">
            <div className="flex flex-col gap-4 text-base leading-7 text-foreground-neutral-weak [&_a]:text-foreground-orm-strong [&_a]:underline [&_a]:underline-offset-3">
              <p className="m-0">
                Getting help when you need it is an essential part of developer
                experience, just like great tooling, docs, or a great API are.
              </p>
              <p className="m-0">
                To resolve issues with our products, we recommend starting with
                our comprehensive{" "}
                <a href="https://prisma.io/docs">documentation</a>.
                Additionally, our Ask AI feature within the docs is available to
                assist all users and customers.
              </p>
            </div>
          </div>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
              Support Services for Prisma ORM
            </h2>
            <div className="flex flex-col gap-4 text-base leading-7 text-foreground-neutral-weak [&_a]:text-foreground-orm-strong [&_a]:underline [&_a]:underline-offset-3">
              <p className="m-0">
                Support for Prisma's open-source software, including{" "}
                <a href="https://github.com/prisma/prisma">Prisma ORM</a>, is
                provided through our community channels on{" "}
                <a href="https://github.com/prisma/prisma/discussions">
                  GitHub
                </a>{" "}
                and <a href="https://pris.ly/discord">Discord</a>.
              </p>
              <p className="m-0">
                Prisma also offers custom support packages for enterprises and
                solutions providers.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
              Support Services for Prisma Data Platform
            </h2>
            <p className="m-0 text-base leading-7 text-foreground-neutral-weak [&_a]:text-foreground-orm-strong [&_a]:underline [&_a]:underline-offset-3">
              Prisma provides support for Prisma Data Platform customers based
              on their selected plan. More details are available on our{" "}
              <a href="https://prisma.io/pricing">pricing page</a>.
            </p>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="m-0 text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
                Support Channels
              </h2>
              <p className="m-0 text-base leading-7 text-foreground-neutral-weak">
                Whenever possible, we recommend contacting us through the
                built-in integration on{" "}
                <a
                  href="https://console.prisma.io"
                  className="text-foreground-orm-strong underline underline-offset-3"
                >
                  console.prisma.io
                </a>{" "}
                instead of direct email support. It gives us additional context
                and helps us respond faster and more accurately.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stroke-neutral">
              <Table className="table-fixed">
                <TableHeader className="[&_tr]:border-b border-stroke-neutral">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground-neutral">
                      Platform plan
                    </TableHead>
                    <TableHead className="text-foreground-neutral">
                      Support plan
                    </TableHead>
                    <TableHead className="text-foreground-neutral">
                      Discord
                    </TableHead>
                    <TableHead className="text-foreground-neutral">
                      Contact via Console
                    </TableHead>
                    <TableHead className="text-foreground-neutral">
                      Email via support@prisma.io
                    </TableHead>
                    <TableHead className="text-foreground-neutral">
                      Dedicated contact
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportChannels.map((row) => (
                    <TableRow key={row.platformPlan} className="hover:bg-transparent">
                      <TableCell className="font-semibold text-foreground-neutral">
                        {row.platformPlan}
                      </TableCell>
                      <TableCell className="text-foreground-neutral-weak">
                        {row.supportPlan}
                      </TableCell>
                      <TableCell className="text-foreground-neutral-weak">
                        <SupportPolicyTableCheck enabled={row.discord} />
                      </TableCell>
                      <TableCell className="text-foreground-neutral-weak">
                        <SupportPolicyTableCheck enabled={row.console} />
                      </TableCell>
                      <TableCell className="text-foreground-neutral-weak">
                        <SupportPolicyTableCheck enabled={row.email} />
                      </TableCell>
                      <TableCell className="text-foreground-neutral-weak">
                        <SupportPolicyTableCheck enabled={row.dedicatedContact} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="m-0 text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
                Response Times
              </h2>
              <p className="m-0 text-base leading-7 text-foreground-neutral-weak">
                We aim to respond to all requests in a timely manner. Requests
                are prioritized based on the requester's plan and the severity
                of the issue.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stroke-neutral">
              <Table className="table-fixed">
                <TableHeader className="[&_tr]:border-b border-stroke-neutral">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground-neutral">
                      Platform plan
                    </TableHead>
                    <TableHead className="text-foreground-neutral">
                      Support plan
                    </TableHead>
                    <TableHead className="text-foreground-neutral">
                      Response time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responseTimes.map((row) => (
                    <TableRow key={row.platformPlan} className="hover:bg-transparent">
                      <TableCell className="font-semibold text-foreground-neutral">
                        {row.platformPlan}
                      </TableCell>
                      <TableCell className="text-foreground-neutral-weak">
                        {row.supportPlan}
                      </TableCell>
                      <TableCell className="text-foreground-neutral-weak">
                        {row.responseTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
              Business Hours
            </h2>
            <div className="flex flex-col gap-4 text-base leading-7 text-foreground-neutral-weak">
              <p className="m-0">
                Our business hours are 9am-5pm CET on regular weekdays, Monday
                to Friday, except for public holidays in Germany.
              </p>
              <p className="m-0">
                We provide additional coverage under our dedicated support plans
                for customers on our Enterprise plan.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="m-0 text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
                Additional Information
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="m-0 text-2xl text-foreground-neutral font-sans-display font-bold">
                Severity levels
              </h3>
              <p className="m-0 text-base leading-7 text-foreground-neutral-weak">
                The severity level is indicated by the customer when submitting
                a support request. Prisma may set, upgrade, or downgrade the
                severity level at its discretion based on the information
                available.
              </p>
              <div className="overflow-hidden rounded-2xl border border-stroke-neutral">
                <Table className="table-fixed">
                  <TableHeader className="[&_tr]:border-b border-stroke-neutral">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-foreground-neutral">
                        Level
                      </TableHead>
                      <TableHead className="text-foreground-neutral">
                        Definition
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {severityLevels.map((row) => (
                      <TableRow key={row.level} className="hover:bg-transparent">
                        <TableCell className="font-semibold text-foreground-neutral">
                          {row.level}
                        </TableCell>
                        <TableCell className="text-foreground-neutral-weak">
                          {row.definition}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="m-0 text-2xl text-foreground-neutral font-sans-display font-bold">
                Definitions and terminology
              </h3>
              <ol className="m-0 pl-6 text-base leading-7 text-foreground-neutral-weak">
                <li>
                  <strong>Production Environment</strong> means an environment
                  serving your end-users or customers.
                </li>
                <li>
                  <strong>Initial Response</strong> means an initial response to
                  a support request that, at a minimum, acknowledges receipt of
                  the request.
                </li>
                <li>
                  <strong>Support Services</strong> means the product and
                  services support that Prisma has agreed to provide to you, the
                  customer.
                </li>
                <li>
                  <strong>Workaround</strong> means a method that can be used by
                  the customer to avoid an error or issue without substantially
                  impairing their use of the software or services.
                </li>
                <li>
                  <strong>Unscheduled Service Outage</strong> refers to an
                  interruption of the service, not previously communicated to
                  the customer, that causes the customer's projects to be
                  unavailable to end users. This does not include any downtime
                  planned by the customer.
                </li>
              </ol>
              <p className="m-0 text-base leading-7 text-foreground-neutral-weak [&_a]:text-foreground-orm-strong [&_a]:underline [&_a]:underline-offset-3">
                More information is available in our{" "}
                <a href="https://pris.ly/privacy">Privacy Policy</a> and{" "}
                <a href="https://pris.ly/terms">Terms of Service</a>.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="m-0 text-2xl text-foreground-neutral font-sans-display font-bold">
                Etiquette
              </h3>
              <p className="m-0 text-base leading-7 text-foreground-neutral-weak [&_a]:text-foreground-orm-strong [&_a]:underline [&_a]:underline-offset-3">
                Prisma is dedicated to providing a positive experience for
                everyone using our support services. Please communicate in a
                professional and respectful manner. Prisma reserves the right to
                cease providing support services if communication includes
                abusive, profane, or otherwise inappropriate language. More
                information is available in our{" "}
                <a href="https://pris.ly/code-conduct">Code of Conduct</a>.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="m-0 text-2xl text-foreground-neutral font-sans-display font-bold">
                List of Public Holidays
              </h3>
              <ul className="m-0 pl-6 text-base leading-7 text-foreground-neutral-weak">
                {publicHolidays.map((holiday) => (
                  <li key={holiday}>{holiday}</li>
                ))}
              </ul>
              <p className="m-0 text-base leading-7 text-foreground-neutral-weak">
                Prisma reserves the right to update this Support Policy.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
