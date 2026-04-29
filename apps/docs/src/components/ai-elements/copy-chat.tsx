"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@prisma-docs/ui/components/tooltip";
import type { ChatMessage } from "@/hooks/use-chat-persistence";

export type CopyChatProps = {
  messages: ChatMessage[];
};

export const CopyChat = ({ messages }: CopyChatProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyChat = async () => {
    const markdown = messages
      .map((message) => {
        const role = message.role === "user" ? "You" : "AI";
        return `**${role}:**\n${message.content}`;
      })
      .join("\n\n---\n\n");

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy chat:", error);
    }
  };

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => (
          <button
            {...props}
            disabled={messages.length === 0}
            onClick={handleCopyChat}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "disabled:opacity-50",
            )}
          >
            <Icon className="size-3.5" />
          </button>
        )}
      />
      <TooltipContent>{copied ? "Copied!" : "Copy chat"}</TooltipContent>
    </Tooltip>
  );
};
