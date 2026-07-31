import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function FounderLetter() {
  return (
    <section className="bg-muted/50 px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-site">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
          {/* Left: founder info */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Avatar className="size-28">
              <AvatarFallback className="text-2xl">AC</AvatarFallback>
            </Avatar>

            <p className="mt-4 text-lg font-semibold text-foreground">
              Alex Chen
            </p>
            <p className="text-sm text-muted-foreground">CEO & Co-founder</p>
          </div>

          {/* Right: letter */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Why we built this
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I spent the first three years of my career rebuilding the same
                things over and over. Authentication, billing, dashboards, email
                flows. Every new project started with weeks of boilerplate before
                I could write a single line of code that actually mattered.
              </p>

              <p>
                The worst part? I knew I wasn&apos;t alone. Every founder I
                talked to had the same story. Brilliant ideas collecting dust
                because the overhead of starting from zero was just too high. We
                were all solving the same solved problems instead of building the
                things only we could build.
              </p>

              <p>
                So we built the starting line we wished we had. Not a framework
                that locks you in, but a foundation you can make your own. Every
                piece is something we&apos;ve shipped in production, battle-tested
                across real products with real users. We stripped away the
                complexity and kept what actually matters.
              </p>

              <blockquote className="my-6 border-l-2 border-primary pl-4 italic text-foreground">
                &ldquo;The best products aren&apos;t built by the people with the
                most time. They&apos;re built by the people who spend their time
                on the right things.&rdquo
              </blockquote>

              <p>
                If you&apos;re tired of rebuilding what&apos;s already been
                built, we made this for you. Let&apos;s get to work.
              </p>
            </div>

            <p className="mt-8 font-medium text-foreground">
              &mdash; Alex Chen
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
