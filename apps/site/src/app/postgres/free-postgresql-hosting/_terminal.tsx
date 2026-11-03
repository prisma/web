"use client";

import { useState, type KeyboardEvent } from "react";
import { OpenAILogo } from "../../stack/agent-logos";
import {
  CREATE_DB_COMMAND,
  FREE_POSTGRES_CLAUDE,
  FREE_POSTGRES_CLI_CLAIM_URL,
  FREE_POSTGRES_CLI_CONNECTION,
  FREE_POSTGRES_CODEX,
  FREE_POSTGRES_COPILOT,
  FREE_POSTGRES_CURSOR,
  FREE_POSTGRES_CONNECTION_EXAMPLE,
  FREE_POSTGRES_STEP_CLAIM,
  FREE_POSTGRES_STEP_CONNECTION,
  FREE_POSTGRES_STEP_CREATING,
  FREE_POSTGRES_TERMINAL_CLAIM,
  FREE_POSTGRES_TERMINAL_STATUS,
  FREE_POSTGRES_TERMINAL_TABS,
} from "./_content";
import styles from "./_terminal.module.css";

// Same frame as the product tour card. Free page only. The plain terminal is
// the default tab. Switching tabs replays that session.
const FRAME =
  "flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]";

type Tab = (typeof FREE_POSTGRES_TERMINAL_TABS)[number];

