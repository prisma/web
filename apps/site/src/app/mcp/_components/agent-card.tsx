"use client";

import Image from "next/image";
import { useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@prisma/eclipse";

export function AgentCard({
  logo,
  alt,
  href,
  copyText,
}: {
  logo: string | null;
  alt: string;
  href?: string;
  copyText?: string;
}) {
  const [copied, setCopied] = useState(false);

  const isCopyAction = !!copyText;
  const isExternalLink = !isCopyAction && href?.startsWith("http");
  const icon = href ? "fa-regular fa-arrow-up-right" : copyText ? "fa-regular fa-copy" : null;

  const handleClick = (e: React.MouseEvent) => {
    if (!isCopyAction) return;
    e.preventDefault();
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Tag = isCopyAction ? "button" : "a";
  const linkProps = isCopyAction
    ? { type: "button" as const, onClick: handleClick }
    : {
        href,
        ...(isExternalLink ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      };

  return (
    <Tooltip open={copied || undefined}>
      <TooltipTrigger asChild>
        <Tag
          aria-label={alt}
          className="group relative flex h-30 w-full max-w-[165px] cursor-pointer items-center justify-center rounded-[12px] border border-stroke-neutral bg-background-neutral-weaker shadow-box-low no-underline outline-offset-4 transition-[border-color,background-color,box-shadow] hover:border-stroke-ppg/60 hover:bg-background-default hover:shadow-box-high focus-visible:ring-2 focus-visible:ring-stroke-ppg dark:bg-background-neutral-weaker dark:hover:bg-background-neutral"
          {...linkProps}
        >
          {logo ? (
            <Image
              src={logo}
              alt=""
              width={48}
              height={48}
              className="size-12 object-contain brightness-0 opacity-45 transition-opacity group-hover:opacity-65 dark:opacity-55 dark:invert dark:group-hover:opacity-80"
              unoptimized
            />
          ) : (
            <span className="font-mono text-lg text-foreground-neutral-weak">Any AI agent</span>
          )}
          {icon ? (
            <span
              className="absolute right-1.75 top-1.75 text-foreground-neutral-weaker opacity-50 transition-opacity group-hover:opacity-100"
              aria-hidden
            >
              <i className={`${icon} text-[16px]`} />
            </span>
          ) : null}
        </Tag>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : alt}</TooltipContent>
    </Tooltip>
  );
}
