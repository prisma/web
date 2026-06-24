"use client";

import dynamic from "next/dynamic";

// `ssr: false` must live inside a Client Component in the App Router.
// This file is that boundary — page.tsx (a Server Component) imports from here.

export { CobeGlobe } from "./CobeGlobe";

export const NetworkGlobe = dynamic(
  () => import("./NetworkGlobe").then((m) => ({ default: m.NetworkGlobe })),
  { ssr: false },
);

// DeployTerminal, StatefulExecutionCard and HowItWorks all live in the same
// file, so they share one deferred chunk that is loaded only on demand.
export const DeployTerminal = dynamic(
  () => import("./how-it-works").then((m) => ({ default: m.DeployTerminal })),
  { ssr: false },
);

export const StatefulExecutionCard = dynamic(
  () =>
    import("./how-it-works").then((m) => ({
      default: m.StatefulExecutionCard,
    })),
  { ssr: false },
);

export const HowItWorks = dynamic(
  () => import("./how-it-works").then((m) => ({ default: m.HowItWorks })),
  { ssr: false },
);
