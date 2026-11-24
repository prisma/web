import { Ban, Database, FilePen, ShieldX, TriangleAlert } from "lucide-react";

export type Layer = {
  /** What the check does, as a short heading. */
  heading: string;
  /** One sentence a reader can take in without opening the section. */
  summary: string;
  effect: "Removed" | "Blocks" | "Warns";
  /** Set when the check does nothing until a policy is declared. */
  needsPolicy?: boolean;
  /** The section of the post that covers this check. */
  href: string;
};

type Props = {
  label: string;
  layers: Layer[];
};

function EffectIcon({ effect }: { effect: Layer["effect"] }) {
  if (effect === "Blocks") return <ShieldX size={14} aria-hidden="true" />;
  if (effect === "Warns") return <TriangleAlert size={14} aria-hidden="true" />;
  return <Ban size={14} aria-hidden="true" />;
}

// One line runs from the schema edit at the top to the database at the
// bottom, and every check sits on it in the order a change meets it. All six
// are visible at once, so the figure needs no interaction and no script.
export function LayerMap({ label, layers }: Props) {
  return (
    <figure className="layers not-prose" aria-label={label}>
      <ol className="layers-flow">
        <li className="layers-cap" aria-hidden="true">
          <span className="layers-dot">
            <FilePen size={15} />
          </span>
          <span className="layers-cap-label">You or your agent edit the schema</span>
        </li>
        {layers.map((layer, i) => (
          <li key={layer.heading} className="layers-step" data-effect={layer.effect}>
            <span className="layers-dot" aria-hidden="true">
              {i + 1}
            </span>
            <div className="layers-card">
              <div className="layers-card-text">
                <a className="layers-card-title" href={layer.href}>
                  {layer.heading}
                </a>
                <p className="layers-card-summary">{layer.summary}</p>
              </div>
              <div className="layers-chips">
                <span className="layers-chip" data-effect={layer.effect}>
                  <EffectIcon effect={layer.effect} />
                  {layer.effect}
                </span>
                {layer.needsPolicy && (
                  <span className="layers-chip" data-setup="policy">
                    Needs a policy
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
        <li className="layers-cap" aria-hidden="true">
          <span className="layers-dot">
            <Database size={15} />
          </span>
          <span className="layers-cap-label">The change reaches the database</span>
        </li>
      </ol>
    </figure>
  );
}
