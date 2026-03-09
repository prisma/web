"use client";

import { useEffect, useState } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";

type StatusIndicator = "none" | "minor" | "major" | "critical";

interface StatusResponse {
  status: {
    indicator: StatusIndicator;
    description: string;
  };
}

const dotColors: Record<StatusIndicator, string> = {
  none: "bg-green-500",
  minor: "bg-yellow-500",
  major: "bg-orange-500",
  critical: "bg-red-500",
};

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function StatusIndicator() {
  const [status, setStatus] = useState<StatusResponse["status"] | null>(null);

  useEffect(() => {
    const fetchStatus = () => {
      fetch("https://www.prisma-status.com/api/v2/status.json")
        .then((res) => res.json())
        .then((data: StatusResponse) => setStatus(data.status))
        .catch(() => setStatus(null));
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  const isOperational = status.indicator === "none";

  return (
    <a
      href="https://www.prisma-status.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden lg:flex items-center gap-2 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {!isOperational && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotColors[status.indicator],
            )}
          />
        )}
        <span
          className={cn("relative inline-flex h-2 w-2 rounded-full", dotColors[status.indicator])}
        />
      </span>
      {status.description}
    </a>
  );
}
