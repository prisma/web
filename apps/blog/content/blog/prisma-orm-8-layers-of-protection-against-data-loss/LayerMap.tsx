import { Ban, ShieldCheck } from "lucide-react";

export type RemovedCommand = {
  /** The Prisma ORM 7 command or feature, as you would type or name it. */
  name: string;
  /** What it did to a database. */
  did: string;
  /** Set when `name` is a command, so it renders as code. */
  code?: boolean;
};

export type Guardrail = {
  heading: string;
  /** One sentence a reader can take in without opening the section. */
  summary: string;
  /** Set when the guardrail does nothing until you turn it on. */
  optIn?: boolean;
  /** The section of the post that covers this guardrail. */
  href: string;
};

type Props = {
  label: string;
  removed: RemovedCommand[];
  guardrails: Guardrail[];
};

// Two groups, both visible at once: what Prisma ORM 8 took away, and what it
// added to the commands that remain. The figure needs no interaction and no
// script.
export function LayerMap({ label, removed, guardrails }: Props) {
  return (
    <figure className="layers not-prose" aria-label={label}>
      <div className="layers-group" data-kind="removed">
        <p className="layers-group-title">
          <Ban size={16} aria-hidden="true" />
          Removed: ways to wipe a database
        </p>
        <ul className="layers-list">
          {removed.map((item) => (
            <li key={item.name} className="layers-card">
              <span className="layers-card-title" data-removed="true">
                {item.code ? <code>{item.name}</code> : item.name}
              </span>
              <p className="layers-card-summary">{item.did}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="layers-group" data-kind="added">
        <p className="layers-group-title">
          <ShieldCheck size={16} aria-hidden="true" />
          Added: guardrails on the commands that remain
        </p>
        <ul className="layers-list">
          {guardrails.map((item) => (
            <li key={item.heading} className="layers-card">
              <span className="layers-card-head">
                <a className="layers-card-title" href={item.href}>
                  {item.heading}
                </a>
                {item.optIn && <span className="layers-chip">Opt-in</span>}
              </span>
              <p className="layers-card-summary">{item.summary}</p>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
