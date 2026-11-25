"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";
import { shareSocials } from "@prisma-docs/ui/data/footer";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Check, Link2 } from "lucide-react";

const defaultCopyText = "Copy article link";
const SHARE_BUTTON =
  "quiet-hover inline-flex size-9 items-center justify-center rounded-full text-[17px] no-underline outline-none focus-visible:bg-fd-foreground/[0.06]";

/**
 * The share links as a quiet vertical list for the post's right column, in
 * the docs' rail style (apps/docs/src/components/page-actions.tsx,
 * PageActionsList; client, 2026-11-25: "same as we have in docs", with the
 * share buttons and the theme switch there): 14px muted rows with a small
 * icon, full ink on hover.
 */
export const RAIL_ROW =
  "inline-flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-md text-sm text-fd-muted-foreground no-underline transition-colors duration-[120ms] ease-out outline-none hover:text-fd-foreground hover:duration-0 focus-visible:bg-fd-foreground/[0.06] motion-reduce:transition-none [&_svg]:size-3.5 [&_svg]:shrink-0";

// One 16px box per icon, so the brand glyphs (wider than lucide's) and the
// link icon start every label on the same line.
const ICON_BOX = "inline-flex size-4 shrink-0 items-center justify-center";

export const BlogShareList = ({ desc }: { desc: string }) => {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const pageUrl = `https://www.prisma.io/blog${pathname}`;

  return (
    <div className="flex flex-col">
      {shareSocials.map((socialLink: any) =>
        socialLink.url ? (
          <a
            key={socialLink.label}
            href={socialLink.url({ current_page: pageUrl, text_data: desc })}
            target="_blank"
            rel="noopener"
            className={RAIL_ROW}
          >
            <span aria-hidden className={ICON_BOX}>
              <i className={cn(socialLink.icon, "text-[14px]")} />
            </span>
            Share on {socialLink.label}
          </a>
        ) : socialLink.copy ? (
          <button
            key={socialLink.label}
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(pageUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className={RAIL_ROW}
          >
            <span aria-hidden className={ICON_BOX}>
              {copied ? <Check /> : <Link2 />}
            </span>
            {copied ? "Link copied" : "Copy link"}
          </button>
        ) : null,
      )}
    </div>
  );
};

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
                    <i aria-hidden className={socialLink.icon} />
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
