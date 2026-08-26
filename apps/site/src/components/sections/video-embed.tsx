import { PlayCircle } from "lucide-react";

export function VideoEmbed() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            See it in action
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Watch a 3-minute walkthrough of how you can go from zero to a fully deployed app with
            authentication, billing, and a polished dashboard.
          </p>
        </div>

        {/* Video placeholder */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-xl">
            <div className="relative flex aspect-video items-center justify-center bg-muted">
              <div className="flex flex-col items-center gap-3">
                <PlayCircle className="size-16 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">Click to play video</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            3 min &middot; From first clone to live deploy in under 10 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
