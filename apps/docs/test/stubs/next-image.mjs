// `next/image` needs Next's build/runtime context; in a node test it stands in as
// the plain <img> it renders to, which is all these accessibility assertions need.
import { createElement } from "react";

export default function Image({ src, alt, ...props }) {
  const resolved = typeof src === "string" ? src : (src?.src ?? "");
  return createElement("img", { src: resolved, alt, ...props });
}
