"use client";
import { cva } from "class-variance-authority";
import { Airplay, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";

const itemVariants = cva(
  // No outline on click; keyboard focus gets a quiet neutral ring instead.
  "size-6.5 rounded-full p-1.5 text-fd-muted-foreground outline-none transition-[color,background-color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-fd-foreground/60 motion-reduce:transition-none",
  {
    variants: {
      active: {
        // Selected: the raised segment, as quiet as it can be while still
        // reading, the same for light, dark and system. Its fill and shadow
        // come from `--segment-selected*` (global.css), which the light and
        // dark theme blocks set: white with a whisper of shadow on light, a
        // faint ink lift on dark.
        true: "bg-(--segment-selected) text-fd-foreground shadow-(--segment-selected-shadow)",
        false: "quiet-hover",
      },
    },
  },
);

const full = [["light", Sun] as const, ["dark", Moon] as const, ["system", Airplay] as const];

export function ThemeToggle({
  className,
  mode = "light-dark",
  ...props
}: ComponentProps<"div"> & {
  mode?: "light-dark" | "light-dark-system";
}) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // A segmented control: a barely tinted track the selected segment sits
  // raised on, whichever of the three it is.
  const container = cn(
    "inline-flex items-center rounded-full border border-stroke-neutral bg-fd-foreground/[0.03] p-1",
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
              className={cn(itemVariants({ active: value === key }))}
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
          className={cn(itemVariants({ active: value === key }))}
          onClick={() => setTheme(key)}
        >
          <Icon className="size-full" fill="currentColor" />
        </button>
      ))}
    </div>
  );
}

const cycleOrder = ["light", "dark", "system"] as const;
type ThemeChoice = (typeof cycleOrder)[number];
const cycleIcon = { light: Sun, dark: Moon, system: Airplay } as const;

/**
 * The navbar's theme control: one quiet icon showing the current choice
 * (light, dark or system) that steps to the next on click. The three-way
 * segmented ThemeToggle stays in the mobile drawer, where it has room.
 */
export function ThemeCycleToggle({ className, ...props }: ComponentProps<"button">) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current: ThemeChoice =
    mounted && cycleOrder.includes(theme as ThemeChoice) ? (theme as ThemeChoice) : "system";
  const next = cycleOrder[(cycleOrder.indexOf(current) + 1) % cycleOrder.length];
  const Icon = cycleIcon[current];

  return (
    <button
      type="button"
      data-theme-toggle=""
      aria-label={`Theme: ${current}. Switch to ${next}`}
      title={`Theme: ${current}`}
      {...props}
      className={cn(
        "quiet-hover inline-flex size-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-fd-foreground/60",
        className,
      )}
      onClick={() => setTheme(next)}
    >
      <Icon className="size-4" fill="currentColor" aria-hidden="true" />
    </button>
  );
}
