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

const GAME_COMPONENTS: Record<ArcadeGameId, ComponentType<GameProps>> = {
  snake: SnakeGame,
  invaders: InvadersGame,
  stacker: StackerGame,
  muncher: MuncherGame,
  meteors: MeteorsGame,
};

const CARD_SURFACE =
  "rounded-square-high border border-stroke-neutral bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]";

export function ArcadeExperience({
  /** next/font variable class providing --font-arcade; also applied to the
   *  play dialog, which portals outside this subtree. */
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

  return (
    <main className={`${fontClass} flex-1 bg-background-default text-foreground-neutral`}>
      {/* ===== 1. HERO + FEATURED GAME + LEADERBOARD ===== */}
      <section className="relative -mt-24 overflow-hidden px-4 pb-14 pt-40 md:pb-20">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/illustrations/homepage/footer_grid.svg')] opacity-60" />
        <div className="relative z-2 mx-auto flex w-full max-w-296 flex-col gap-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="type-title-sm flex items-center gap-2 text-foreground-ppg">
              <i className="fa-regular fa-gamepad" aria-hidden />
              Prisma Arcade
            </span>
            <h1 className="type-title-5xl m-0 text-balance">Take a break. Set a record.</h1>
            <p className="m-0 text-lg text-foreground-neutral-weak">
              Six tiny games built by the Prisma team. Fly Comet Cat, climb the leaderboard, and
              keep an eye on the $500 Prisma-credits high-score contest.
            </p>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
            <div className={`flex flex-col gap-4 p-5 shadow-box-low md:p-6 ${CARD_SURFACE}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="type-title-lg m-0 text-foreground-neutral">Comet Cat</h2>
                <p className="m-0 text-sm text-foreground-neutral-weak">
                  Flap. Drift. Leave a trail.
                </p>
              </div>
              <CometCatGame hiScore={hiScores[COMET_ID] ?? 0} onGameOver={onCometGameOver} />
            </div>

            <Leaderboard
              entries={entries}
              pendingScore={pendingScore}
              lastClaimedAt={lastClaimedAt}
              onClaim={claimScore}
            />
          </div>
        </div>
      </section>

      {/* ===== 2. MORE GAMES ===== */}
      <section className="px-4 py-14 md:py-20" aria-label="More games">
        <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="type-title-sm text-foreground-ppg">Free play</span>
            <h2 className="type-title-4xl m-0 text-balance text-foreground-neutral">
              The back row
            </h2>
            <p className="m-0 text-lg text-foreground-neutral-weak">
              Five more machines, no quarters required. Personal bests live in your browser.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GAMES.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setActiveGame(game)}
                  style={{ "--game-color": game.color } as React.CSSProperties}
                  className={`group flex cursor-pointer flex-col gap-3 p-5 text-left transition-colors hover:border-stroke-ppg/50 focus-visible:outline-2 focus-visible:outline-stroke-ppg ${CARD_SURFACE}`}
                >
                  <span className={styles.cardScreen}>
                    <PixelSprite sprite={game.sprite} label={`${game.title} pixel art`} />
                  </span>
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="type-heading-md text-foreground-neutral">{game.title}</span>
                    <span className="font-mono text-xs text-foreground-neutral-weak">
                      BEST {formatScore(hiScores[game.id] ?? 0)}
                    </span>
                  </span>
                  <span className="text-sm text-foreground-neutral-weak">{game.tagline}</span>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-foreground-ppg">
                    Play
                    <i
                      className="fa-regular fa-arrow-right transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 3. CLOSING ===== */}
      <section className="px-4 pb-20">
        <Reveal className="mx-auto flex w-full max-w-296 flex-col items-center gap-3 text-center">
          <p className="m-0 text-sm text-foreground-neutral-weak">
            Shipped between deploys. When you're done playing,{" "}
            <Link href="/stack" className="text-foreground-ppg underline underline-offset-2">
              see what we build the rest of the time
            </Link>
            .
          </p>
        </Reveal>
      </section>

      <Dialog open={activeGame !== null} onOpenChange={(open) => !open && setActiveGame(null)}>
        <DialogContent className={`${fontClass} max-w-[600px] gap-4`}>
          {activeGame && ActiveGame && (
            <>
              <DialogHeader>
                <DialogTitle>{activeGame.title}</DialogTitle>
                <DialogDescription>
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
