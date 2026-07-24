import { Card, CardContent } from "@/components/ui/card"

const integrations = [
  {
    name: "Slack",
    description: "Get notifications and updates right in your channels",
  },
  {
    name: "Stripe",
    description: "Sync payments, invoices, and subscription data",
  },
  {
    name: "GitHub",
    description: "Link commits, PRs, and issues to your workflows",
  },
  {
    name: "Google Workspace",
    description: "Connect Docs, Sheets, and Calendar seamlessly",
  },
  {
    name: "Salesforce",
    description: "Two-way sync with your CRM records and pipelines",
  },
  {
    name: "Zapier",
    description: "Connect to 5,000+ apps through automated triggers",
  },
  {
    name: "HubSpot",
    description: "Unify marketing, sales, and customer data",
  },
  {
    name: "Figma",
    description: "Attach designs and prototypes to any project",
  },
]

export function IntegrationGrid() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Integrates with your favorite tools
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Connect the tools you already use. No migration headaches, no data
            silos, just everything working together.
          </p>
        </div>

        {/* Integration grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {integrations.map((integration) => (
            <Card key={integration.name} className="py-5 transition-shadow hover:shadow-md">
              <CardContent className="flex items-start gap-4">
                {/* Icon placeholder */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                  <span className="text-sm font-bold text-muted-foreground">
                    {integration.name.charAt(0)}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {integration.name}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
