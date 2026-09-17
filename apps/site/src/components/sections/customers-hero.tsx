import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";

// Customers hero — wrapped-panel title band (same shell as product-hero, with
// the spectral wash dialed down: this page's color comes from the story grid,
// so the hero stays a quiet paper surface).
export function CustomersHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[16rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(46% 60% at 32% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 20%, transparent), transparent 70%)",
                "radial-gradient(40% 52% at 55% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 16%, transparent), transparent 68%)",
                "radial-gradient(38% 46% at 76% 100%, color-mix(in srgb, var(--color-prism-red-400) 17%, transparent), transparent 70%)",
              ].join(","),
            }}
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          <div className="mx-auto flex max-w-site flex-col items-center pb-16 pt-32 text-center md:pb-20 md:pt-44">
            <RoleKicker color="bg-prism-yellow-300" className="justify-center">
              Customer stories
            </RoleKicker>
            <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
              Teams ship faster on Prisma
            </h1>
            <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              How engineering teams use Prisma in production to speed up delivery, simplify database
              workflows, and scale without slowing down.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
