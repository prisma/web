import { Badge } from "./badge";

interface StatisticProps {
  title?: string;
  value?: string | number;
  measure?: string;
  badge?: React.ReactNode;
  badgeColor?: "neutral" | "ppg" | "orm" | "error" | "success" | "warning";
}

export default function Statistic({
  title = "Statistic",
  value = 0,
  measure = "",
  badge = null,
  badgeColor = "ppg",
}: StatisticProps) {
  return (
    <div className="relative">
      {/* Title + Badge */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xs font-semibold text-foreground-neutral-weak uppercase tracking-[1.1px]">
          {title}
        </span>
        {badge && <Badge color={badgeColor} label={badge} />}
      </div>

      {/* Value + Measure */}
      <div className="flex items-baseline gap-2 leading-8">
        <span className="text-2xl font-bold text-foreground-neutral font-mona-sans">
          {value}
        </span>
        <span className="text-sm text-foreground-neutral-weak">{measure}</span>
      </div>
    </div>
  );
}
