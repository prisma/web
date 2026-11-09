type Kind = "plain" | "stream" | "bad";

function Arrow(props: { x1: number; y1: number; x2: number; y2: number; kind?: Kind }) {
  const { x1, y1, x2, y2, kind = "plain" } = props;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const corner = (offset: number) =>
    `${(x2 - 7 * Math.cos(angle + offset)).toFixed(1)},${(y2 - 7 * Math.sin(angle + offset)).toFixed(1)}`;
  return (
    <g className="cp-drift-arrow" data-kind={kind}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polygon points={`${x2},${y2} ${corner(0.45)} ${corner(-0.45)}`} />
    </g>
  );
}

function Panel(props: { title: string; caption: string; broken: boolean }) {
  const { title, caption, broken } = props;
  return (
    <div className="cp-drift-panel">
      <p className="cp-drift-title">{title}</p>
      <svg viewBox="0 0 360 220" role="img" aria-label={caption}>
        <rect className="cp-drift-box" x="115" y="6" width="130" height="30" rx="6" />
        <text className="cp-drift-text" x="180" y="25">
          New migration
        </text>
        <Arrow x1={150} y1={36} x2={79} y2={70} />
        <Arrow x1={210} y1={36} x2={281} y2={70} />

        <rect className="cp-drift-box" x="14" y="72" width="130" height="42" rx="6" />
        <text className="cp-drift-text" x="79" y="90">
          CI migration job
        </text>
        <text className="cp-drift-sub" x="79" y="104">
          for RDS
        </text>
        <rect className="cp-drift-box" x="216" y="72" width="130" height="42" rx="6" />
        <text className="cp-drift-text" x="281" y="90">
          CI migration job
        </text>
        <text className="cp-drift-sub" x="281" y="104">
          for Prisma Postgres
        </text>

        {broken ? (
          <>
            <Arrow x1={79} y1={114} x2={250} y2={158} kind="bad" />
            <text className="cp-drift-sub" data-kind="bad" x="79" y="142">
              wrong target
            </text>
          </>
        ) : (
          <Arrow x1={79} y1={114} x2={79} y2={158} />
        )}
        <Arrow x1={281} y1={114} x2={281} y2={158} />

        <rect
          className="cp-drift-box"
          data-db="rds"
          x="14"
          y="160"
          width="130"
          height="52"
          rx="6"
        />
        <text className="cp-drift-text" x="79" y="181">
          RDS
        </text>
        <text className="cp-drift-sub" data-kind={broken ? "bad" : undefined} x="79" y="198">
          {broken ? "new columns missing" : "has the new columns"}
        </text>
        <rect
          className="cp-drift-box"
          data-db="ppg"
          x="216"
          y="160"
          width="130"
          height="52"
          rx="6"
        />
        <text className="cp-drift-text" x="281" y="181">
          Prisma Postgres
        </text>
        <text className="cp-drift-sub" x="281" y="198">
          has the new columns
        </text>

        <Arrow x1={216} y1={186} x2={146} y2={186} kind={broken ? "bad" : "stream"} />
        <text className="cp-drift-sub" data-kind={broken ? "bad" : "stream"} x="180" y="178">
          {broken ? "stopped" : "rows"}
        </text>
      </svg>
      <p className="cp-drift-caption">{caption}</p>
    </div>
  );
}

/** Two static panels: how a migration was meant to reach both databases, and what happened on cutover day. */
export function SchemaDrift() {
  return (
    <figure className="cp-drift not-prose">
      <Panel
        title="The plan"
        broken={false}
        caption="Each database has its own CI migration job, so both get the new columns and the reverse stream keeps running."
      />
      <Panel
        title="Cutover day"
        broken
        caption="Both jobs ran against Prisma Postgres. RDS did not get the new columns, and the reverse stream stopped until we added them by hand."
      />
    </figure>
  );
}
