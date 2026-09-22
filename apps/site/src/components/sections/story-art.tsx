import { Texture } from "@/components/brand/texture";
import type { CustomerStory } from "@/data/customers";
import { cn } from "@/lib/utils";

// The standard card art for a customer story: a black plate with the brand's
// prismatic light leaking in at the edges, and the Prisma wordmark locked up
// with the customer's mark in white across the middle.
//
// It replaces the pre-baked "<Customer> | Prisma" PNGs prisma.io ships in
// /photos/showcase/stories. Those are flat 1266x711 images: one per customer,
// no way to restyle them, and unusable on a light surface. This renders the
// same lockup from the customer's own logo file, so adding a story is a data
// entry rather than a trip to a design tool, and it stays crisp at any size.
//
// The light is at the EDGES rather than pooled at the bottom (the light-panel
// idiom): the centre has to stay dark enough for white marks to hold contrast,
// so the spectrum enters from outside the frame and falls off inward. Beam
// angles and the cyan/yellow/red order match hero-home.tsx.
export function StoryArt({
  story,
  className,
  size = "card",
}: {
  story: CustomerStory;
  className?: string;
  /** `card` is the grid plate; `lead` scales the lockup up for the wide card. */
  size?: "card" | "lead";
}) {
  const lead = size === "lead";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-[#08090b]",
        className,
      )}
    >
      {/* Two prismatic blurs on the diagonal — cyan into the top-left corner,
          red out of the bottom-right (André, 2026-08-17).
          Both sources sit just OUTSIDE their corner and are drawn large, so
          what lands in frame is the broad body of the glow sweeping across the
          corner rather than a discrete blob. Anchored inside the frame and
          smaller, they read as two spots with dead black stranded between them.
          `screen` is what keeps it reading as light: painted normally, these
          gradients composite toward their own muddy midtones over black (the
          cyan goes swampy teal, the red goes maroon). Screening against black
          is additive, so the hues stay true and the untouched middle stays at
          true #08090b — no vignette needed to protect the marks, which is what
          the first pass used and what was dulling the colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: [
            "radial-gradient(58% 82% at -2% -6%, color-mix(in srgb, var(--color-prism-cyan-400) 95%, transparent), transparent 72%)",
            "radial-gradient(58% 82% at 102% 106%, color-mix(in srgb, var(--color-prism-red-500) 90%, transparent), transparent 72%)",
          ].join(","),
        }}
      />

      {/* Grain, doubled from the 0.04 first pass (André asked for it to read
          more). Still well under the value that works on white: Texture is
          calibrated at 0.06 multiply there, and hard-light on black amplifies
          it — 0.14 tips from print grain into a scratched, dirty surface. */}
      <Texture opacity={0.08} blend="hard-light" />

      <div
        className={cn(
          "relative flex items-center justify-center",
          lead ? "gap-6 px-10 sm:gap-8" : "gap-5 px-7 sm:gap-6",
        )}
      >
        {/* full-color-white is the dark-surface sibling of the full-color mark
            the header uses: brand-coloured icon, white wordmark. The all-white
            white.svg flattened the icon into the customer's mark beside it —
            two white shapes either side of the divider with nothing to say
            which one is the host. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/full-color-white.svg"
          alt="Prisma"
          className={cn("w-auto object-contain", lead ? "h-8" : "h-7")}
          loading="lazy"
          draggable={false}
        />
        <span aria-hidden className={cn("w-px shrink-0 bg-white/25", lead ? "h-10" : "h-9")} />
        <CustomerMark story={story} lead={lead} />
      </div>
    </div>
  );
}

// Height caps per optical weight, for both plate sizes. `md` is the baseline;
// `sm` reins in heavy blocked wordmarks that read oversized at the common
// height, `lg` lifts marks drawn light or small.
const MARK_SIZE = {
  sm: { card: "max-h-6 max-w-[9rem]", lead: "max-h-7 max-w-[11rem]" },
  md: { card: "max-h-8 max-w-[11rem]", lead: "max-h-9 max-w-[13rem]" },
  lg: { card: "max-h-10 max-w-[12rem]", lead: "max-h-11 max-w-[14rem]" },
} as const;

function CustomerMark({ story, lead }: { story: CustomerStory; lead: boolean }) {
  if (!story.logo) {
    return (
      <span
        className={cn(
          "select-none font-semibold tracking-tight text-white",
          lead ? "text-2xl" : "text-xl",
        )}
      >
        {story.name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={story.logo}
      alt={story.name}
      className={cn(
        "w-auto object-contain",
        MARK_SIZE[story.markFit ?? "md"][lead ? "lead" : "card"],
        // Most customer marks are dark ink on transparent, so flattening them
        // to pure white is what puts them on a black plate. The exceptions are
        // knockout logos — white type inside a solid colour — where the same
        // filter whitens the container too and leaves a featureless slab; those
        // are flagged `asis` in the data and keep their brand colour, which
        // reads fine against black. See the `onDark` field.
        story.onDark !== "asis" && "brightness-0 invert",
      )}
      loading="lazy"
      draggable={false}
    />
  );
}
