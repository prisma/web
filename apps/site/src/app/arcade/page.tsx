import { createPageMetadata } from "@/lib/page-metadata";
import { Press_Start_2P } from "next/font/google";
import { ArcadeExperience } from "./_components/arcade-experience";

// Pixel display face for the game HUDs and screens only — page chrome uses the
// standard site typography.
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-arcade",
  display: "swap",
});

export const metadata = createPageMetadata({
  title: "Prisma Arcade",
  description:
    "Six tiny games built by the Prisma team. Fly Comet Cat, climb the high-score leaderboard, and warm up for the $500 Prisma-credits contest — no quarters required.",
  path: "/arcade",
});

export default function ArcadePage() {
  // The font class is passed down because the play dialog renders in a portal
  // outside this subtree and still needs the --font-arcade variable.
  return <ArcadeExperience fontClass={pressStart.variable} />;
}
