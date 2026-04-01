"use client";
import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

type StatusIndicator = "none" | "minor" | "major" | "critical";

interface Incident {
  impact: StatusIndicator;
}

interface IncidentsResponse {
  incidents: Incident[];
}

const SEVERITY: Record<StatusIndicator, number> = {
  none: 0,
  minor: 1,
  major: 2,
  critical: 3,
};

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
    Promise.all([
      fetch("https://www.prisma-status.com/api/v2/status.json").then(
        (res) => res.json(),
      ),
      fetch("https://www.prisma-status.com/api/v2/incidents/unresolved.json").then(
        (res) => res.json() as Promise<IncidentsResponse>,
      ),
    ])
      .then(([statusJson, incidentsData]) => {
        const summaryIndicator: StatusIndicator = statusJson.status.indicator ?? "none";
        const incidents: Incident[] = incidentsData.incidents ?? [];
        const worstIncidentIndicator = incidents.reduce<StatusIndicator>(
          (worst, incident) =>
            SEVERITY[incident.impact] > SEVERITY[worst] ? incident.impact : worst,
          "none",
        );

        if (SEVERITY[worstIncidentIndicator] > SEVERITY[summaryIndicator]) {
          setPdpStatus({
            status: {
              indicator: worstIncidentIndicator,
              description: incidents.length === 1 ? "Active Incident" : "Active Incidents",
            },
          });
        } else {
          setPdpStatus(statusJson);
        }
      })
      .catch((error) => console.log("PDP Status fetch failed " + error.message));
  }, []);

  const indicator = pdpStatus.status.indicator || "-";
  const indicatorClass = indicatorStatus[indicator] || "";

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
