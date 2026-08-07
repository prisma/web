"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GAMES, type ArcadeGame } from "../games";
import { PixelSprite } from "./pixel-sprite";
import { SnakeGame } from "./snake-game";
import { InvadersGame } from "./invaders-game";
import { StackerGame } from "./stacker-game";
import { MuncherGame } from "./muncher-game";
import { MeteorsGame } from "./meteors-game";
import { CometCatGame } from "./comet-cat-game";
import styles from "./arcade.module.css";

const HI_SCORE_STORAGE_KEY = "prisma-arcade-hiscores";

type GameProps = { hiScore: number; onGameOver: (score: number) => void };

const GAME_COMPONENTS: Record<string, React.ComponentType<GameProps>> = {
  snake: SnakeGame,
  invaders: InvadersGame,
  stacker: StackerGame,
  muncher: MuncherGame,
  meteors: MeteorsGame,
  comet: CometCatGame,
};

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const TICKER_ITEMS = [
  "★ WELCOME TO THE PRISMA ARCADE ★",
  "6 GAMES ★ FREE PLAY",
  "GLOBAL HIGH SCORES COMING SOON",
  "NO QUARTERS REQUIRED",
  "TYPE-SAFE SINCE 2016",
  "WINNERS DON'T USE RAW SQL... USUALLY",
];

function formatScore(score: number) {
  return score.toString().padStart(6, "0");
}

/** Chunky 8-bit coin blip via WebAudio — no assets needed. */
function playCoinSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(988, ctx.currentTime);
    osc.frequency.setValueAtTime(1319, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
    osc.onended = () => ctx.close();
  } catch {
    // Autoplay policy or no AudioContext — the arcade stays silent.
  }
}

export function ArcadeScreen() {
  const [credits, setCredits] = useState(0);
  const [activeGame, setActiveGame] = useState<ArcadeGame | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [cheatFlash, setCheatFlash] = useState(0);
  // Local hi-scores until the global leaderboard backend lands.
  const [hiScores, setHiScores] = useState<Record<string, number>>({});
  const konamiProgress = useRef(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HI_SCORE_STORAGE_KEY);
      if (stored) setHiScores(JSON.parse(stored));
    } catch {
      // Corrupt or unavailable storage — start from zero.
    }
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

  const insertCoin = useCallback(() => {
    playCoinSound();
    setCredits((c) => c + 1);
  }, []);

  const openGame = useCallback(
    (game: ArcadeGame) => {
      if (credits <= 0) {
        setShakingId(game.id);
        window.setTimeout(() => setShakingId(null), 350);
        return;
      }
      setCredits((c) => c - 1);
      setActiveGame(game);
    },
    [credits],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveGame(null);
      }

      const expected = KONAMI[konamiProgress.current];
      if (event.key === expected || event.key.toLowerCase() === expected) {
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI.length) {
          konamiProgress.current = 0;
          setCredits((c) => c + 30);
          setCheatFlash((n) => n + 1);
        }
      } else {
        konamiProgress.current = event.key === KONAMI[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const tickerText = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className={styles.arcade}>
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
          <p className={`${styles.insertCoin} ${styles.blink}`}>INSERT COIN TO PLAY</p>
        </header>

        <div className={styles.coinRow}>
          <button type="button" className={styles.coinSlot} onClick={insertCoin}>
            [ INSERT COIN ]
          </button>
          <p className={styles.credits}>
            CREDITS <span className={styles.creditsCount}>{formatScore(credits)}</span>
          </p>
        </div>

        <section className={styles.cabinets} aria-label="Game selection">
          {GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              className={`${styles.cabinet} ${shakingId === game.id ? styles.shake : ""}`}
              style={{ "--game-color": game.color } as React.CSSProperties}
              onClick={() => openGame(game)}
            >
              <span className={styles.cabinetMarquee}>{game.title}</span>
              <span className={styles.cabinetScreen}>
                <PixelSprite sprite={game.sprite} label={`${game.title} pixel art`} />
                {game.status === "coming-soon" && (
                  <span className={`${styles.comingSoon} ${styles.blink}`}>COMING SOON</span>
                )}
              </span>
              <span className={styles.tagline}>{game.tagline}</span>
              <span className={styles.hiScore}>
                HI-SCORE{" "}
                <span className={styles.hiScoreValue}>
                  {formatScore(hiScores[game.id] ?? game.hiScore)}
                </span>
              </span>
              <span className={styles.startHint}>▶ PRESS START</span>
            </button>
          ))}
        </section>

        <section className={styles.hallOfFame} aria-label="Hall of fame">
          <h2 className={styles.hallTitle}>★ HALL OF FAME ★</h2>
          {[
            ["1ST", "???", "AWAITING CHALLENGER", 0],
            ["2ND", "???", "AWAITING CHALLENGER", 0],
            ["3RD", "???", "AWAITING CHALLENGER", 0],
          ].map(([rank, initials, note, score]) => (
            <div key={rank as string} className={styles.hallRow}>
              <span>{rank}</span>
              <span>{initials}</span>
              <span>{note}</span>
              <span>{formatScore(score as number)}</span>
            </div>
          ))}
          <p className={styles.hallNote}>
            Global leaderboards go live when the games do. Practice your initials.
          </p>
        </section>

        <Link href="/" className={styles.exitLink}>
          ◀ EXIT TO PRISMA.IO
        </Link>
      </div>

      {activeGame && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={activeGame.title}
          onClick={() => {
            // Click-away quit would be brutal mid-game; only for placeholders.
            if (activeGame.status === "coming-soon") setActiveGame(null);
          }}
        >
          <div
            className={styles.overlayScreen}
            style={{ "--game-color": activeGame.color } as React.CSSProperties}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.rollBar} aria-hidden />
            <p className={styles.overlayTitle}>{activeGame.title}</p>
            {activeGame.status === "playable" && GAME_COMPONENTS[activeGame.id] ? (
              (() => {
                const Game = GAME_COMPONENTS[activeGame.id];
                return (
                  <Game
                    hiScore={hiScores[activeGame.id] ?? 0}
                    onGameOver={(score) => reportScore(activeGame.id, score)}
                  />
                );
              })()
            ) : (
              <>
                <p className={`${styles.overlayComingSoon} ${styles.blink}`}>COMING SOON</p>
                <p className={styles.overlayBlurb}>{activeGame.blurb}</p>
                <div className={styles.overlayScores}>
                  <span>TODAY'S BEST — NOBODY YET</span>
                  <span>ALL-TIME BEST — COULD BE YOU</span>
                </div>
              </>
            )}
            <button type="button" className={styles.backBtn} onClick={() => setActiveGame(null)}>
              ◀ BACK [ESC]
            </button>
          </div>
        </div>
      )}

      {cheatFlash > 0 && (
        <p key={cheatFlash} className={styles.cheatFlash} aria-live="polite">
          CHEAT ACTIVATED! +30 CREDITS
        </p>
      )}

      <div className={styles.ticker} aria-hidden>
        <div className={styles.tickerTrack}>
          {tickerText.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      <div className={styles.crt} aria-hidden />
      <div className={styles.vignette} aria-hidden />
    </div>
  );
}
