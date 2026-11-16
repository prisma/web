"use client";
import { useEffect, useState } from "react";
import { UnifiedSearchDialog } from "@prisma-docs/ui/components/unified-search";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";
import posthog from "posthog-js";
import { useAIChatContext } from "@/hooks/use-ai-chat";

function trackSearch(query: string) {
  posthog.capture("docs:search", { query });
}
export default function CustomSearchDialog(props: SharedProps) {
  const { setPrompt, setIsOpen } = useAIChatContext();
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    setIsMac(navigator.platform?.toUpperCase().includes("MAC") ?? true);
  }, []);
  // Search is also the way into Ask AI: the typed query is queued as the
  // chat's pending prompt (submitted once the chat has mounted) and the chat
  // opens. ⌘I / Ctrl+I (ai-chat-sidebar.tsx) opens it from any page.
  const askAI = {
    shortcut: isMac ? "⌘I" : "Ctrl+I",
    onAsk: (query: string) => {
      posthog.capture("docs:search_ask_ai", { query });
      setPrompt(query);
      setIsOpen(true);
    },
  };
  return (
    <UnifiedSearchDialog
      {...props}
      api="/docs/api/search"
      onStableQuery={trackSearch}
      placeholder="Search or ask AI…"
      askAI={askAI}
    />
  );
}
