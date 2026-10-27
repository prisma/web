import React from "react";
import { preload } from "react-dom";
import avif from "../assets/brand/texture.avif";
import jpeg from "../assets/brand/texture.jpg";

/** Native format selection with Next's hashed, zone-aware static URLs.
 * No runtime image conversion. Keep both URLs explicit: Turbopack's CSS
 * image-set rewriting does not preserve them through the current minifier.
 */
export function BrandGrain({ eager = false }: { eager?: boolean }) {
  if (eager) preload(avif.src, { as: "image", type: "image/avif", fetchPriority: "high" });
  return (
    <picture>
      <source type="image/avif" srcSet={avif.src} />
      <img
        src={jpeg.src}
        alt=""
        width={jpeg.width}
        height={jpeg.height}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className="absolute inset-0 size-full object-cover"
      />
    </picture>
  );
}
