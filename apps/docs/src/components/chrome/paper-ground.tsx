import Image from "next/image";

// The shell's brand ground, rendered once inside the notebook grid: CF's
// grain texture as a fixed wash over the paper (light mode only — the grain
// multiplies to nothing on ink). Decorative, sitting under the grid's
// painted surfaces; only the paper margins let it show.
export function PaperGround() {
  // The layer sits at negative z inside the grid's isolated stacking context
  // (see `#nd-notebook-layout { isolation: isolate }`): above the paper fill,
  // below every in-flow surface.
  // The standalone optimizer resolves local sources through this app's
  // basePath; Vercel resolves the original path in its image service.
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 dark:hidden">
      <Image
        src={
          process.env.COMPOSER_BUILD === "1"
            ? "/docs/img/brand/texture.jpg"
            : "/img/brand/texture.jpg"
        }
        alt=""
        fill
        sizes="100vw"
        priority={false}
        className="object-cover"
        style={{ opacity: 0.05, mixBlendMode: "multiply" }}
      />
    </div>
  );
}
