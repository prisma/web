import { Database, Repeat, Search, Settings, Table } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { InkCode } from "./ink-code";

export type McpCapabilityIcon = "database" | "search" | "table" | "settings" | "repeat";

const ICONS: Record<McpCapabilityIcon, React.ComponentType<{ className?: string }>> = {
  database: Database,
  search: Search,
  table: Table,
  settings: Settings,
  repeat: Repeat,
};

// One capability: white card with the page's cyan tint on the icon tile and
// the example prompt on an ink chip (code/config always sits on ink).
export function CapabilityCard({
  icon,
  title,
  description,
  prompt,
  size,
}: {
  icon: McpCapabilityIcon;
  title: string;
  description: string;
  prompt: string;
  size: "wide" | "compact";
}) {
  const Icon = ICONS[icon];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)]",
        size === "wide" ? "xl:col-span-3" : "xl:col-span-2",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-prism-cyan-100"
        >
          <Icon className="size-5 text-prism-cyan-700" />
        </span>
        <h3 className="text-lg leading-snug">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-auto pt-2">
        <InkCode code={prompt} ariaLabel={`Copy example prompt: ${title}`} />
      </div>
    </div>
  );
}
