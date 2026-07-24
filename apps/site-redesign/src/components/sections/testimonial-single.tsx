import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialSingle() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Decorative quote mark */}
          <span className="text-6xl font-serif leading-none text-muted-foreground/30 sm:text-8xl">
            &ldquo;
          </span>

          <blockquote className="-mt-4 text-xl font-medium leading-relaxed text-foreground sm:text-2xl lg:text-3xl">
            We switched our entire stack over in a weekend. Within a month, our
            engineering velocity doubled and our customers started noticing how
            much faster we were shipping new features.
          </blockquote>

          <div className="mt-10 flex flex-col items-center gap-4">
            <Avatar size="lg" className="size-14">
              <AvatarImage alt="Alex Rivera" />
              <AvatarFallback className="text-lg">AR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-medium text-foreground">
                Alex Rivera
              </p>
              <p className="text-sm text-muted-foreground">
                VP of Engineering, CloudBase
              </p>
            </div>

            {/* Company logo placeholder */}
            <div className="mt-4 flex h-8 items-center">
              <div className="rounded border border-border bg-muted px-4 py-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                CloudBase
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
