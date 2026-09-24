import { Check } from "lucide-react";

const features = [
  {
    heading: "Build workflows that actually work",
    description:
      "Stop cobbling together tools that don't talk to each other. Our visual workflow builder lets you automate complex processes in minutes, not months.",
    bullets: [
      "Drag-and-drop workflow editor with 50+ pre-built actions",
      "Real-time execution monitoring and error handling",
      "Version control for every workflow change",
    ],
  },
  {
    heading: "Analytics that tell you what matters",
    description:
      "Ditch the spreadsheet chaos. Get a single dashboard that surfaces the metrics your team actually needs to make decisions.",
    bullets: [
      "Custom dashboards for every team and role",
      "Automated reports delivered to your inbox weekly",
      "Anomaly detection that alerts you before things break",
    ],
  },
  {
    heading: "Collaborate without the back-and-forth",
    description:
      "No more chasing approvals in Slack or losing context in email threads. Everything your team needs lives in one place.",
    bullets: [
      "Threaded comments on any task or document",
      "Real-time multiplayer editing with presence indicators",
      "Granular permissions so the right people see the right things",
    ],
  },
];

export function FeatureRows() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-site">
        <div className="flex flex-col gap-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={feature.heading}
                className={`flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16 ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text content */}
                <div className="flex-1">
                  <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                    {feature.heading}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  <ul className="mt-8 flex flex-col gap-3">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-base text-foreground">
                        <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3 text-primary" />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image placeholder */}
                <div className="flex-1">
                  <div className="aspect-[4/3] w-full rounded-2xl bg-muted shadow-sm ring-1 ring-border" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
