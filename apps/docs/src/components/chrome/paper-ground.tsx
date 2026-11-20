import { BrandGrain } from "@prisma-docs/ui/components/brand-grain";
// Reuse the exact brand grain as a baked, content-hashed picture. It needs
// neither a cold image conversion nor a basePath-specific optimizer URL.
// It fills its nearest positioned parent: the sidebar panel, the one place
// the docs keep the brand's paper texture (light mode only).
export function PaperGround() {
  return (
    <div
      aria-hidden
      className="brand-grain-picture pointer-events-none absolute inset-0 -z-10 dark:hidden"
      style={{
        opacity: 0.03,
        mixBlendMode: "multiply",
      }}
    >
      {/* Lazy, not eager: hidden ancestors (dark mode, the sidebar below md)
          keep a lazy image from loading at all, so only light-mode desktop
          readers fetch the texture, and never ahead of the page itself. */}
      <BrandGrain />
    </div>
  );
}
