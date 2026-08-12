"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@prisma/eclipse";
import Link from "next/link";
import { useCallback, useEffect, useState, type ComponentType } from "react";
import { GAMES, type ArcadeGame, type ArcadeGameId } from "../games";
import { CometCatGame } from "./comet-cat-game";
import { formatScore, type GameProps } from "./game-kit";
import { InvadersGame } from "./invaders-game";
import {
  Leaderboard,
  loadLeaderboard,
  MAX_ENTRIES,
  qualifies,
  saveLeaderboard,
  type LeaderboardEntry,
} from "./leaderboard";
import { MeteorsGame } from "./meteors-game";
import { MuncherGame } from "./muncher-game";
import { PixelSprite } from "./pixel-sprite";
import { Reveal } from "./reveal";
import { SnakeGame } from "./snake-game";
import { StackerGame } from "./stacker-game";
import styles from "./arcade.module.css";

/** Per-game personal bests, kept per browser like the leaderboard. */
const HI_SCORE_STORAGE_KEY = "prisma-arcade-hiscores";
/** The featured game's key in the hi-score record. */
const COMET_ID = "comet";
const COMET_COLOR = "#7cdae1";

const GAME_COMPONENTS: Record<ArcadeGameId, ComponentType<GameProps>> = {
  snake: SnakeGame,
  invaders: InvadersGame,
  stacker: StackerGame,
  muncher: MuncherGame,
  meteors: MeteorsGame,
};

const TICKER_ITEMS = [
  "★ WELCOME TO THE PRISMA ARCADE ★",
  "6 GAMES ★ FREE PLAY",
  "TOP PILOT WINS $500 IN PRISMA CREDITS",
  "NO QUARTERS REQUIRED",
  "TYPE-SAFE SINCE 2016",
  "WINNERS DON'T USE RAW SQL... USUALLY",
];

export function ArcadeExperience({
  /** next/font variable classes providing --font-arcade / --font-arcade-alt;
   *  also applied to the play dialog, which portals outside this subtree. */
  fontClass,
}: {
  fontClass: string;
}) {
  const [hiScores, setHiScores] = useState<Record<string, number>>({});
  const [activeGame, setActiveGame] = useState<ArcadeGame | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const [lastClaimedAt, setLastClaimedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HI_SCORE_STORAGE_KEY);
      if (stored) setHiScores(JSON.parse(stored));
    } catch {
      // Corrupt or unavailable storage — start from zero.
    }
    setEntries(loadLeaderboard());
  }, []);

  useEffect(() => {
    if (Object.keys(hiScores).length === 0) return;
    try {
      localStorage.setItem(HI_SCORE_STORAGE_KEY, JSON.stringify(hiScores));
    } catch {
      // Storage unavailable — scores still show for this session.
    }
  }, [hiScores]);

  const reportScore = useCallback((gameId: string, score: number) => {
    setHiScores((prev) => (score <= (prev[gameId] ?? 0) ? prev : { ...prev, [gameId]: score }));
  }, []);

  const onCometGameOver = useCallback(
    (score: number) => {
      reportScore(COMET_ID, score);
      if (!qualifies(entries, score)) return;
      // Keep the best unclaimed score if the player dies again before typing
      // their initials.
      setPendingScore((prev) => (prev !== null && prev >= score ? prev : score));
    },
    [reportScore, entries],
  );

  const claimScore = useCallback(
    (initials: string) => {
      if (pendingScore === null) return;
      const at = Date.now();
      const next = [...entries, { initials, score: pendingScore, at }]
        .sort((a, b) => b.score - a.score || a.at - b.at)
        .slice(0, MAX_ENTRIES);
      setEntries(next);
      saveLeaderboard(next);
      setPendingScore(null);
      setLastClaimedAt(at);
    },
    [pendingScore, entries],
  );

  const ActiveGame = activeGame ? GAME_COMPONENTS[activeGame.id] : null;
  const tickerText = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <main className={`${fontClass} ${styles.arcade}`}>
      <div className={styles.starsFar} aria-hidden />
      <div className={styles.stars} aria-hidden />
      <div className={styles.gridFloor} aria-hidden />

      <div className={styles.content}>
        <header className="flex flex-col items-center gap-5">
          <p className={styles.pretitle}>PRISMA PRESENTS</p>
          <h1 className={styles.title}>
            PRISMA
            <br />
            ARCADE
          </h1>
          <p className={`${styles.freePlay} ${styles.blink}`}>FREE PLAY ★ NO QUARTERS REQUIRED</p>
          <p className={styles.heroCopy}>
            Fly Comet Cat, climb the leaderboard, and warm up for the high-score contest: $500 in
            Prisma credits.
          </p>
        </header>

        <div className={styles.featuredGrid}>
          <section
            className={styles.featuredPanel}
            style={{ "--game-color": COMET_COLOR } as React.CSSProperties}
            aria-label="Comet Cat, the featured game"
          >
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>COMET CAT</h2>
              <p className={styles.panelTagline}>Flap. Drift. Leave a trail.</p>
            </div>
            <CometCatGame hiScore={hiScores[COMET_ID] ?? 0} onGameOver={onCometGameOver} />
          </section>

          <Leaderboard
            entries={entries}
            pendingScore={pendingScore}
            lastClaimedAt={lastClaimedAt}
            onClaim={claimScore}
          />
        </div>

        <section className="flex w-full flex-col items-center gap-8" aria-label="More games">
          <h2 className={styles.sectionTitle}>★ THE BACK ROW ★</h2>
          <Reveal className="w-full">
            <div className={styles.cabinets}>
              {GAMES.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setActiveGame(game)}
                  className={styles.cabinet}
                  style={{ "--game-color": game.color } as React.CSSProperties}
                >
                  <span className={styles.cabinetMarquee}>{game.title.toUpperCase()}</span>
                  <span className={styles.cabinetScreen}>
                    <PixelSprite sprite={game.sprite} label={`${game.title} pixel art`} />
                  </span>
                  <span className={styles.tagline}>{game.tagline}</span>
                  <span className={styles.hiScore}>
                    HI-SCORE{" "}
                    <span className={styles.hiScoreValue}>
                      {formatScore(hiScores[game.id] ?? 0)}
                    </span>
                  </span>
                  <span className={styles.startHint}>▶ PRESS START</span>
                </button>
              ))}
            </div>
          </Reveal>
        </section>

        <Link href="/" className={styles.exitLink}>
          ◀ EXIT TO PRISMA.IO
        </Link>
      </div>

      <div className={styles.ticker} aria-hidden>
        <div className={styles.tickerTrack}>
          {tickerText.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      <div className={styles.crt} aria-hidden />
      <div className={styles.vignette} aria-hidden />

      <Dialog open={activeGame !== null} onOpenChange={(open) => !open && setActiveGame(null)}>
        <DialogContent
          className={`${fontClass} ${styles.retroDialog} max-w-[600px] gap-4`}
          style={{ "--game-color": activeGame?.color } as React.CSSProperties}
        >
          {activeGame && ActiveGame && (
            <>
              <DialogHeader>
                <DialogTitle className={styles.dialogTitle}>
                  {activeGame.title.toUpperCase()}
                </DialogTitle>
                <DialogDescription className={styles.dialogTagline}>
                  {activeGame.tagline} {activeGame.controls}.
                </DialogDescription>
              </DialogHeader>
              <ActiveGame
                hiScore={hiScores[activeGame.id] ?? 0}
                onGameOver={(score) => reportScore(activeGame.id, score)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
