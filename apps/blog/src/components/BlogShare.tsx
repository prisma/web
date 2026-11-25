"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";
import { shareSocials } from "@prisma-docs/ui/data/footer";
import { usePathname } from "next/navigation";
import { useState } from "react";

const defaultCopyText = "Copy article link";
const SHARE_BUTTON =
  "quiet-hover inline-flex size-9 items-center justify-center rounded-full text-[17px] no-underline outline-none focus-visible:ring-2 focus-visible:ring-foreground-neutral/40";

export const BlogShare = ({ desc }: { desc: string }) => {
  const [tooltip, setTooltip] = useState<string>(defaultCopyText);
  const pathname = usePathname();

  return (
    // One quiet row right under the article, on its left edge (client,
    // 2026-11-25: the post ending "should be light, simple, and elegant"):
    // a small label and plain icons with the docs' quiet hover, instead of a
    // centred uppercase heading over boxed icons after the CTA.
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground-neutral-weak">Share</span>
      <div className="flex items-center gap-1">
        {shareSocials.map((socialLink: any) =>
          socialLink.url ? (
            <TooltipProvider key={socialLink.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={socialLink.url({
                      current_page: `https://www.prisma.io/blog${pathname}`,
                      text_data: desc,
                    })}
                    target="_blank"
                    rel="noopener"
                    // `shareSocials` entries carry `label`, not `title`, so this
                    // used to render `aria-label={undefined}`: an icon-only,
                    // unnamed link on every post.
                    aria-label={socialLink.title ?? `Share on ${socialLink.label}`}
                    // Muted at rest, full ink on hover — the share row is a
                    // quiet utility, not an accent.
                    className={cn(SHARE_BUTTON)}
                  >
                    <i aria-hidden className={`fa-brands fa-${socialLink.icon}`} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>{socialLink.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : socialLink.copy ? (
            <TooltipProvider key={socialLink.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* A real button: as a <div> with an onClick this control had
                      no role, no place in the tab order and no accessible name,
                      and Enter/Space did nothing. */}
                  <button
                      type="button"
                      aria-label={defaultCopyText}
                      onClick={() => {
                        setTooltip("Link copied!");
                        setTimeout(() => {
                          setTooltip(defaultCopyText);
                        }, 500);
                        navigator.clipboard.writeText(`https://www.prisma.io/blog${pathname}`);
                      }}
                      className={cn(SHARE_BUTTON, "cursor-pointer")}
                  >
                    <i aria-hidden className={socialLink.icon} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null,
        )}
      </div>
    </div>
  );
};
