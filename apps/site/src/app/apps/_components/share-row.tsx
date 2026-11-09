"use client";

import { useState } from "react";
import { Bluesky, Check, Copy, Linkedin, XSocial } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// "Share this app": the three networks the template authors post on, plus a
// copy-link button for Slack and Discord, where pasting the URL is the share.
// The intent URLs carry the page's title so the post starts written.

export function ShareRow({ url, title }: { url: string; title: string }) {
  const text = `${title} ${url}`;
  const targets = [
    {
      label: "X",
      href: `https://x.com/intent/post?${new URLSearchParams({ text: title, url })}`,
      Icon: XSocial,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url })}`,
      Icon: Linkedin,
    },
    {
      label: "Bluesky",
      href: `https://bsky.app/intent/compose?${new URLSearchParams({ text })}`,
      Icon: Bluesky,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {targets.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className={SHARE_BUTTON}
        >
          <Icon className="size-4" aria-hidden />
          {label}
        </a>
      ))}
      <CopyLink url={url} />
    </div>
  );
}

const SHARE_BUTTON =
  "inline-flex items-center gap-2 rounded-md border border-black/[0.12] bg-white px-3 py-2 text-sm font-semibold leading-none text-foreground transition-colors hover:border-foreground/40 hover:text-prism-cyan-700";

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied; the address bar still has the link.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(SHARE_BUTTON, copied && "border-prism-cyan-400 text-prism-cyan-700")}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
