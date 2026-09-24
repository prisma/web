import { createHighlighter, type ThemeRegistration } from "shiki";

const prismaTheme: ThemeRegistration = {
  name: "prisma-dark",
  type: "dark",
  colors: {
    "editor.background": "transparent",
    "editor.foreground": "#d5d5d4",
  },
  settings: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        foreground: "#646567",
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
        foreground: "#d5d5d4",
      },
    },
    {
      scope: ["variable.other.constant", "variable.language.this", "variable.language.super"],
      settings: {
        foreground: "#f8da85",
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
        foreground: "#7be7f0",
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
        foreground: "#f8da85",
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
        foreground: "#7be7f0",
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
        foreground: "#f8da85",
      },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: {
        foreground: "#ff9fa4",
      },
    },
    {
      scope: ["constant.language.boolean", "constant.language.null", "constant.language.undefined"],
      settings: {
        foreground: "#7be7f0",
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
        foreground: "#7be7f0",
      },
    },
    {
      scope: ["keyword.operator.type", "keyword.operator.expression"],
      settings: {
        foreground: "#7be7f0",
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
        foreground: "#d5d5d4",
      },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: {
        foreground: "#d5d5d4",
      },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: {
        foreground: "#f8da85",
      },
    },
    {
      scope: ["meta.tag.attributes string.quoted"],
      settings: {
        foreground: "#f8da85",
      },
    },
    {
      scope: ["punctuation.definition.template-expression", "punctuation.section.embedded"],
      settings: {
        foreground: "#d5d5d4",
      },
    },
    {
      scope: ["meta.template.expression"],
      settings: {
        foreground: "#d5d5d4",
      },
    },
    {
      scope: ["support.type.primitive", "support.type.builtin"],
      settings: {
        foreground: "#b3f4f9",
      },
    },
    {
      scope: ["variable.parameter", "meta.parameters variable"],
      settings: {
        foreground: "#ff9fa4",
      },
    },
    {
      scope: ["invalid", "invalid.illegal"],
      settings: {
        foreground: "#ff9fa4",
      },
    },
    {
      scope: ["markup.inserted", "markup.inserted.diff"],
      settings: {
        background: "#00353c",
      },
    },
    {
      scope: ["markup.deleted", "markup.deleted.diff"],
      settings: {
        background: "#4b0211",
      },
    },
    {
      scope: ["meta.diff.header"],
      settings: {
        background: "#d5d5d4",
      },
    },
  ],
};

let prisma_highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

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
