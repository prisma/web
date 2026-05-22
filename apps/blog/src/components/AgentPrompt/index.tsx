import { highlight, type HighlightedCode } from "codehike/code";
import { AgentPromptClient } from "./Client";

export type AgentPromptProps = {
  prompt: string;
  before?: string;
  after?: string;
  language?: string;
  fileName?: string;
  skill?: string;
  terminalCommand?: string;
  terminalLines?: string[];
};

function extractMarks(value: string): {
  value: string;
  markedLines: number[];
} {
  const lines = value.split("\n");
  const out: string[] = [];
  const marked: number[] = [];
  for (const line of lines) {
    if (/^\s*\/\/\s*!mark(?:\s|$)/.test(line) || /^\s*#\s*!mark(?:\s|$)/.test(line)) {
      // The next source line is marked.
      marked.push(out.length + 1);
      continue;
    }
    out.push(line);
  }
  return { value: out.join("\n"), markedLines: marked };
}

async function highlightWithMarks(
  value: string,
  language: string,
): Promise<HighlightedCode> {
  const { value: stripped, markedLines } = extractMarks(value);
  const result = (await highlight(
    { value: stripped, lang: language, meta: "" },
    "github-from-css",
  )) as HighlightedCode;
  const injected = markedLines
    .filter((n) => !result.annotations.some((a) => a.name === "mark" && "fromLineNumber" in a && a.fromLineNumber === n))
    .map((n) => ({
      name: "mark",
      query: "",
      fromLineNumber: n,
      toLineNumber: n,
    }));
  return {
    ...result,
    annotations: [...result.annotations, ...injected],
  };
}

export async function AgentPrompt({
  prompt,
  before,
  after,
  language = "prisma",
  fileName,
  skill,
  terminalCommand,
  terminalLines,
}: AgentPromptProps) {
  const hasCode = before != null && after != null;
  const [beforeHL, afterHL] = hasCode
    ? await Promise.all([
        highlightWithMarks(before, language),
        highlightWithMarks(after, language),
      ])
    : [undefined, undefined];
  const maxCodeLines = hasCode
    ? Math.max(
        countLines(before as string),
        countLines(after as string),
      )
    : undefined;

  return (
    <AgentPromptClient
      prompt={prompt}
      before={beforeHL}
      after={afterHL}
      fileName={fileName}
      skill={skill}
      terminalCommand={terminalCommand}
      terminalLines={terminalLines}
      maxCodeLines={maxCodeLines}
    />
  );
}

function countLines(value: string): number {
  const stripped = extractMarks(value).value;
  return stripped.split("\n").length;
}
