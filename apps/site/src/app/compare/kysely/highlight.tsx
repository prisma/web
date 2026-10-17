import type { CSSProperties } from "react";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import typescript from "shiki/langs/typescript.mjs";

/**
 * The docs' Shiki themes with `defaultColor: false`, so tokens carry
 * `--shiki-light` / `--shiki-dark` and `globals.css` picks the active one.
 * Synchronous, because the same content tree also renders to Markdown.
 */
const highlighter = createHighlighterCoreSync({
  themes: [githubLight, githubDark],
  langs: [typescript],
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

/** A highlighted `pre` with the docs' code block layout: one flex row per line. */
export function highlight(code: string) {
  const { tokens } = highlighter.codeToTokens(code, {
    lang: "typescript",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
  return (
    <pre
      className="shiki m-0 w-max min-w-full rounded-none bg-transparent p-0 *:flex *:flex-col"
      style={CODE_TYPE}
      data-language="ts"
    >
      <code style={BLOCK_CODE}>
        {tokens.flatMap((line, index) => [
          index > 0 ? "\n" : null,
          <span key={index} className="line px-4">
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
