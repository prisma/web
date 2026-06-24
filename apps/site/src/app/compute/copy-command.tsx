"use client";

import { useState } from "react";
import { Button } from "@prisma/eclipse";
import { cn } from "@/lib/cn";

// Copy-to-clipboard button for the starter app commands. Lives in its own
// client module so the (server-rendered) TemplateCards stay on the server.
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Button
      type="button"
      variant="default-strong"
      size="lg"
      onClick={copy}
      aria-label={copied ? "Command copied" : `Copy command: ${command}`}
      className="px-3 font-normal shrink-0"
    >
      <i
        className={cn(
          "fa-regular text-xs",
          copied ? "fa-check text-foreground-ppg-strong" : "fa-copy",
        )}
        aria-hidden="true"
      />
      <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
