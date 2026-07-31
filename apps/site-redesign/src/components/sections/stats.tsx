const stats = [
  {
    value: "10K+",
    label: "Customers",
    description: "Teams trust us to run their operations",
  },
  {
    value: "99.9%",
    label: "Uptime",
    description: "Enterprise-grade reliability, always on",
  },
  {
    value: "50M+",
    label: "Tasks Processed",
    description: "Workflows automated every single month",
  },
  {
    value: "4.9/5",
    label: "Rating",
    description: "Across G2, Capterra, and Trustpilot",
  },
]

export function Stats() {
  return (
    <section className="bg-muted/50 py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-site">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Trusted by thousands of teams worldwide
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The numbers speak for themselves. Here&apos;s what happens when
            teams switch to a better way of working.
          </p>
        </div>

        {/* Stats grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {stat.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
