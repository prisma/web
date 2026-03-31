"use client";
import { useStarCount } from "../hooks/use-star-count";

type StarCountProps = {
  className?: string;
};

const PLACEHOLDER_VALUE = "45.5K";

const getStarParts = (starCount: number) => {
  const [integerPart, decimalPart] = (Math.max(starCount, 0) / 1000)
    .toFixed(1)
    .split(".");

  return {
    integer: Number(integerPart),
    decimal: Number(decimalPart),
  };
};

export const StarCount = ({ className }: StarCountProps) => {
  const { starCount, isLoading, error } = useStarCount();
  const isHidden = !isLoading && !error && starCount <= 0;
  const { integer, decimal } = getStarParts(starCount);
  const formattedValue = `${String(integer).padStart(2, "0")}.${decimal}K`;

  return (
    <span className={className} style={{ display: isHidden ? "none" : "inline" }}>
      <span className="inline-grid tabular-nums" style={{ minWidth: "6ch" }}>
        <span
          aria-hidden={!isLoading}
          style={{
            gridArea: "1 / 1",
            display: isLoading ? "inline" : "none",
          }}
        >
          {PLACEHOLDER_VALUE}
        </span>
        <span
          aria-live="polite"
          style={{
            gridArea: "1 / 1",
            display: isLoading ? "none" : "inline",
          }}
          aria-label={formattedValue}
        >
          {formattedValue}
        </span>
      </span>
    </span>
  );
};
