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
        <span className="text-foreground-neutral-weak type-heading-2xs">
          {title}
        </span>
        {badge && <Badge color={badgeColor} label={badge} />}
      </div>

      {/* Value + Measure */}
      <div className="flex items-baseline gap-2 leading-8">
        <span className="text-foreground-neutral type-heading-2xl">
          {value}
        </span>
        <span className="text-foreground-neutral-weak type-text-sm">{measure}</span>
      </div>
    </div>
  );
}
