"use client";

/**
 * React-based theme provider for light/dark/system themes
 *
 * Usage:
 * ```tsx
 * import { ThemeProvider } from '@prisma-docs/ui/components/theme-provider';
 *
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="system" storageKey="theme">
 *       {children}
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "data-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Get system theme preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Resolve theme (convert 'system' to actual theme)
  const resolveTheme = (themeValue: Theme): ResolvedTheme => {
    return themeValue === "system" ? getSystemTheme() : themeValue;
  };

  // Apply theme to document
  const applyTheme = (themeValue: ResolvedTheme) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.setAttribute(attribute, themeValue);

    // Also update class for Tailwind dark mode
    if (themeValue === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  // Initialize theme from localStorage or default
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = stored || defaultTheme;
    const resolved = resolveTheme(initialTheme);

    setThemeState(initialTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newResolvedTheme = e.matches ? "dark" : "light";
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