export function FreePostgresTerminal() {
  const [tab, setTab] = useState<Tab>(FREE_POSTGRES_TERMINAL_TABS[0]);
  const [run, setRun] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const select = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    setSkipped(false);
    setRun((value) => value + 1);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setSkipped(true);
      return;
    }
    const index = FREE_POSTGRES_TERMINAL_TABS.indexOf(tab);
    const delta =
      event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowLeft"
          ? -1
          : event.key === "Home"
            ? -index
            : event.key === "End"
              ? FREE_POSTGRES_TERMINAL_TABS.length - 1 - index
              : 0;
    if (!delta) return;
    event.preventDefault();
    const next =
      FREE_POSTGRES_TERMINAL_TABS[
        (index + delta + FREE_POSTGRES_TERMINAL_TABS.length) % FREE_POSTGRES_TERMINAL_TABS.length
      ];
    select(next);
    queueMicrotask(() => {
      document.getElementById(`free-pg-tab-${next}`)?.focus();
    });
  };

  return (
    <figure className={FRAME}>
      <div className="flex items-center border-b border-border/70 bg-muted/40">
        <div
          role="tablist"
          aria-label="Run npx create-db"
          onKeyDown={onTabKeyDown}
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2 py-2"
        >
          {FREE_POSTGRES_TERMINAL_TABS.map((name) => {
            const selected = name === tab;
            return (
              <button
                key={name}
                type="button"
                role="tab"
                id={`free-pg-tab-${name}`}
                aria-selected={selected}
                aria-controls="free-pg-terminal-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(name)}
                className={
                  selected
                    ? "shrink-0 whitespace-nowrap rounded-md bg-card px-2.5 py-1 text-sm font-medium text-foreground shadow-sm"
                    : "shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground"
                }
              >
                {name}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            if (skipped) {
              setSkipped(false);
              setRun((value) => value + 1);
              return;
            }
            setSkipped(true);
          }}
          className="mr-2 shrink-0 rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground"
        >
          {skipped ? "Replay" : "Skip"}
        </button>
      </div>
      <div
        role="tabpanel"
        id="free-pg-terminal-panel"
        aria-labelledby={`free-pg-tab-${tab}`}
        className={`${styles.log} ${skipped ? styles.skipped : ""} px-4 py-4 text-foreground sm:px-5 sm:py-5`}
      >
        <div key={`${tab}-${run}`}>
          {tab === "Claude" ? (
            <ClaudeSession />
          ) : tab === "Codex" ? (
            <CodexSession />
          ) : tab === "Cursor" ? (
            <CursorSession />
          ) : tab === "Copilot" ? (
            <CopilotSession />
          ) : (
            <PlainTerminal />
          )}
        </div>
      </div>
    </figure>
  );
}

function PlainTerminal() {
  return (
    <>
      <p className={styles.row}>
        <span className="text-muted-foreground">$ </span>
        <span className={styles.typed}>{CREATE_DB_COMMAND}</span>
        <span className={styles.caret} aria-hidden="true" />
      </p>
      <div className={`${styles.reveal} ${styles.beat1}`}>
        <div className={`${styles.inner} ${styles.follow}`}>
          <p className={styles.label}>{FREE_POSTGRES_STEP_CREATING}</p>
          <p className="text-muted-foreground">{FREE_POSTGRES_TERMINAL_STATUS}</p>
        </div>
      </div>
      <div className={`${styles.reveal} ${styles.beat2}`}>
        <div className={`${styles.inner} ${styles.follow}`}>
          <p className={styles.label}>{FREE_POSTGRES_STEP_CONNECTION}</p>
          <p className={styles.wrap}>{FREE_POSTGRES_CLI_CONNECTION}</p>
          <p className="text-muted-foreground">{FREE_POSTGRES_CONNECTION_EXAMPLE}</p>
        </div>
      </div>
      <div className={`${styles.reveal} ${styles.beat3}`}>
        <div className={`${styles.inner} ${styles.follow}`}>
          <p className={styles.label}>{FREE_POSTGRES_STEP_CLAIM}</p>
          <p className="text-muted-foreground">{FREE_POSTGRES_TERMINAL_CLAIM}</p>
        </div>
      </div>
      <div className={`${styles.reveal} ${styles.beat4}`}>
        <p className={`${styles.inner} ${styles.follow} ${styles.wrap}`}>
          {FREE_POSTGRES_CLI_CLAIM_URL}
        </p>
      </div>
    </>
  );
}

function ClaudeSession() {
  return (
    <div className={styles.session}>
      <div className={styles.header}>
        <ClaudeMascot />
        <div>
          <div className={styles.product}>{FREE_POSTGRES_CLAUDE.product}</div>
          <div className={`${styles.meta} text-muted-foreground`}>
            <span>{FREE_POSTGRES_CLAUDE.model}</span>
            <span>{FREE_POSTGRES_CLAUDE.directory}</span>
          </div>
        </div>
      </div>
      <div className={styles.promptRow}>
        <span className={styles.prompt} aria-hidden="true">
          ❯
        </span>
        <span className={`${styles.typed} ${styles.typedLate}`}>{CREATE_DB_COMMAND}</span>
        <span className={styles.caret} aria-hidden="true" />
      </div>
      <div className={`${styles.reveal} ${styles.toolBeat}`}>
        <p className={`${styles.inner} ${styles.toolLine}`}>
          <span className={styles.dot} aria-hidden="true">
            ●
          </span>{" "}
          {FREE_POSTGRES_CLAUDE.tool}
        </p>
      </div>
      <div className={`${styles.reveal} ${styles.replyBeat}`}>
        <CreatedReply
          created={FREE_POSTGRES_CLAUDE.created}
          connectionLabel={FREE_POSTGRES_CLAUDE.connectionLabel}
          region={FREE_POSTGRES_CLAUDE.region}
          claim={FREE_POSTGRES_CLAUDE.claim}
        />
      </div>
    </div>
  );
}

// Claw'd, traced from the reference: a 12 by 8 pixel creature. Square head,
// two black square eyes, a body that steps out, four short legs. No face.
function ClaudeMascot() {
  return (
    <svg viewBox="0 0 12 8" aria-hidden="true" className={styles.mascot}>
      <g fill="#D97757">
        <rect x="2" y="0" width="8" height="1" />
        <rect x="2" y="1" width="1" height="1" />
        <rect x="4" y="1" width="4" height="1" />
        <rect x="9" y="1" width="1" height="1" />
        <rect x="0" y="2" width="12" height="2" />
        <rect x="2" y="4" width="8" height="2" />
        <rect x="2" y="6" width="1" height="2" />
        <rect x="4" y="6" width="1" height="2" />
        <rect x="7" y="6" width="1" height="2" />
        <rect x="9" y="6" width="1" height="2" />
      </g>
      <rect x="3" y="1" width="1" height="1" fill="#111111" />
      <rect x="8" y="1" width="1" height="1" fill="#111111" />
    </svg>
  );
}

function CodexSession() {
  return (
    <div className={styles.session}>
      <div className={styles.header}>
        <OpenAILogo className={styles.mark} />
        <div>
          <div className={styles.product}>{FREE_POSTGRES_CODEX.product}</div>
          <div className={`${styles.meta} text-muted-foreground`}>
            <span>{FREE_POSTGRES_CODEX.model}</span>
            <span>{FREE_POSTGRES_CODEX.directory}</span>
          </div>
        </div>
      </div>
      <div className={styles.promptRow}>
        <span className={styles.codexPrompt} aria-hidden="true">
          ›
        </span>
        <span className={`${styles.typed} ${styles.typedLate}`}>{CREATE_DB_COMMAND}</span>
        <span className={styles.caret} aria-hidden="true" />
      </div>
      <div className={`${styles.reveal} ${styles.toolBeat}`}>
        <div className={`${styles.inner} ${styles.shell}`}>
          <p className={styles.toolLine}>{FREE_POSTGRES_CODEX.tool}</p>
          <p className={`${styles.shellCommand} text-muted-foreground`}>$ {CREATE_DB_COMMAND}</p>
        </div>
      </div>
      <div className={`${styles.reveal} ${styles.replyBeat}`}>
        <CreatedReply
          created={FREE_POSTGRES_CODEX.created}
          connectionLabel={FREE_POSTGRES_CODEX.connectionLabel}
          region={FREE_POSTGRES_CODEX.region}
          claim={FREE_POSTGRES_CODEX.claim}
        />
      </div>
    </div>
  );
}

function CursorSession() {
  return (
    <div className={styles.session}>
      <div className={styles.header}>
        <CursorMark />
        <div>
          <div className={styles.product}>{FREE_POSTGRES_CURSOR.product}</div>
          <div className={`${styles.meta} text-muted-foreground`}>
            <span>{FREE_POSTGRES_CURSOR.mode}</span>
            <span>{FREE_POSTGRES_CURSOR.directory}</span>
          </div>
        </div>
      </div>
      <div className={styles.userBubble}>
        <span className={`${styles.typed} ${styles.typedLate}`}>{CREATE_DB_COMMAND}</span>
        <span className={styles.caret} aria-hidden="true" />
      </div>
      <div className={`${styles.reveal} ${styles.toolBeat}`}>
        <p className={`${styles.inner} ${styles.toolLine}`}>{FREE_POSTGRES_CURSOR.tool}</p>
      </div>
      <div className={`${styles.reveal} ${styles.replyBeat}`}>
        <CreatedReply
          created={FREE_POSTGRES_CURSOR.created}
          connectionLabel={FREE_POSTGRES_CURSOR.connectionLabel}
          region={FREE_POSTGRES_CURSOR.region}
          claim={FREE_POSTGRES_CURSOR.claim}
        />
      </div>
    </div>
  );
}

function CopilotSession() {
  return (
    <div className={styles.session}>
      <div className={styles.header}>
        <CopilotMark />
        <div>
          <div className={styles.product}>{FREE_POSTGRES_COPILOT.product}</div>
          <div className={`${styles.meta} text-muted-foreground`}>
            <span>{FREE_POSTGRES_COPILOT.mode}</span>
            <span>{FREE_POSTGRES_COPILOT.directory}</span>
          </div>
        </div>
      </div>
      <div className={styles.copilotBubble}>
        <span className={`${styles.typed} ${styles.typedLate}`}>{CREATE_DB_COMMAND}</span>
        <span className={styles.caret} aria-hidden="true" />
      </div>
      <div className={`${styles.reveal} ${styles.toolBeat}`}>
        <p className={`${styles.inner} ${styles.toolLine}`}>{FREE_POSTGRES_COPILOT.tool}</p>
      </div>
      <div className={`${styles.reveal} ${styles.replyBeat}`}>
        <CreatedReply
          created={FREE_POSTGRES_COPILOT.created}
          connectionLabel={FREE_POSTGRES_COPILOT.connectionLabel}
          region={FREE_POSTGRES_COPILOT.region}
          claim={FREE_POSTGRES_COPILOT.claim}
        />
      </div>
    </div>
  );
}

function CreatedReply({
  created,
  connectionLabel,
  region,
  claim,
}: {
  created: string;
  connectionLabel: string;
  region: string;
  claim: string;
}) {
  return (
    <div className={`${styles.reply} ${styles.inner}`}>
      <p>
        <span className={styles.label}>{FREE_POSTGRES_STEP_CREATING}</span>
        {created}
      </p>
      <p>
        <span className={styles.label}>{connectionLabel}</span>
        <span className={styles.wrap}>{FREE_POSTGRES_CLI_CONNECTION}</span>
      </p>
      <p className="text-muted-foreground">{FREE_POSTGRES_CONNECTION_EXAMPLE}</p>
      <p>Region: {region}</p>
      <p>
        <span className={styles.label}>{FREE_POSTGRES_STEP_CLAIM}</span>
        {claim}
      </p>
      <p className={styles.wrap}>{FREE_POSTGRES_CLI_CLAIM_URL}</p>
    </div>
  );
}

function CursorMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.mark}>
      <path
        fill="#111111"
        d="M4.2 3.2 19.6 11c.9.5.8 1.8-.2 2.1l-6.4 1.9-2 6.3c-.3 1-1.6 1.1-2.1.2L3.2 5.4c-.5-.9.4-1.9 1-2.2Z"
      />
    </svg>
  );
}

function CopilotMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.mark}>
      <path
        fill="#24292f"
        d="M6 3.5h8.2c2.4 0 4.3 1.9 4.3 4.3v5.4c0 2.4-1.9 4.3-4.3 4.3H10l-3.6 2.6v-2.6H6c-2.4 0-4.3-1.9-4.3-4.3V7.8C1.7 5.4 3.6 3.5 6 3.5Z"
      />
      <path fill="#ffffff" d="M6.2 9.2h2v2h-2zm3.6 0h2v2h-2zm3.6 0h2v2h-2z" />
    </svg>
  );
}
