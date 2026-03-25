import { createHighlighter, type ThemeRegistration } from "shiki";

const prismaTheme: ThemeRegistration = {
  name: "prisma-dark",
  type: "dark",
  colors: {
    "editor.background": "transparent",
    "editor.foreground": "var(--color-foreground-neutral-weak)",
  },
  settings: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        foreground: "var(--color-disabled)",
      },
    },
    {
      scope: [
        "variable",
        "variable.other.readwrite",
        "variable.other.object",
        "variable.other.property",
        "support.variable",
      ],
      settings: {
        foreground: "var(--color-foreground-neutral-weak)",
      },
    },
    {
      scope: [
        "variable.other.constant",
        "variable.language.this",
        "variable.language.super",
      ],
      settings: {
        foreground: "var(--color-background-ppg-reverse-strong)",
      },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.control.import",
        "keyword.control.export",
        "keyword.control.from",
        "keyword.control.default",
        "keyword.control.as",
        "keyword.control.async",
        "keyword.control.await",
        "storage.type",
        "storage.modifier",
        "storage.type.function",
        "storage.type.class",
        "storage.type.const",
        "storage.type.let",
        "storage.type.var",
      ],
      settings: {
        foreground: "var(--color-background-orm-reverse-strong)",
      },
    },
    {
      scope: [
        "entity.name.function",
        "meta.function-call",
        "support.function",
        "entity.name.method",
      ],
      settings: {
        foreground: "var(--color-background-ppg-reverse-strong)",
      },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
        "meta.import variable.other.readwrite",
        "meta.export variable.other.readwrite",
      ],
      settings: {
        foreground: "var(--color-background-orm-reverse-strong)",
      },
    },
    {
      scope: [
        "string",
        "string.quoted.single",
        "string.quoted.double",
        "string.template",
        "punctuation.definition.string.begin",
        "punctuation.definition.string.end",
      ],
      settings: {
        foreground: "var(--color-background-ppg-reverse-strong)",
      },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: {
        foreground: "var(--color-background-warning-reverse-strong)",
      },
    },
    {
      scope: [
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
      ],
      settings: {
        foreground: "var(--color-background-orm-reverse-strong)",
      },
    },
    {
      scope: [
        "keyword.operator",
        "keyword.operator.arithmetic",
        "keyword.operator.assignment",
        "keyword.operator.comparison",
        "keyword.operator.logical",
      ],
      settings: {
        foreground: "var(--color-background-orm-reverse-strong)",
      },
    },
    {
      scope: ["keyword.operator.type", "keyword.operator.expression"],
      settings: {
        foreground: "var(--color-background-orm-reverse-strong)",
      },
    },
    {
      scope: [
        "punctuation.accessor",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.definition.block",
        "punctuation.definition.parameters",
        "punctuation.definition.arguments",
        "meta.brace.round",
        "meta.brace.square",
        "meta.brace.curly",
      ],
      settings: {
        foreground: "var(--color-foreground-neutral-weak)",
      },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: {
        foreground: "var(--color-foreground-neutral-weak)",
      },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: {
        foreground: "var(--color-background-ppg-reverse-strong)",
      },
    },
    {
      scope: ["meta.tag.attributes string.quoted"],
      settings: {
        foreground: "#96E072",
      },
    },
    {
      scope: [
        "punctuation.definition.template-expression",
        "punctuation.section.embedded",
      ],
      settings: {
        foreground: "var(--color-foreground-neutral-weak)",
      },
    },
    {
      scope: ["meta.template.expression"],
      settings: {
        foreground: "#D5CED9",
      },
    },
    {
      scope: ["support.type.primitive", "support.type.builtin"],
      settings: {
        foreground: "#7cb7ff",
      },
    },
    {
      scope: ["variable.parameter", "meta.parameters variable"],
      settings: {
        foreground: "var(--color-background-warning-reverse-strong)",
      },
    },
    {
      scope: ["invalid", "invalid.illegal"],
      settings: {
        foreground: "#FC644D",
      },
    },
    {
      scope: ["markup.inserted", "markup.inserted.diff"],
      settings: {
        background: "var(--color-background-success-reverse-strong)",
      },
    },
    {
      scope: ["markup.deleted", "markup.deleted.diff"],
      settings: {
        background: "var(--color-background-error-reverse-strong)",
      },
    },
    {
      scope: ["meta.diff.header"],
      settings: {
        background: "var(--color-foreground-neutral-weak)",
      },
    },
  ],
};

let prisma_highlighter: Awaited<ReturnType<typeof createHighlighter>> | null =
  null;

async function getHighlighter() {
  if (!prisma_highlighter) {
    prisma_highlighter = await createHighlighter({
      themes: [prismaTheme],
      langs: [
        "typescript",
        "javascript",
        "jsx",
        "tsx",
        "json",
        "bash",
        "sh",
        "prisma",
        "sql",
        "diff",
      ],
    });
  }
  return prisma_highlighter;
}

export { getHighlighter as prisma_highlighter };
