"use client";

import { type AnnotationHandler, type HighlightedCode, InnerToken, Pre } from "codehike/code";
import { useMemo } from "react";
import type { ConceptToken } from "./presets";
import { PlayerShell } from "./shell";
import { SmoothPre } from "./smooth-pre";

const handlers: AnnotationHandler[] = [
  {
    name: "token-transitions",
    PreWithRef: SmoothPre,
    // inline-block so the WAAPI translate animation can move each token
    Token: (props) => <InnerToken merge={props} style={{ display: "inline-block" }} />,
  },
];

export interface PlayerStep {
  tokens: ConceptToken[];
  plain: string;
  title: string;
  caption: string;
}

/**
 * Code Hike token-transition player: each step is a plain-text diagram whose
 * surviving tokens slide to their new position between states.
 */
export function ConceptPlayer({ label, steps }: { label: string; steps: PlayerStep[] }) {
  const codes = useMemo(
    () =>
      steps.map(
        (step) =>
          ({
            tokens: step.tokens,
            code: step.plain,
            lang: "txt",
            meta: "",
            themeName: "concept",
            style: {},
            annotations: [],
          }) as unknown as HighlightedCode,
      ),
    [steps],
  );

  return (
    <PlayerShell label={label} steps={steps}>
      {(active) => (
        // Grid-stacked sizers reserve the tallest/widest step up front, so
        // stepping through states never shifts the layout.
        <div className="grid overflow-x-auto px-4 py-4">
          <div className="col-start-1 row-start-1">
            <Pre
              code={codes[active]}
              handlers={handlers}
              className="type-code-sm whitespace-pre font-mono text-fd-foreground"
            />
          </div>
          {steps.map((step) => (
            <pre
              key={step.plain}
              aria-hidden
              className="type-code-sm invisible col-start-1 row-start-1 whitespace-pre font-mono"
            >
              {step.plain}
            </pre>
          ))}
        </div>
      )}
    </PlayerShell>
  );
}
