"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@relume_io/relume-ui"

const features = [
  {
    title: "Onboarding flows",
    description:
      "Guide new users through personalized onboarding sequences that adapt to their role and goals. Reduce time-to-value with interactive walkthroughs and contextual tooltips.",
    image: "Onboarding screenshot",
  },
  {
    title: "Team collaboration",
    description:
      "Real-time editing, threaded comments, and role-based permissions keep your team aligned. Share dashboards, assign tasks, and track progress from one place.",
    image: "Collaboration screenshot",
  },
  {
    title: "Advanced permissions",
    description:
      "Define granular access controls at the workspace, project, and resource level. Support for SSO, SCIM provisioning, and audit logs for enterprise compliance.",
    image: "Permissions screenshot",
  },
  {
    title: "API & webhooks",
    description:
      "A fully documented REST and GraphQL API lets you build custom integrations. Configure webhooks to push events to your own systems in real time.",
    image: "API screenshot",
  },
]

export function FeatureAccordion() {
  const [activeIndex, setActiveIndex] = useState("item-0")

  const activeFeature =
    features[
      Number(activeIndex?.replace("item-", "") ?? 0)
    ] ?? features[0]

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for scale, designed for simplicity
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Walk through each capability and see how it fits into your workflow.
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Accordion
            type="single"
            value={activeIndex}
            onValueChange={(v: string) => v && setActiveIndex(v)}
            collapsible
          >
            {features.map((f, i) => (
              <AccordionItem key={f.title} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.title}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {f.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-border bg-muted">
            <p className="text-sm text-muted-foreground">
              {activeFeature.image}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
