"use client";

/**
 * The Comet Cat hall of fame. Scores are stored in localStorage for now — the
 * site has no database, and the global leaderboard is planned to land together
 * with the prize contest. The panel is written so only the storage helpers
 * need to change when a backend arrives: the UI already deals in ranked
 * {initials, score} entries.
 */

import { useCallback, useState, type FormEvent } from "react";
import { formatScore } from "./game-kit";
import styles from "./arcade.module.css";

const LEADERBOARD_KEY = "prisma-arcade-comet-leaderboard";
const INITIALS_KEY = "prisma-arcade-initials";
export const MAX_ENTRIES = 10;

const ORDINALS = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH", "10TH"];

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
    <aside aria-label="Comet Cat hall of fame" className={styles.hallOfFame}>
      <div className={styles.hallHead}>
        <h2 className={styles.hallTitle}>★ HALL OF FAME ★</h2>
        <span className={styles.hallGame}>COMET CAT</span>
      </div>

      <p className={styles.prizeBanner}>
        <span aria-hidden>🏆</span>
        <span>
          WIN $500 IN PRISMA CREDITS. TOP PILOT TAKES THE PRIZE WHEN THE CONTEST GOES LIVE.
        </span>
      </p>

      {pendingScore !== null && (
        <form onSubmit={submit} className={styles.claimForm}>
          <label htmlFor="arcade-initials" className={styles.claimLabel}>
            YOU MADE THE BOARD WITH{" "}
            <span className={styles.claimScore}>{formatScore(pendingScore)}</span>. INITIALS?
          </label>
          <input
            id="arcade-initials"
            value={initials}
            onChange={(event) => setInitials(sanitizeInitials(event.target.value))}
            maxLength={3}
            autoComplete="off"
            spellCheck={false}
            placeholder="AAA"
            className={styles.initialsInput}
          />
          <button type="submit" className={styles.claimBtn}>
            SAVE
          </button>
        </form>
      )}

      <ol className={styles.hallRows} aria-label="Top ten scores">
        {rows.map((entry, i) => {
          const rowClass = [
            styles.hallRow,
            entry === null ? styles.empty : "",
            entry !== null && i === 0 ? styles.top : "",
            entry !== null && entry.at === lastClaimedAt ? styles.claimed : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={entry ? entry.at : `empty-${i}`} className={rowClass}>
              <span>{ORDINALS[i]}</span>
              <span className={styles.hallInitials}>{entry ? entry.initials : "– – –"}</span>
              <span>{entry ? formatScore(entry.score) : "······"}</span>
            </li>
          );
        })}
      </ol>

      <p className={styles.hallNote}>
        Scores are saved in your browser for now; the global leaderboard arrives with the contest.
        The prize is awarded as Prisma Data Platform credit, with contest details to follow.
      </p>
    </aside>
  );
}
