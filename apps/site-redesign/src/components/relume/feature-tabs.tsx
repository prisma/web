"use client"

import { BarChart3, Layers, Zap } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@relume_io/relume-ui"

const features = [
  {
    value: "analytics",
    icon: BarChart3,
    label: "Analytics",
    title: "Real-time analytics that drive decisions",
    description:
      "Track every metric that matters with customizable dashboards. Get instant insights into user behavior, conversion funnels, and revenue trends without writing a single query.",
    bullets: [
      "Custom dashboard builder with drag-and-drop",
      "Automated weekly and monthly reports",
      "Funnel analysis with drop-off detection",
    ],
  },
  {
    value: "integrations",
    icon: Layers,
    label: "Integrations",
    title: "Connect your entire tech stack",
    description:
      "Seamlessly integrate with over 100 tools your team already uses. From CRMs to payment processors, set up connections in clicks instead of weeks of development.",
    bullets: [
      "One-click OAuth connections",
      "Bi-directional data sync",
      "Custom webhook endpoints",
    ],
  },
  {
    value: "automation",
    icon: Zap,
    label: "Automation",
    title: "Automate repetitive workflows",
    description:
      "Build powerful automation rules with our visual workflow editor. Trigger actions based on user events, schedules, or custom conditions to eliminate manual tasks.",
    bullets: [
      "Visual workflow builder",
      "Event-based triggers and conditions",
      "Audit logs for every automated action",
    ],
  },
]

export function FeatureTabs() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need, organized your way
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Explore the core pillars of our platform and see how each feature
            works together to accelerate your growth.
          </p>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="mx-auto mb-12 flex w-fit">
              {features.map((f) => (
                <TabsTrigger
                  key={f.value}
                  value={f.value}
                  className="gap-2 px-6"
                >
                  <f.icon className="size-4" />
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {features.map((f) => (
              <TabsContent key={f.value} value={f.value}>
                <div className="grid items-center gap-12 lg:grid-cols-2">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {f.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {f.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-border bg-muted">
                    <p className="text-sm text-muted-foreground">
                      {f.label} screenshot
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}
