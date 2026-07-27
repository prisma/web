import { prisma_highlighter } from "@/lib/shiki_prisma";
import type { HighlightedCode } from "codehike/code";
import type { CSSProperties } from "react";
import { journeySteps, type JourneyStep } from "./journey-steps";

/** Code Hike token: plain text, or [text, color, style?]. */
type CodeToken = string | [string, string, CSSProperties?];

/**
 * Tokenize with the site's shiki `prisma-dark` theme (CSS-variable colors, so
 * it adapts to both themes) and re-shape into Code Hike's token format. Tokens
 * are split per word because Code Hike's transitions move tokens
 * independently; coarser tokens make the animation lurch.
 */
function toCodeTokens(text: string, color: string, out: CodeToken[]) {
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      out.push(part);
    } else {
      out.push([part, color]);
    }
  }
}

async function highlightStep(code: string, lang: JourneyStep["lang"]): Promise<HighlightedCode> {
  const tokens: CodeToken[] = [];
  if (lang === "text") {
    // Plain-text steps (the project tree): names in the normal code color,
    // trailing `# …` annotations dimmed like comments.
    code.split("\n").forEach((line, index) => {
      if (index > 0) tokens.push("\n");
      const hash = line.indexOf("# ");
      if (hash > -1) {
        toCodeTokens(line.slice(0, hash), "var(--color-foreground-neutral-weak)", tokens);
        toCodeTokens(line.slice(hash), "var(--color-disabled)", tokens);
      } else {
        toCodeTokens(line, "var(--color-foreground-neutral-weak)", tokens);
      }
    });
  } else {
    const highlighter = await prisma_highlighter();
    const lines = highlighter.codeToTokensBase(code, {
      lang,
      theme: highlighter.getTheme("prisma-dark"),
    });
    lines.forEach((line, index) => {
      if (index > 0) tokens.push("\n");
      for (const token of line) {
        toCodeTokens(token.content, token.color ?? "currentColor", tokens);
      }
    });
  }
  return {
    tokens,
    code,
    lang,
    meta: "",
    themeName: "prisma-dark",
    style: {},
    annotations: [],
  } as unknown as HighlightedCode;
}

/** Highlight every journey step on the server; the player receives plain data. */
export async function highlightJourney(): Promise<HighlightedCode[]> {
  return Promise.all(journeySteps.map((step) => highlightStep(step.code, step.lang)));
}
