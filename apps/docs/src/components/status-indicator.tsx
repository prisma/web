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

interface Incident {
  impact: StatusIndicator;
}

interface IncidentsResponse {
  incidents: Incident[];
}

// Brand tokens, not raw Tailwind hues. The severity ramp walks the spectrum in
// its own order — cyan (the success mirror) -> yellow -> orange -> red — so the
// escalation reads monotonically, and identically, in both themes. Deliberately
// not the light/dark-flipping semantic triads: a status dot must not get
// *lighter* as the situation gets worse just because the theme changed.
const dotColors: Record<StatusIndicator, string> = {
  none: "bg-prism-cyan-500",
  minor: "bg-prism-yellow-300",
  major: "bg-spectrum-orange",
  critical: "bg-prism-red-500",
};

const SEVERITY: Record<StatusIndicator, number> = {
  none: 0,
  minor: 1,
  major: 2,
  critical: 3,
};

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function StatusIndicator() {
  const [status, setStatus] = useState<StatusResponse["status"] | null>(null);

  useEffect(() => {
    const fetchStatus = () => {
      Promise.allSettled([
        fetch("https://www.prisma-status.com/api/v2/status.json").then(
          (res) => res.json() as Promise<StatusResponse>,
        ),
        fetch("https://www.prisma-status.com/api/v2/incidents/unresolved.json").then(
          (res) => res.json() as Promise<IncidentsResponse>,
        ),
      ]).then(([statusResult, incidentsResult]) => {
        if (statusResult.status === "rejected") {
          setStatus(null);
          return;
        }

        const statusData = statusResult.value;
        const incidents =
          incidentsResult.status === "fulfilled" ? (incidentsResult.value.incidents ?? []) : [];
        const worstIncidentIndicator = incidents.reduce<StatusIndicator>(
          (worst, incident) =>
            SEVERITY[incident.impact] > SEVERITY[worst] ? incident.impact : worst,
          "none",
        );

        if (SEVERITY[worstIncidentIndicator] > SEVERITY[statusData.status.indicator]) {
          setStatus({
            indicator: worstIncidentIndicator,
            description: incidents.length === 1 ? "Active Incident" : "Active Incidents",
          });
        } else {
          setStatus(statusData.status);
        }
      });
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
