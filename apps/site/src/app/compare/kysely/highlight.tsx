import type { CSSProperties } from "react";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubDarkHighContrast from "shiki/themes/github-dark-high-contrast.mjs";
import githubLightHighContrast from "shiki/themes/github-light-high-contrast.mjs";
import bash from "shiki/langs/bash.mjs";
import prisma from "shiki/langs/prisma.mjs";
import sql from "shiki/langs/sql.mjs";
import typescript from "shiki/langs/typescript.mjs";

export type HighlightLang = "typescript" | "sql" | "prisma" | "bash";

const LANG_IDS: Record<HighlightLang, string> = {
  typescript: "typescript",
  sql: "sql",
  prisma: "prisma",
  bash: "bash",
};

/**
 * High-contrast GitHub themes so parameter tokens clear 4.5:1 (the default
 * github-light orange `#e36209` is 3.49:1). `defaultColor: false` so tokens
 * carry `--shiki-light` / `--shiki-dark`.
 */
const highlighter = createHighlighterCoreSync({
  themes: [githubLightHighContrast, githubDarkHighContrast],
  langs: [typescript, sql, prisma, bash],
  engine: createJavaScriptRegexEngine(),
});

/** The docs' `type-code-sm` inside a code block, with `--font-code` set by `page.tsx`. */
const CODE_TYPE: CSSProperties = {
  border: 0,
  backgroundColor: "transparent",
  fontFamily:
    'var(--font-code, ui-monospace), ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
  fontFeatureSettings: '"ss01" on, "ss02" on, "ss05" on, "ss06" on',
  fontSize: "0.8125rem",
  lineHeight: "1.25rem",
};

/** Undoes the page's inline-code chip, which its prose wrapper applies to every `code`. */
const BLOCK_CODE: CSSProperties = {
  backgroundColor: "transparent",
  padding: 0,
  borderRadius: 0,
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: 400,
  color: "inherit",
};

const DATA_LANG: Record<HighlightLang, string> = {
  typescript: "ts",
  sql: "sql",
  prisma: "prisma",
  bash: "bash",
};

/** A highlighted `pre` with the docs' code block layout: one flex row per line. */
export function highlight(
  code: string,
  lang: HighlightLang = "typescript",
  lineGroups: Readonly<Record<number, string>> = {},
) {
  const { tokens } = highlighter.codeToTokens(code, {
    lang: LANG_IDS[lang],
    themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
    defaultColor: false,
  });
  return (
    <pre
      className="shiki m-0 w-max min-w-full rounded-none bg-transparent p-0 *:flex *:flex-col"
      style={CODE_TYPE}
      data-language={DATA_LANG[lang]}
    >
      <code style={BLOCK_CODE}>
        {tokens.flatMap((line, index) => [
          index > 0 ? "\n" : null,
          <span
            key={index}
            className={`line pl-4 pr-12 ${
              lineGroups[index] === "posts"
                ? "bg-prism-cyan-100"
                : lineGroups[index] === "email"
                  ? "bg-prism-yellow-100"
                  : ""
            }`}
            data-group={lineGroups[index] || undefined}
          >
            {line.length === 0
              ? " "
              : line.map((token) => (
                  <span key={token.offset} style={token.htmlStyle as CSSProperties}>
                    {token.content}
                  </span>
                ))}
          </span>,
        ])}
      </code>
    </pre>
  );
}

/** Invert SAME_QUERY_LINE_GROUPS into a line-index map for one tab. */
export function lineGroupMap(
  groups: readonly { id: string; [tab: string]: string | readonly number[] }[],
  tab: string,
): Record<number, string> {
  const map: Record<number, string> = {};
  for (const group of groups) {
    const lines = group[tab];
    if (!Array.isArray(lines)) continue;
    for (const line of lines) map[line] = group.id;
  }
  return map;
}
