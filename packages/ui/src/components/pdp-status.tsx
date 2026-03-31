"use client";
import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

const indicatorStatus: Record<string, string> = {
  "-": "[&>div]:bg-gray-500 text-foreground-neutral-weak",
  none: "[&>div]:bg-background-success-reverse-strong text-background-success-reverse-strong",
  major:
    "[&>div]:bg-background-success-reverse-strong text-background-success-reverse-strong",
  minor:
    "[&>div]:bg-background-warning-reverse-strong text-background-warning-reverse-strong",
  critical:
    "[&>div]:bg-background-error-reverse-strong text-background-error-reverse-strong",
};

const PDPStatus = ({ className }: { className?: string }) => {
  const [pdpStatus, setPdpStatus] = useState({
    status: { indicator: "-", description: "Not Known" },
  });

  useEffect(() => {
    fetch("https://www.prisma-status.com/api/v2/status.json")
      .then((response) => response.json())
      .then((json) => {
        setPdpStatus(json);
      })
      .catch((error) =>
        console.log("PDP Status fetch failed " + error.message),
      );
  }, []);

  const indicator = pdpStatus.status.indicator || "-";
  const indicatorClass = indicatorStatus[indicator] || "bg-gray-500";

  return (
    <a
      className={cn(
        "flex items-start justify-center no-underline text-sm font-inter",
        indicatorClass,
        className,
      )}
      href="https://www.prisma-status.com/"
    >
      <div className="w-3 h-3 rounded-full mr-1 mt-1" />
      <span>
        <b className="text-foreground-neutral-weak mb-1">Platform Status:</b>
        <p className="underline font-family-mono my-0 text-xs">
          {pdpStatus.status.description}
        </p>
      </span>
    </a>
  );
};

export default PDPStatus;
