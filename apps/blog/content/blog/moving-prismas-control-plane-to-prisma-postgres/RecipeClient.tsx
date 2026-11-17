"use client";

import { Pre, type HighlightedCode } from "codehike/code";
import { Scrolly, type ScrollyStep } from "./Scrolly";

type Props = {
  steps: (Omit<ScrollyStep, "body"> & { body: string; file: string })[];
  codes: HighlightedCode[];
};

export function RecipeClient({ steps, codes }: Props) {
  return (
    <Scrolly
      label="The replication recipe, step by step"
      steps={steps.map((s) => ({ id: s.id, title: s.title, body: <p>{s.body}</p> }))}
      visual={(active) => (
        <div className="cp-code">
          <div className="cp-code-label">
            <span>{steps[active]?.file}</span>
            <span>
              {active + 1} / {steps.length}
            </span>
          </div>
          <div className="cp-code-body">
            <Pre code={codes[active]} />
          </div>
        </div>
      )}
    />
  );
}
