"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { Check } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// Copy-link control beside each agreement heading, so readers can cite a
// clause by URL. It is a real anchor, so without JS (or with a modifier-key
// click) it still opens or jumps to the section.
export function LegalSectionLink({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // Must run before the await: the default jump happens synchronously.
    event.preventDefault();
    window.history.replaceState(null, "", `#${slug}`);
    try {
      const url = `${window.location.origin}${window.location.pathname}#${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context); the address bar
      // already holds the section URL, so the reader can copy it from there.
    }
  }

  return (
    <a
      href={`#${slug}`}
      onClick={copy}
      aria-label={`Copy link to ${title}`}
      title={copied ? "Link copied" : "Copy link to section"}
      className={cn(
        "ml-2 inline-flex size-7 items-center justify-center rounded-md align-middle text-muted-foreground transition-opacity hover:bg-black/[0.04] hover:text-foreground focus-visible:opacity-100",
        copied ? "opacity-100" : "md:opacity-0 md:group-hover:opacity-100",
      )}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </a>
  );
}
