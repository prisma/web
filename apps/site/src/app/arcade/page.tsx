import { createPageMetadata } from "@/lib/page-metadata";
import { Press_Start_2P, VT323 } from "next/font/google";
import { ArcadeExperience } from "./_components/arcade-experience";

// The arcade is a deliberate retro takeover, so it brings its own display
// faces: Press Start 2P for pixel type, VT323 for terminal-style copy.
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-arcade",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-arcade-alt",
  display: "swap",
});

export const metadata = createPageMetadata({
  title: "Prisma Arcade | Insert Coin to Play",
  description:
    "Six tiny games built by the Prisma team. Fly Comet Cat, climb the high-score leaderboard, and warm up for the $500 Prisma-credits contest. No quarters required.",
  path: "/arcade",
});

export default function ArcadePage() {
  // The font classes are passed down because the play dialog renders in a
  // portal outside this subtree and still needs the font variables.
  return <ArcadeExperience fontClass={`${pressStart.variable} ${vt323.variable}`} />;
}
