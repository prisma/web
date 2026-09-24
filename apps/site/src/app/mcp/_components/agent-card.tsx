"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Bot, Copy } from "@/components/icons/forma";
import type { McpAgent } from "./mcp-agents-section";

// One agent tile: white card, hairline border, monochrome logo, visible
// label. Tiles either deep-link an install flow or copy a config snippet;
// the label doubles as the copy feedback.
export function AgentCard({ name, logo, alt, href, copyText }: McpAgent) {
  const [copied, setCopied] = useState(false);

  const isCopyAction = !!copyText;
  const isExternalLink = !isCopyAction && href?.startsWith("http");

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
    <Tag
      aria-label={alt}
      className="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)]"
      {...linkProps}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={40}
          height={40}
          className="size-10 object-contain brightness-0 opacity-50 transition-opacity duration-300 group-hover:opacity-75"
          unoptimized
        />
      ) : (
        <Bot
          className="size-10 text-foreground/50 transition-colors duration-300 group-hover:text-foreground/75"
          aria-hidden
        />
      )}
      <span className="text-xs font-semibold text-muted-foreground">
        {copied ? "Copied!" : name}
      </span>
      <span
        className="absolute right-3 top-3 text-black/20 transition-colors duration-300 group-hover:text-black/50"
        aria-hidden
      >
        {isCopyAction ? <Copy className="size-3.5" /> : <ArrowRight className="size-3.5" />}
      </span>
    </Tag>
  );
}
