"use client";

import { Scrolly } from "./Scrolly";

const SERVICES = [
  "Console",
  "Auth",
  "Management API",
  "Marketplaces",
  "MCP server",
  "GitHub webhook",
];

type Stream = "forward" | "none" | "reverse";

type Frame = {
  /** How many services write to Prisma Postgres. */
  moved: number;
  stream: Stream;
  streamLabel: string;
  slot: boolean;
  rdsStatus: string;
  ppgStatus: string;
  rdsStopped: boolean;
  when: string;
  caption: string;
};

const FRAMES: Frame[] = [
  {
    moved: 0,
    stream: "forward",
    streamLabel: "every write copied",
    slot: false,
    rdsStatus: "production",
    ppgStatus: "replica, following RDS",
    rdsStopped: false,
    when: "days before",
    caption:
      "Every service writes to RDS, and logical replication copies each write to Prisma Postgres.",
  },
  {
    moved: 0,
    stream: "forward",
    streamLabel: "every write copied",
    slot: true,
    rdsStatus: "production",
    ppgStatus: "replica, following RDS",
    rdsStopped: false,
    when: "minutes before",
    caption:
      "A rollback slot on Prisma Postgres starts keeping every write it receives from now on.",
  },
  {
    moved: SERVICES.length,
    stream: "forward",
    streamLabel: "last RDS writes copied",
    slot: true,
    rdsStatus: "last writes draining",
    ppgStatus: "production",
    rdsStopped: false,
    when: "merge",
    caption:
      "One merge, six deploys. Each service switches to Prisma Postgres as its deploy finishes.",
  },
  {
    moved: SERVICES.length,
    stream: "none",
    streamLabel: "",
    slot: true,
    rdsStatus: "quiet, no writes",
    ppgStatus: "production",
    rdsStopped: false,
    when: "+7 min",
    caption: "RDS has gone quiet, so the forward subscription is dropped.",
  },
  {
    moved: SERVICES.length,
    stream: "reverse",
    streamLabel: "app writes sent back",
    slot: true,
    rdsStatus: "replica, ready for rollback",
    ppgStatus: "production",
    rdsStopped: false,
    when: "+30 min",
    caption:
      "RDS subscribes to Prisma Postgres from the rollback slot without copying data, so rolling back is a config revert.",
  },
  {
    moved: SERVICES.length,
    stream: "none",
    streamLabel: "",
    slot: false,
    rdsStatus: "stopped",
    ppgStatus: "production",
    rdsStopped: true,
    when: "+1 week",
    caption: "A week later the reverse stream is dropped and RDS is stopped.",
  },
];

function Flow({ step }: { step: number }) {
  const f = FRAMES[step];
  const writesRds = f.moved < SERVICES.length;
  const writesPpg = f.moved > 0;
  return (
    <figure className="cp-flow-figure">
      <div className="cp-flow" data-stream={f.stream} role="img" aria-label={f.caption}>
        <div className="cp-flow-row-label">Six services</div>

        <ul className="cp-flow-services">
          {SERVICES.map((name, i) => (
            <li
              key={name}
              className="cp-flow-service"
              data-side={i < f.moved ? "ppg" : "rds"}
              style={{ transitionDelay: step === 2 ? `${i * 140}ms` : "0ms" }}
            >
              {name}
            </li>
          ))}
        </ul>

        <div className="cp-flow-writes" aria-hidden="true">
          <span className="cp-flow-write" data-db="rds" data-on={writesRds ? "true" : undefined}>
            <span>writes</span>
          </span>
          <span className="cp-flow-write" data-db="ppg" data-on={writesPpg ? "true" : undefined}>
            <span>writes</span>
          </span>
        </div>

        <div className="cp-flow-dbs">
          <div
            className="cp-flow-db"
            data-db="rds"
            data-stopped={f.rdsStopped ? "true" : undefined}
          >
            <span className="cp-flow-db-name">RDS</span>
            <span className="cp-flow-db-status">{f.rdsStatus}</span>
          </div>
          <div className="cp-flow-stream" aria-hidden="true">
            <span className="cp-flow-arrow" />
          </div>
          <div className="cp-flow-db" data-db="ppg">
            <span className="cp-flow-db-name">Prisma Postgres</span>
            <span className="cp-flow-db-status">{f.ppgStatus}</span>
            <span className="cp-flow-bookmark" data-on={f.slot ? "true" : undefined}>
              rollback slot
            </span>
          </div>
        </div>

        <span className="cp-flow-stream-label" aria-hidden="true">
          {f.streamLabel}
        </span>

        <ol className="cp-flow-timeline" aria-hidden="true">
          {FRAMES.map((frame, i) => (
            <li key={frame.when} data-state={i < step ? "past" : i === step ? "now" : "future"}>
              {frame.when}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="cp-grid-caption">
        <span>{f.caption}</span>
      </figcaption>
    </figure>
  );
}

const STEPS = [
  {
    id: "before",
    title: "Before the merge",
    body: (
      <p>
        Every service reads and writes RDS while Prisma Postgres follows along as a live replica.
        Nothing in production references the new database yet, so a problem on the new side cannot
        reach a user.
      </p>
    ),
  },
  {
    id: "slot",
    title: "Create the rollback slot",
    body: (
      <p>
        Minutes before the merge we create a logical replication slot on the new database. From this
        moment it keeps every write, so the rollback covers the whole cutover. Created days earlier,
        it would have held about one gigabyte of write-ahead log per hour for no benefit.
      </p>
    ),
  },
  {
    id: "merge",
    title: "Merge once, deploy six services",
    body: (
      <p>
        The merge deploys every service with its new connection config, so every connection path
        inside a service switches in the same deployment. The deploy jobs take a few minutes, and
        the forward stream keeps running during that time, so the last writes on RDS still reach
        Prisma Postgres. The apply error counter, which reports a key collision, stayed at zero.
      </p>
    ),
  },
  {
    id: "quiet",
    title: "Wait for RDS to go quiet",
    body: (
      <p>
        The last statement from any service ran on RDS seven minutes after the merge. A later
        sixty-second sample of the RDS write counters showed no inserts, updates, or deletes. Then
        we dropped the forward subscription.
      </p>
    ),
  },
  {
    id: "reverse",
    title: "Reverse the stream",
    body: (
      <p>
        RDS now subscribes to Prisma Postgres from the rollback slot with{" "}
        <code>copy_data = false</code>, since it already holds every row. With{" "}
        <code>origin = none</code> the subscription skips the rows that arrived through forward
        replication and sends back only what the application wrote. The two directions never run at
        the same time, and nothing is lost in the gap between them, because the slot has been
        retaining writes since before the merge.
      </p>
    ),
  },
  {
    id: "week",
    title: "Hold for a week, then let go",
    body: (
      <p>
        For a week, rolling back meant reverting one commit and deleting the new secrets. After a
        final comparison of the key tables we dropped the reverse subscription, took a snapshot, and
        stopped the RDS instances. From that point there is no rollback that keeps data.
      </p>
    ),
  },
];

export function CutoverFlow() {
  return (
    <Scrolly
      label="How the cutover and rollback window worked"
      steps={STEPS}
      visual={(active) => <Flow step={active} />}
    />
  );
}
