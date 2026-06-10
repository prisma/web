import { FLOW_SCENES } from "./flow-presets";
import { FlowPlayer } from "./flow";
import { ConceptPlayer } from "./player";
import { CONCEPT_PRESETS, type ConceptName, parseStepTokens } from "./presets";

/**
 * Animated concept diagram for the Compute docs, e.g.
 * `<ConceptAnimation name="compute-model" />` in MDX.
 *
 * Names with an entry in flow-presets.ts render as a visual box-and-arrow flow
 * (Project → Branch → Infrastructure, variable scopes, push-to-deploy). Any
 * other name falls back to the Code Hike token animation in presets.ts. Either
 * way the surrounding layout never shifts as you step through.
 */
export function ConceptAnimation({ name }: { name: ConceptName }) {
  const scene = FLOW_SCENES[name];
  if (scene) return <FlowPlayer scene={scene} />;

  const preset = CONCEPT_PRESETS[name];
  if (!preset) throw new Error(`Unknown concept animation: ${String(name)}`);
  const steps = preset.steps.map((step) => ({
    ...parseStepTokens(step.code),
    title: step.title,
    caption: step.caption,
  }));
  return <ConceptPlayer label={preset.label} steps={steps} />;
}
