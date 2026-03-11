"use client";
import {
  Action,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";
import { shareSocials } from "@prisma-docs/ui/data/footer";
import { usePathname } from "next/navigation";
import { useState } from "react";

const defaultCopyText = "Copy article link";

export const BlogShare = ({ desc }: { desc: string }) => {
  const [tooltip, setTooltip] = useState<string>(defaultCopyText);
  const pathname = usePathname();

  return (
    <div className="w-fit mx-auto">
      <h5 className="text-center mb-4 font-semibold text-background-default-reverse">
        Share this article
      </h5>
      <div className="flex justify-start gap-2 md:max-w-[190px]">
        {shareSocials.map((socialLink: any) =>
          socialLink.url ? (
            <TooltipProvider key={socialLink.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={socialLink.url({
                      current_page: `https://prisma.io/blog${pathname}`,
                      text_data: desc,
                    })}
                    target="_blank"
                    rel="noopener"
                    aria-label={socialLink.title}
                    className={cn(
                      "text-[1.375rem] transition-colors hover:[&>div]:bg-background-ppg-strong",
                    )}
                  >
                    <Action color="neutral" size="2xl">
                      <i
                        className={`fa-brands fa-${socialLink.icon} text-current text-foreground-neutral-weak transition-colors`}
                      />
                    </Action>
                  </a>
                </TooltipTrigger>
                <TooltipContent>{socialLink.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : socialLink.copy ? (
            <TooltipProvider key={socialLink.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Action
                    color="neutral"
                    size="2xl"
                    onClick={() => {
                      setTooltip("Link copied!");
                      setTimeout(() => {
                        setTooltip(defaultCopyText);
                      }, 500);
                      navigator.clipboard.writeText(
                        `https://prisma.io/blog${pathname}`,
                      );
                    }}
                    className="text-[1.375rem] transition-colors hover:bg-background-ppg-strong cursor-pointer"
                  >
                    <i
                      className={`${socialLink.icon} text-current text-foreground-neutral-weak transition-colors`}
                    />
                  </Action>
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
