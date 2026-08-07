import Image from "next/image";
import { PrismRay } from "./prism-ray";

// The shell's brand ground, rendered once inside the notebook grid: CF's
// grain texture as a fixed wash over the paper (light mode only — the grain
// multiplies to nothing on ink), and the prism ray crossing the frame behind
// the reading sheet, the way light crosses behind the console panel on the
// site-redesign home. Both layers are decorative and sit under the grid's
// painted surfaces; only the paper margins let them show.
export function PaperGround() {
  // Both layers sit at negative z inside the grid's isolated stacking context
  // (see `#nd-notebook-layout { isolation: isolate }`): above the paper fill,
  // below every in-flow surface — so the sheet, header, and sidebar pills
  // occlude them and the light only shows in the paper margins, exactly the
  // way the hero ray disappears behind the console card on the reference.
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 dark:hidden">
        <Image
          src="/img/brand/texture.jpg"
          alt=""
          fill
          sizes="100vw"
          priority={false}
          className="object-cover"
          style={{ opacity: 0.05, mixBlendMode: "multiply" }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] overflow-hidden dark:opacity-60"
      >
        <PrismRay
          intensity="whisper"
          className="left-1/2 top-40 h-16 w-[150rem] -translate-x-1/2"
        />
      </div>
    </>
  );
}
