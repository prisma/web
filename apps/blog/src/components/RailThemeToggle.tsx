"use client";

import { useTheme } from "@prisma-docs/ui/components/theme-provider";
import { cn } from "@prisma-docs/ui/lib/cn";
import { Airplay, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Airplay },
] as const;
type Choice = (typeof OPTIONS)[number]["value"];

/**
 * The theme switch at the top of the post's right column (client,
 * 2026-11-25: it left the navbar so the navbar matches the homepage, then
 * "move the themes to the top and make it obviously a button"). A bordered
 * three-way control, Light / Dark / System, each labelled, the current one
 * filled in neutral ink rather than the brand cyan, so it reads at a glance
 * as a control and shows every choice.
 */
export function RailThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current: Choice | null =
    mounted && OPTIONS.some((o) => o.value === theme) ? (theme as Choice) : null;

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      data-theme-toggle=""
      className="grid grid-cols-3 gap-0.5 rounded-lg border border-stroke-neutral p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-md text-[13px] font-medium outline-none transition-colors duration-[120ms] ease-out hover:duration-0 focus-visible:ring-2 focus-visible:ring-fd-foreground/60 motion-reduce:transition-none",
              active
                ? "bg-fd-foreground/[0.07] text-fd-foreground"
                : "text-fd-muted-foreground hover:bg-fd-foreground/[0.04] hover:text-fd-foreground",
            )}
          >
            <Icon aria-hidden className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
