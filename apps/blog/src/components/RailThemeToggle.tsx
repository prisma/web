"use client";

import { useTheme } from "@prisma-docs/ui/components/theme-provider";
import { cn } from "@prisma-docs/ui/lib/cn";
import { Airplay, Moon, Sun } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";

const cycleOrder = ["light", "dark", "system"] as const;
type ThemeChoice = (typeof cycleOrder)[number];
const cycleIcon = { light: Sun, dark: Moon, system: Airplay } as const;

/**
 * The docs' theme button (apps/docs/src/components/layout/theme-toggle.tsx,
 * ThemeCycleToggle), at the top of the post's right column (client,
 * 2026-11-25: "just use the same button as in docs"): one round quiet icon
 * showing the current choice that steps light → dark → system on click.
 */
export function RailThemeToggle({ className, ...props }: ComponentProps<"button">) {
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
        "quiet-hover inline-flex size-8 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-fd-foreground/60",
        className,
      )}
      onClick={() => setTheme(next)}
    >
      <Icon className="size-4" fill="currentColor" aria-hidden="true" />
    </button>
  );
}
