"use client";

/**
 * The Comet Cat leaderboard. Scores are stored in localStorage for now — the
 * site has no database, and the global leaderboard is planned to land together
 * with the prize contest. The panel is written so only the storage helpers
 * need to change when a backend arrives: the UI already deals in ranked
 * {initials, score} entries.
 */

import { Button } from "@prisma/eclipse";
import { useCallback, useState, type FormEvent } from "react";
import { formatScore } from "./game-kit";

const LEADERBOARD_KEY = "prisma-arcade-comet-leaderboard";
const INITIALS_KEY = "prisma-arcade-initials";
export const MAX_ENTRIES = 10;

export type LeaderboardEntry = {
  initials: string;
  score: number;
  /** Insertion timestamp — tiebreaker and row identity. */
  at: number;
};

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry): entry is LeaderboardEntry =>
          typeof entry === "object" &&
          entry !== null &&
          typeof (entry as LeaderboardEntry).initials === "string" &&
          typeof (entry as LeaderboardEntry).score === "number" &&
          typeof (entry as LeaderboardEntry).at === "number",
      )
      .sort((a, b) => b.score - a.score || a.at - b.at)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch {
    // Storage unavailable — the board still works for this session.
  }
}

export function loadInitials(): string {
  try {
    return localStorage.getItem(INITIALS_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveInitials(initials: string) {
  try {
    localStorage.setItem(INITIALS_KEY, initials);
  } catch {
    // Fine — the player just types them again next time.
  }
}

/** Whether a score would earn a spot on the board. */
export function qualifies(entries: LeaderboardEntry[], score: number) {
  if (score <= 0) return false;
  if (entries.length < MAX_ENTRIES) return true;
  return score > entries[entries.length - 1].score;
}

function sanitizeInitials(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3);
}

export function Leaderboard({
  entries,
  pendingScore,
  lastClaimedAt,
  onClaim,
}: {
  entries: LeaderboardEntry[];
  /** A fresh Comet Cat score awaiting initials, or null. */
  pendingScore: number | null;
  /** Timestamp of the most recently claimed entry, for the row highlight. */
  lastClaimedAt: number | null;
  onClaim: (initials: string) => void;
}) {
  const [initials, setInitials] = useState(loadInitials);

  const submit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const clean = sanitizeInitials(initials);
      if (clean.length === 0) return;
      saveInitials(clean);
      onClaim(clean);
    },
    [initials, onClaim],
  );

  const rows = Array.from({ length: MAX_ENTRIES }, (_, i) => entries[i] ?? null);

  return (
    <aside
      aria-label="Comet Cat leaderboard"
      className="flex h-full flex-col gap-4 rounded-square-high border border-stroke-neutral bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] p-5 shadow-box-low md:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="type-title-lg m-0 text-foreground-neutral">High scores</h2>
        <span className="font-mono text-xs uppercase tracking-wider text-foreground-neutral-weak">
          Comet Cat
        </span>
      </div>

      <div className="flex items-start gap-3 rounded-square border border-stroke-ppg/40 bg-background-ppg p-3 text-sm text-foreground-ppg-strong">
        <i className="fa-regular fa-trophy mt-0.5" aria-hidden />
        <p className="m-0">
          <strong>Win $500 in Prisma credits.</strong> The top Comet Cat pilot takes the prize when
          the high-score contest goes live. Start practicing now.
        </p>
      </div>

      {pendingScore !== null && (
        <form
          onSubmit={submit}
          className="flex flex-wrap items-center gap-3 rounded-square border border-stroke-ppg/40 bg-background-ppg/60 p-3"
        >
          <label htmlFor="arcade-initials" className="m-0 flex-1 text-sm text-foreground-neutral">
            You made the board with{" "}
            <strong className="font-mono">{formatScore(pendingScore)}</strong>. Initials?
          </label>
          <input
            id="arcade-initials"
            value={initials}
            onChange={(event) => setInitials(sanitizeInitials(event.target.value))}
            maxLength={3}
            autoComplete="off"
            spellCheck={false}
            placeholder="AAA"
            className="w-16 rounded-square border border-stroke-neutral-strong bg-background-default px-2 py-1.5 text-center font-mono text-sm uppercase tracking-widest text-foreground-neutral outline-none focus-visible:border-stroke-ppg"
          />
          <Button type="submit" variant="ppg" size="lg">
            Save
          </Button>
        </form>
      )}

      <ol className="m-0 flex list-none flex-col p-0" aria-label="Top ten scores">
        {rows.map((entry, i) => {
          const isClaimed = entry !== null && entry.at === lastClaimedAt;
          return (
            <li
              key={entry ? entry.at : `empty-${i}`}
              className={`grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 border-b border-stroke-neutral/60 py-2 font-mono text-sm last:border-b-0 ${
                isClaimed
                  ? "text-foreground-ppg-strong"
                  : entry
                    ? "text-foreground-neutral"
                    : "text-foreground-neutral-weaker"
              }`}
            >
              <span className={i < 3 && entry ? "font-bold text-foreground-ppg" : undefined}>
                {i + 1}.
              </span>
              <span className="tracking-[0.2em]">{entry ? entry.initials : "– – –"}</span>
              <span className="tabular-nums">{entry ? formatScore(entry.score) : "······"}</span>
            </li>
          );
        })}
      </ol>

      <p className="m-0 mt-auto text-xs text-foreground-neutral-weak">
        Scores are saved in your browser for now; the global leaderboard arrives with the contest.
        The prize is awarded as Prisma Data Platform credit, with contest details to follow.
      </p>
    </aside>
  );
}
