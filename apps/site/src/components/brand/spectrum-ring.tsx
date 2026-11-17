import { cn } from "@/lib/utils";

// The always-lit spectrum ring (`spectrum-border-on`) done without a per-frame
// repaint. The hover ring slides its gradient with `background-position`,
// which the compositor can't animate, so the always-on variant re-rasterised
// the whole card every frame for as long as the page was open — ~0.4 cores
// idle on the pricing comparison card alone. Here a real element is masked to
// the 1px ring and a 400%-wide gradient child slides under it with a
// transform, so the loop runs on the compositor. Styles in globals.css.
//
// Drop it inside any `relative` element with a border-radius; it inherits the
// radius. Place it last among the children so it paints over any decorative
// `absolute` layers (pattern, glows) rather than under them.
export function SpectrumRing({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("spectrum-ring", className)}>
      <span />
    </span>
  );
}
