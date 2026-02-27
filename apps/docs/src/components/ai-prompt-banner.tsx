"use client";

import { Check, Copy } from "lucide-react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { buttonVariants } from "@prisma-docs/ui/components/button";
import { cn } from "@prisma-docs/ui/lib/cn";

export function AIPromptBanner({
  fullPrompt,
  guideName,
}: {
  fullPrompt: string;
  guideName: string;
}) {
  const [checked, onClick] = useCopyButton(async () => {
    await navigator.clipboard.writeText(fullPrompt);
  });

  return (
    <div className="not-prose flex flex-col gap-4 rounded-xl border border-fd-border bg-fd-secondary/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-fd-foreground">
          Set up {guideName} with an AI prompt
        </p>
        <p className="text-sm text-fd-muted-foreground">
          Use this pre-built prompt to get started faster with your AI assistant.
        </p>
      </div>
      <button
        className={cn(
          buttonVariants({
            color: "primary",
            size: "sm",
            className: "gap-2 shrink-0",
          }),
        )}
        onClick={onClick}
      >
        {checked ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {checked ? "Copied!" : "Copy prompt"}
      </button>
    </div>
  );
}
