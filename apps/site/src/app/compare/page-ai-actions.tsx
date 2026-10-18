"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { COPIED_VISIBLE_MS } from "./copied";

const cache = new Map<string, string>();

const ACTION =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/70 disabled:opacity-60";

function promptFor(markdownUrl: string) {
  return `Read ${markdownUrl}, I want to ask questions about it.`;
}

function toolLinks(markdownUrl: string) {
  const q = promptFor(markdownUrl);
  return [
    {
      name: "ChatGPT",
      href: `https://chatgpt.com/?${new URLSearchParams({ hints: "search", q })}`,
    },
    {
      name: "Claude",
      href: `https://claude.ai/new?${new URLSearchParams({ q })}`,
    },
    {
      name: "Gemini",
      href: `https://gemini.google.com/app?${new URLSearchParams({ q })}`,
    },
    {
      name: "Perplexity",
      href: `https://www.perplexity.ai/search/new?${new URLSearchParams({ q })}`,
    },
    {
      name: "Grok",
      href: `https://grok.com/?${new URLSearchParams({ q })}`,
    },
  ];
}

/** Compact Copy page + Open-in control. Matches the docs pattern, with the five public AIs. */
export function PageAiActions({ markdownPath }: { markdownPath: string }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setOrigin(window.location.origin);
    return () => clearTimeout(timer.current);
  }, []);

  const tools = useMemo(() => {
    const markdownUrl = origin ? new URL(markdownPath, origin).toString() : markdownPath;
    return toolLinks(markdownUrl);
  }, [markdownPath, origin]);

  async function copyPage() {
    setLoading(true);
    try {
      let text = cache.get(markdownPath);
      if (!text) {
        const response = await fetch(markdownPath);
        if (!response.ok) return;
        text = await response.text();
        cache.set(markdownPath, text);
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_VISIBLE_MS);
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button type="button" onClick={copyPage} disabled={loading} className={ACTION}>
        {copied ? (
          <Check className="size-3.5" strokeWidth={2} aria-hidden />
        ) : (
          <Copy className="size-3.5" strokeWidth={2} aria-hidden />
        )}
        {copied ? "Copied" : "Copy page"}
        <span role="status" className="sr-only">
          {copied ? "Page copied" : ""}
        </span>
      </button>
      <Popover>
        <PopoverTrigger className={ACTION}>
          Open
          <ChevronDown className="size-3.5" aria-hidden />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-52 p-1">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.href}
              rel="noreferrer noopener"
              target="_blank"
              className="flex items-center rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              Open in {tool.name}
            </a>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
