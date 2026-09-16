// `next/link` renders a plain <a href> on the server; without a router context it
// cannot run in a node test, so stand in with that anchor.
import { createElement } from "react";

export default function Link({ href, children, ...props }) {
  const resolved = typeof href === "string" ? href : (href?.pathname ?? "");
  return createElement("a", { href: resolved, ...props }, children);
}
