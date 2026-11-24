import type { CSSProperties } from "react";
import { CodeBlock } from "@prisma/eclipse";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubDarkHighContrast from "shiki/themes/github-dark-high-contrast.mjs";
import githubLightHighContrast from "shiki/themes/github-light-high-contrast.mjs";
import bash from "shiki/langs/bash.mjs";
import prisma from "shiki/langs/prisma.mjs";
import typescript from "shiki/langs/typescript.mjs";

export type CodeLang = "typescript" | "prisma" | "bash";

// Same highlighter setup as /compare/kysely: high-contrast GitHub themes so
// tokens clear 4.5:1, rendered on the server with no client JavaScript.
const highlighter = createHighlighterCoreSync({
  themes: [githubLightHighContrast, githubDarkHighContrast],
  langs: [typescript, prisma, bash],
  engine: createJavaScriptRegexEngine(),
});

const CODE_TYPE: CSSProperties = {
  border: 0,
  backgroundColor: "transparent",
  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
  fontSize: "0.8125rem",
  lineHeight: "1.25rem",
};

/** Undoes the global inline-code chip and the site's Inter-based --font-mono. */
const BLOCK_CODE: CSSProperties = {
  backgroundColor: "transparent",
  padding: 0,
  borderRadius: 0,
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: 400,
  color: "inherit",
};

/**
 * The site does not build the eclipse tokens CodeBlock uses for its border and
 * title bar, so they are set with site utilities, as /compare/kysely does.
 */
const CODE_BLOCK =
  "not-fumadocs-codeblock my-0 overflow-hidden rounded-[0.625rem] border border-black/[0.08] bg-white text-left [&>div:first-child]:border-black/[0.06] [&>div:first-child]:text-sm [&>div:first-child]:text-muted-foreground [&_button]:text-muted-foreground";

/** A titled, copyable, highlighted code block. */
export function Code({ code, lang, title }: { code: string; lang: CodeLang; title: string }) {
  const { tokens } = highlighter.codeToTokens(code, {
    lang,
    themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
    defaultColor: false,
  });
  return (
    <CodeBlock title={title} className={CODE_BLOCK}>
      <pre
        className="shiki m-0 w-max min-w-full bg-transparent py-3.5 *:flex *:flex-col"
        style={CODE_TYPE}
      >
        <code style={BLOCK_CODE}>
          {tokens.map((line, index) => (
            <span key={index} className="line block pr-12 pl-4">
              {line.length === 0
                ? " "
                : line.map((token) => (
                    <span key={token.offset} style={token.htmlStyle as CSSProperties}>
                      {token.content}
                    </span>
                  ))}
            </span>
          ))}
        </code>
      </pre>
    </CodeBlock>
  );
}
