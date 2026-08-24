import Link from "next/link";
import { isCrossZoneHref } from "@/lib/zones";

// Drop-in for next/link in nav/footer maps whose hrefs may point at another
// zone (/docs, /blog): those render as a plain <a> so the browser
// hard-navigates; everything else keeps client-side routing.
export function SiteLink({ href, ...props }: React.ComponentProps<"a"> & { href: string }) {
  if (isCrossZoneHref(href)) {
    return <a href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}
