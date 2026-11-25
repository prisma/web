"use client";

import { useTheme } from "@prisma-docs/ui/components/theme-provider";
import { Airplay, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { RAIL_ROW } from "./BlogShare";

const ORDER = ["light", "dark", "system"] as const;
type Choice = (typeof ORDER)[number];
const ICON = { light: Sun, dark: Moon, system: Airplay } as const;
const LABEL = { light: "Light theme", dark: "Dark theme", system: "System theme" } as const;

/**
 * The light/dark switch as a row of the post's right column (client,
 * 2026-11-25: it left the navbar so the navbar matches the homepage, and
 * belongs in the rail with the share links). The row names the current
 * theme and steps light → dark → system on click, like the docs' navbar
 * control (apps/docs/src/components/layout/theme-toggle.tsx).
 */
export function RailThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current: Choice = mounted && ORDER.includes(theme as Choice) ? (theme as Choice) : "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const Icon = ICON[current];

  return (
    <button
      type="button"
      data-theme-toggle=""
      aria-label={`${LABEL[current]}. Switch to ${LABEL[next].toLowerCase()}`}
      title={`Switch to ${LABEL[next].toLowerCase()}`}
      onClick={() => setTheme(next)}
      className={RAIL_ROW}
    >
      <Icon aria-hidden />
      {LABEL[current]}
    </button>
  );
}
