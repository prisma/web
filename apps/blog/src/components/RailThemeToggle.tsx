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
 * 2026-11-25: "just use the same button as in docs", then a "Theme" label
 * beside it): the icon shows the current choice and a click steps
 * light → dark → system.
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
      // The docs' icon with a "Theme" label beside it (client, 2026-11-25),
      // as one rounded quiet button: the hover tint covers icon and label.
      className={cn(
        "quiet-hover inline-flex h-8 cursor-pointer items-center gap-2 rounded-full pr-3 pl-2 text-sm text-fd-muted-foreground outline-none hover:text-fd-foreground focus-visible:bg-fd-foreground/[0.06]",
        className,
      )}
      onClick={() => setTheme(next)}
    >
      <Icon className="size-4" fill="currentColor" aria-hidden="true" />
      Theme
    </button>
  );
}
