import { createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";
import { prisma8Language } from "@prisma-docs/ui/lib/prisma8-language";

// Maps the GitHub scopes to the same --ch-N variables codehike's
// github-from-css theme uses, so shiki output follows light/dark mode
// exactly like the codehike-rendered snippets elsewhere on the page.
const chCssTheme: ThemeRegistration = {
  name: "ch-css",
  type: "dark",
  fg: "var(--ch-4)",
  bg: "transparent",
  settings: [
    { settings: { foreground: "var(--ch-4)" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "var(--ch-1)" },
    },
    {
      scope: ["keyword", "keyword.operator", "storage.type", "storage.modifier"],
      settings: { foreground: "var(--ch-7)" },
    },
    { scope: ["entity.name", "entity.name.function"], settings: { foreground: "var(--ch-5)" } },
    {
      scope: ["support", "support.type", "variable.language", "constant.language"],
      settings: { foreground: "var(--ch-2)" },
    },
    { scope: ["string", "punctuation.definition.string"], settings: { foreground: "var(--ch-8)" } },
    {
      scope: ["variable.parameter", "variable.other.property"],
      settings: { foreground: "var(--ch-3)" },
    },
  ],
};

let highlighterPromise: Promise<Highlighter> | undefined;

export async function highlightPrisma8(code: string): Promise<string> {
  highlighterPromise ??= createHighlighter({
    themes: [chCssTheme],
    langs: [prisma8Language as never],
  });
  const highlighter = await highlighterPromise;
  return highlighter.codeToHtml(code, { lang: "prisma", theme: "ch-css" });
}
