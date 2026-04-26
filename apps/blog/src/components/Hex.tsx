"use client";

type HEXColorProps = {
  color: string;
  label: string;
} & React.ComponentPropsWithoutRef<"span">;

export const Hex = ({ color, label }: HEXColorProps) => (
  <span>
    {label}
    <span
      className="inline-block h-[15px] w-[15px] shrink-0 align-middle rounded ml-[5px] mb-px"
      style={{ backgroundColor: color }}
    />
  </span>
);
