// Ported from apps/site-redesign/src/components/brand/animated-wordmark.tsx.
// Same two halves of the designer's PrismaFooter.svg (identical 725x158
// viewBox): the solid-black letters, and the colour layer (prism stripes struck
// through the letters + the trailing rays). Splitting them lets the black word
// stay put while only the colour animates in.
//
// The original drives the sweep with framer-motion. The blog has no
// framer-motion dependency and the spec forbids adding one, so the identical
// keyframe track is expressed in CSS and shipped with the component via React
// 19's hoisted <style> (deduped by `href`, so N copies still emit one rule).
// That also buys the reduced-motion guard for free — a media query instead of
// a hook — and keeps the whole thing renderable on the server.
import { withBlogBasePath } from "@/lib/url";

const BLACK = "/logo/prisma-footer-black.svg";
const COLOR = "/logo/prisma-footer-color.svg";

// Reveal timing (seconds): sweep in from the right, hold, retreat, pause.
// IN 1.0 + HOLD 4.5 + OUT 1.0 + GAP 1.2 = 7.7s cycle, so the keyframe stops
// land at 1.0/7.7, 5.5/7.7 and 6.5/7.7. Per-segment easing matches the
// framer-motion `ease` array: [0.22,1,0.36,1] in, linear hold, [0.5,0,0.9,1]
// out.
const CSS = `
@keyframes blog-wordmark-sweep {
  0%      { clip-path: inset(0 0 0 100%); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
  12.987% { clip-path: inset(0 0 0 0%);   animation-timing-function: linear; }
  71.429% { clip-path: inset(0 0 0 0%);   animation-timing-function: cubic-bezier(0.5, 0, 0.9, 1); }
  84.416% { clip-path: inset(0 0 0 100%); animation-timing-function: linear; }
  100%    { clip-path: inset(0 0 0 100%); }
}
.blog-wordmark-color {
  clip-path: inset(0 0 0 100%);
  animation: blog-wordmark-sweep 7.7s infinite;
}
@media (prefers-reduced-motion: reduce) {
  .blog-wordmark-color { animation: none; clip-path: inset(0 0 0 0%); }
}
`;

// Footer wordmark: solid-black "Prisma" always visible; the prism stripes and
// trailing rays are revealed on top by a clipPath that sweeps in from the right
// (rays first, then the colour fills the letters leftward), holds, and retreats
// — looping. Respects prefers-reduced-motion (colour shown in full).
//
// The black layer is literal `fill="black"`, so dark mode inverts it to white
// rather than shipping a third asset; the colour layer is left alone so the
// prism hues stay true in both themes.
export function AnimatedWordmark() {
  return (
    <div className="relative w-full select-none" aria-hidden>
      <style href="blog-animated-wordmark" precedence="medium">
        {CSS}
      </style>

      {/* black letters — always visible */}
      <img
        src={withBlogBasePath(BLACK)}
        alt=""
        width={725}
        height={158}
        className="block w-full dark:invert"
        draggable={false}
      />

      {/* colour (stripes + rays), clipped in from the right, looping */}
      <img
        src={withBlogBasePath(COLOR)}
        alt=""
        width={725}
        height={158}
        className="blog-wordmark-color absolute inset-0 block w-full"
        draggable={false}
      />
    </div>
  );
}
