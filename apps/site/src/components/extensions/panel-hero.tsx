import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";

/**
 * The wrapped-panel hero shared by the extension pages: paper surface,
 * hairline border, one cyan wash along the bottom edge. Kept short so the
 * list is on screen without scrolling on a laptop.
 */
export function PanelHero({
  kicker,
  title,
  lead,
  breadcrumb,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  breadcrumb?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.12] bg-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[12rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(52% 60% at 50% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 22%, transparent), transparent 70%)",
            }}
          />
        </div>
        <Texture opacity={0.06} blend="multiply" />
        <div className="relative px-4 sm:px-8">
          <div className="mx-auto flex max-w-site flex-col items-start pb-10 pt-16 md:pt-20">
            {breadcrumb ? <div className="mb-5">{breadcrumb}</div> : null}
            <RoleKicker color="bg-prism-cyan-400">{kicker}</RoleKicker>
            <h1 className="isolate mt-3 max-w-[24ch] text-balance text-[clamp(2.25rem,3.5vw,3rem)] leading-[1.06] text-primary">
              {title}
            </h1>
            <p className="mt-4 max-w-[62ch] text-pretty text-lg leading-relaxed text-foreground">
              {lead}
            </p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
