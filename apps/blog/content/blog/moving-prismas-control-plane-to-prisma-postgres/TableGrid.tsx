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

type SquareState = "source" | "excluded" | "waiting" | "copying" | "ready" | "verified" | "live";

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
  if (step === 1) return "waiting";
  if (step === 2) {
    const pos = COPY_ORDER.indexOf(index);
    if (pos < readyCount) return "ready";
    if (pos < readyCount + 2) return "copying";
    return "waiting";
  }
  if (HASH_EQUAL.has(index)) return "verified";
  if (HASH_LIVE.has(index)) return "live";
  return "ready";
}

const CAPTIONS = [
  "83 tables on RDS",
  "82 tables in the publication; the migrations table stays out",
  "Initial copy, two tables at a time",
  "Row counts equal on every table; row hashes checked on four",
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
    squares.push(
      <span
        key={i}
        className="cp-sq"
        data-state={state}
        data-wide={wide ? "true" : undefined}
        title={
          i === WEBHOOK_EVENTS
            ? "GithubWebhookEvent, about 50 GB"
            : i === USAGE_MEASUREMENTS
              ? "UsageResourceMeasurement, about 6.5 GB"
              : i === MIGRATIONS
                ? "_prisma_migrations, not replicated"
                : undefined
        }
      />,
    );
  }

  const ready = step >= 3 ? 82 : step === 2 ? readyCount : 0;

  return (
    <figure className="cp-grid-figure">
      <div className="cp-grid" role="img" aria-label={CAPTIONS[step]}>
        {squares}
      </div>
      <figcaption className="cp-grid-caption">
        <span>{CAPTIONS[step]}</span>
        {step >= 2 ? <span className="cp-grid-count">{ready} / 82 ready</span> : null}
      </figcaption>
      <div className="cp-legend" aria-hidden="true">
        <span>
          <i data-state="source" /> on RDS
        </span>
        <span>
          <i data-state="copying" /> copying
        </span>
        <span>
          <i data-state="ready" /> replicated
        </span>
        <span>
          <i data-state="verified" /> hash equal
        </span>
        <span>
          <i data-state="live" /> written every login
        </span>
        <span>
          <i data-state="excluded" /> left out
        </span>
      </div>
    </figure>
  );
}

const STEPS = [
  {
    id: "source",
    title: "Start with what is there",
    body: (
      <p>
        The control plane schema had 83 tables and 204 applied migrations. Two of those tables held
        most of the bytes, which the migration spec had not accounted for. More on that below.
      </p>
    ),
  },
  {
    id: "publish",
    title: "Publish 82 of the 83",
    body: (
      <p>
        The one table we left out of the publication was Prisma&rsquo;s own migration history. CI
        had already applied every migration to the new database, so copying that table would have
        failed on duplicate keys. Everything else went in by name.
      </p>
    ),
  },
  {
    id: "copy",
    title: "Let Postgres copy, two tables at a time",
    body: (
      <p>
        Creating the subscription starts the initial copy. Each table moves through waiting,
        copying, catch-up, and ready. We watched the state counts, the error counters, and the WAL
        pinned on the source. All 82 tables reached ready the same day with zero errors.
      </p>
    ),
  },
  {
    id: "verify",
    title: "Count every row on both sides",
    body: (
      <p>
        One query counted every table on both databases and returned only the mismatches. It
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
