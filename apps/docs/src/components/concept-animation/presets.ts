import type { CSSProperties } from "react";

/**
 * A concept animation is a sequence of plain-text "diagram" states.
 * Code Hike's token transitions morph one state into the next, so tokens
 * that survive between steps slide to their new position instead of
 * re-rendering.
 *
 * Wrap tokens in `[[...]]` to emphasize them in the current step.
 */
export interface ConceptStep {
  /** Short label for this state, shown in the stepper so readers can jump to it. */
  title: string;
  code: string;
  caption: string;
}

export interface ConceptPreset {
  label: string;
  steps: ConceptStep[];
}

export const CONCEPT_PRESETS = {
  "compute-model": {
    label: "How Compute organizes resources and isolates branches",
    steps: [
      {
        title: "1. First deploy",
        code:
          "$ [[npx @prisma/cli@latest app deploy]]\n" +
          "  │\n" +
          "  ▼\n" +
          "project: my-app\n" +
          "└─ branch: main  (production)  → app + database",
        caption:
          "Run from your project directory, your first app deploy creates everything: the project (my-app), its production branch, and the app and database that run it. Nothing exists before this command.",
      },
      {
        title: "2. Preview branch",
        code:
          "$ [[npx @prisma/cli@latest app deploy --branch feature/login]]\n" +
          "  │\n" +
          "  ▼\n" +
          "project: my-app\n" +
          "├─ branch: main           (production)  → app + database\n" +
          "└─ branch: feature/login  (preview)     → app + database  [[← new copy]]",
        caption:
          "Deploy with a new branch name and Compute provisions a full copy of the infrastructure: feature/login gets its own app, database, and URL. Production stays untouched.",
      },
      {
        title: "3. Connect GitHub",
        code:
          "$ [[npx @prisma/cli@latest git connect]]\n" +
          "$ [[git push]]   # push feature/login\n" +
          "  │\n" +
          "  ▼\n" +
          "project: my-app  (connected → acme/shop)\n" +
          "├─ branch: main           ← git: main\n" +
          "└─ branch: feature/login  ← git: feature/login  [[deploys]]",
        caption:
          "Connect the repo once and you stop deploying by hand. Each Git branch maps to a branch by name, so pushing feature/login builds and deploys just that preview automatically.",
      },
      {
        title: "4. Ship to production",
        code:
          "$ [[git push]]   # merge to main\n" +
          "  │\n" +
          "  ▼\n" +
          "project: my-app\n" +
          "└─ branch: main  (production)  [[deployed]]",
        caption:
          "Merging to your default branch pushes to main and deploys to production. The merged preview branch is cleaned up, so only production keeps running.",
      },
    ],
  },
  "github-connection": {
    label: "How a GitHub connection deploys on push",
    steps: [
      {
        title: "1. Install the app",
        code:
          "$ [[npx @prisma/cli@latest git connect]]\n" +
          "  │\n" +
          "  ▼\n" +
          "workspace\n" +
          "└─ Prisma GitHub App installed",
        caption:
          "The first time you run git connect, the workspace installs the Prisma GitHub App. That installation is what lets Prisma see your repositories.",
      },
      {
        title: "2. Connect a repo",
        code:
          "$ [[npx @prisma/cli@latest git connect]]\n" +
          "  │\n" +
          "  ▼\n" +
          "workspace\n" +
          "└─ Prisma GitHub App installed\n" +
          "project: my-app  →  github.com/acme/shop",
        caption:
          "The same command connects this project to a single repository, so Prisma knows that github.com/acme/shop belongs to my-app.",
      },
      {
        title: "3. Push to deploy",
        code:
          "$ [[git push]]   # push feature/x\n" +
          "  │\n" +
          "  ▼\n" +
          "project: my-app  →  deploys branch [[feature/x]]",
        caption:
          "After that, every push builds the commit and deploys the matching branch, so your previews always track your Git branches.",
      },
    ],
  },
  "env-layers": {
    label: "How environment variables resolve",
    steps: [
      {
        title: "1. Production",
        code:
          "$ npx @prisma/cli@latest project env add \\\n" +
          "    DATABASE_URL=postgres://prod [[--role production]]\n" +
          "  │\n" +
          "  ▼\n" +
          "branch main resolves:\n" +
          "   DATABASE_URL = postgres://prod",
        caption:
          "Variables added with --role production apply to every production deploy, so the main branch resolves to exactly these values.",
      },
      {
        title: "2. Preview",
        code:
          "$ npx @prisma/cli@latest project env add \\\n" +
          "    DATABASE_URL=postgres://preview [[--role preview]]\n" +
          "  │\n" +
          "  ▼\n" +
          "branch feature/search resolves:\n" +
          "   DATABASE_URL = postgres://preview",
        caption:
          "Preview-scoped variables apply to every preview branch, so test traffic stays off production data. Any branch other than main resolves to this set.",
      },
      {
        title: "3. Branch override",
        code:
          "$ npx @prisma/cli@latest project env add \\\n" +
          "    FEATURE_FLAG=on [[--branch feature/search]]\n" +
          "  │\n" +
          "  ▼\n" +
          "branch feature/search resolves:\n" +
          "   DATABASE_URL = postgres://preview\n" +
          "   FEATURE_FLAG = on   [[← override]]",
        caption:
          "A branch override adds or replaces a value for one branch. feature/search keeps the shared preview DATABASE_URL but also gets FEATURE_FLAG=on, which no other branch sees.",
      },
    ],
  },
} satisfies Record<string, ConceptPreset>;

export type ConceptName = keyof typeof CONCEPT_PRESETS;

/** Code Hike token: plain text, or [text, color, style?]. */
export type ConceptToken = string | [string, string, CSSProperties?];

const EMPHASIS_COLOR = "var(--color-fd-primary)";

function pushWords(tokens: ConceptToken[], text: string, emphasized: boolean) {
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      tokens.push(part);
    } else {
      tokens.push([part, emphasized ? EMPHASIS_COLOR : "currentColor"]);
    }
  }
}

/**
 * Turn a `[[...]]`-annotated step into word-level Code Hike tokens.
 * Word-level granularity is what lets token transitions move each word
 * independently; Code Hike's own highlighter would merge same-colored
 * neighbors into one token and the animation would lose its shape.
 */
export function parseStepTokens(code: string): { tokens: ConceptToken[]; plain: string } {
  const tokens: ConceptToken[] = [];
  const emphasis = /\[\[(.+?)\]\]/g;
  let lastIndex = 0;
  for (const match of code.matchAll(emphasis)) {
    pushWords(tokens, code.slice(lastIndex, match.index), false);
    pushWords(tokens, match[1], true);
    lastIndex = match.index + match[0].length;
  }
  pushWords(tokens, code.slice(lastIndex), false);
  return { tokens, plain: code.replace(emphasis, "$1") };
}
