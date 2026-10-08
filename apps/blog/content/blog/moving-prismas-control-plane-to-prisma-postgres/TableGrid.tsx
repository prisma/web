"use client";

import { useEffect, useState } from "react";
import { Scrolly } from "./Scrolly";

const TABLE_COUNT = 83;
// The two tables that held most of the data, and the one left out of the copy.
const WEBHOOK_EVENTS = 0;
const USAGE_MEASUREMENTS = 1;
const MIGRATIONS = TABLE_COUNT - 1;
// Tables checked by full-row hash after the copy.
const HASH_EQUAL = new Set([33, 52]);
const HASH_LIVE = new Set([44, 67]);

type SquareState =
  | "source"
  | "excluded"
  | "published"
  | "copying"
  | "replicated"
  | "verified"
  | "live";

const COPY_ORDER: number[] = (() => {
  // Small tables first, the two wide ones last, in a fixed pseudo-random order
  // so the grid lights up across the whole surface rather than left to right.
  const small: number[] = [];
  for (let i = 2; i < MIGRATIONS; i += 1) small.push(i);
  let seed = 7;
  for (let i = small.length - 1; i > 0; i -= 1) {
    seed = (seed * 48271) % 2147483647;
    const j = seed % (i + 1);
    [small[i], small[j]] = [small[j], small[i]];
  }
  return [...small, USAGE_MEASUREMENTS, WEBHOOK_EVENTS];
})();

function stateFor(index: number, step: number, readyCount: number): SquareState {
  if (index === MIGRATIONS) return step === 0 ? "source" : "excluded";
  if (step === 0) return "source";
  if (step === 1) return "published";
  if (step === 2) {
    const pos = COPY_ORDER.indexOf(index);
    if (pos < readyCount) return "replicated";
    if (pos < readyCount + 2) return "copying";
    return "published";
  }
  if (HASH_EQUAL.has(index)) return "verified";
  if (HASH_LIVE.has(index)) return "live";
  return "replicated";
}

const CAPTIONS = [
  "83 tables on RDS",
  "82 tables in the publication, migrations table left out",
  "Initial copy, two tables at a time",
  "Counts equal everywhere, hashes checked on four",
];

const LEGEND: Array<{ state: SquareState; label: string; from: number }> = [
  { state: "source", label: "on RDS", from: 0 },
  { state: "excluded", label: "left out", from: 1 },
  { state: "published", label: "published, waiting", from: 1 },
  { state: "copying", label: "copying", from: 2 },
  { state: "replicated", label: "replicated", from: 2 },
  { state: "verified", label: "hash equal", from: 3 },
  { state: "live", label: "written every login", from: 3 },
];

function Grid({ step }: { step: number }) {
  const [readyCount, setReadyCount] = useState(0);

  useEffect(() => {
    if (step !== 2) {
      setReadyCount(step > 2 ? COPY_ORDER.length : 0);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setReadyCount(COPY_ORDER.length);
      return;
    }
    setReadyCount(0);
    let n = 0;
    const id = setInterval(() => {
      n += 2;
      setReadyCount(Math.min(n, COPY_ORDER.length));
      if (n >= COPY_ORDER.length) clearInterval(id);
    }, 110);
    return () => clearInterval(id);
  }, [step]);

  const squares = [];
  for (let i = 0; i < TABLE_COUNT; i += 1) {
    const state = stateFor(i, step, readyCount);
    const wide = i === WEBHOOK_EVENTS || i === USAGE_MEASUREMENTS;
    const label =
      i === WEBHOOK_EVENTS
        ? "webhook log"
        : i === USAGE_MEASUREMENTS
          ? "usage"
          : i === MIGRATIONS
            ? "migrations"
            : undefined;
    squares.push(
      <span
        key={i}
        className="cp-sq"
        data-state={state}
        data-wide={wide ? "true" : undefined}
        data-labelled={label ? "true" : undefined}
        title={
          i === WEBHOOK_EVENTS
            ? "GitHub webhook log, the largest table"
            : i === USAGE_MEASUREMENTS
              ? "Usage measurements, the second largest table"
              : i === MIGRATIONS
                ? "_prisma_migrations, not replicated"
                : undefined
        }
      >
        {label ? <small>{label}</small> : null}
      </span>,
    );
  }

  const ready = step >= 3 ? 82 : step === 2 ? readyCount : 0;

  return (
    <figure className="cp-grid-figure">
      <div className="cp-grid-head" data-active={step < 2 ? "rds" : "ppg"} aria-hidden="true">
        <span className="cp-grid-side" data-side="rds">
          RDS
        </span>
        <span className="cp-grid-arrow" />
        <span className="cp-grid-side" data-side="ppg">
          Prisma Postgres
        </span>
      </div>
      <div className="cp-grid" role="img" aria-label={CAPTIONS[step]}>
        {squares}
      </div>
      <figcaption className="cp-grid-caption">
        <span>{CAPTIONS[step]}</span>
        {step >= 2 ? <span className="cp-grid-count">{ready} / 82 replicated</span> : null}
      </figcaption>
      <div className="cp-legend" aria-hidden="true">
        {LEGEND.map((item) => (
          <span key={item.state} data-dim={item.from > step ? "true" : undefined}>
            <i data-state={item.state} /> {item.label}
          </span>
        ))}
      </div>
    </figure>
  );
}

const STEPS = [
  {
    id: "source",
    title: "83 tables on RDS",
    body: (
      <p>
        The control plane schema had 83 tables and 204 applied migrations. Two of those tables held
        most of the bytes, which the migration spec had not accounted for.
      </p>
    ),
  },
  {
    id: "publish",
    title: "Publish 82 of them",
    body: (
      <p>
        The one table we left out of the publication was Prisma&rsquo;s own migration history,
        because CI had already applied every migration to the new database and copying it would have
        failed on duplicate keys. Everything else went into the publication by name.
      </p>
    ),
  },
  {
    id: "copy",
    title: "Copy, two tables at a time",
    body: (
      <p>
        Creating the subscription starts the initial copy, and each table moves through waiting,
        copying, catch-up, and ready. We watched the state counts, the error counters, and the WAL
        pinned on the source, and all 82 tables reached ready the same day with zero errors.
      </p>
    ),
  },
  {
    id: "verify",
    title: "Compare every table",
    body: (
      <p>
        One query counted every table on both databases and returned only the mismatches, and it
        returned nothing. Full-row hashes matched on the tables that change slowly and differed on
        the two that are written on every login, because the two runs were seconds apart.
      </p>
    ),
  },
];

export function TableGrid() {
  return (
    <Scrolly
      label="How the 83 tables were replicated"
      steps={STEPS}
      visual={(active) => <Grid step={active} />}
    />
  );
}
