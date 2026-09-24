import { Zap, Shield, BarChart3, Users, Globe, Layers } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning fast setup",
    description:
      "Go from zero to production in minutes, not weeks. Pre-configured auth, billing, and database so you can start building immediately.",
  },
  {
    icon: Shield,
    title: "Secure by default",
    description:
      "Enterprise-grade security out of the box with SOC 2 compliance, end-to-end encryption, and role-based access controls.",
  },
  {
    icon: BarChart3,
    title: "Built-in analytics",
    description:
      "Understand your users with real-time dashboards, funnel tracking, and cohort analysis without any third-party tools.",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description:
      "Invite your whole team with granular permissions, shared workspaces, and activity feeds that keep everyone in sync.",
  },
  {
    icon: Globe,
    title: "Global edge network",
    description:
      "Deploy to 300+ edge locations worldwide. Your app loads fast for every user, no matter where they are.",
  },
  {
    icon: Layers,
    title: "Extensible API",
    description:
      "Build exactly what you need with a well-documented REST and GraphQL API, webhooks, and a growing library of integrations.",
  },
];

export function FeatureGrid() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to ship fast
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A complete toolkit for building, launching, and scaling your SaaS. Stop reinventing the
            wheel and focus on what matters.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
