"use client";
import { cva } from "class-variance-authority";
import { Airplay, Moon, Sun } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";
import { useTheme } from "./theme-provider";

const itemVariants = cva(
  "size-6.5 rounded-full p-1.5 text-fd-muted-foreground",
  {
    variants: {
      active: {
        true: "",
        false: "text-fd-muted-foreground",
      },
      color: {
        ppg: "",
        orm: "",
      },
    },
    compoundVariants: [
      {
        active: true,
        color: "ppg",
        className: "bg-background-ppg text-foreground-ppg",
      },
      {
        active: true,
        color: "orm",
        className: "bg-background-orm text-foreground-orm",
      },
    ],
  },
);

const full = [
  ["light", Sun] as const,
  ["dark", Moon] as const,
  ["system", Airplay] as const,
];

export function ThemeToggle({
  className,
  mode = "light-dark",
  color = "ppg",
  ...props
}: ComponentProps<"div"> & {
  mode?: "light-dark" | "light-dark-system";
  color?: "ppg" | "orm";
}) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = cn(
    "inline-flex items-center rounded-full border p-1",
    className,
  );

  if (mode === "light-dark") {
    const value = mounted ? resolvedTheme : null;

    return (
      <button
        className={container}
        aria-label={`Toggle Theme`}
        onClick={() => setTheme(value === "light" ? "dark" : "light")}
        data-theme-toggle=""
      >
        {full.map(([key, Icon]) => {
          if (key === "system") return;

          return (
            <Icon
              key={key}
              fill="currentColor"
              className={cn(itemVariants({ active: value === key, color }))}
            />
          );
        })}
      </button>
    );
  }

  const value = mounted ? theme : null;

  return (
    <div className={container} data-theme-toggle="" {...props}>
      {full.map(([key, Icon]) => (
        <button
          key={key}
          aria-label={key}
          className={cn(itemVariants({ active: value === key, color }))}
          onClick={() => setTheme(key)}
        >
          <Icon className="size-full" fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
