"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

/** A native select supports touch, keyboard, and an explicit system preference. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const value = mounted ? (theme ?? "system") : "system";
  const Icon = value === "dark" ? Moon : value === "light" ? Sun : Monitor;
  return (
    <div className="relative flex h-11 w-36 shrink-0 items-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      <Icon className="pointer-events-none absolute left-3 size-4" aria-hidden="true" />
      <select
        aria-label="Color theme"
        value={value}
        onChange={(event) => setTheme(event.target.value)}
        className="h-full w-full cursor-pointer rounded-full bg-transparent pl-9 pr-3 text-sm outline-none"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
