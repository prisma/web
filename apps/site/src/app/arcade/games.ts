/**
 * The Prisma Arcade game registry for the secondary "free play" grid.
 * Comet Cat is the featured game and lives directly in the page hero.
 *
 * Sprites are tiny pixel-art grids rendered by <PixelSprite /> — one character
 * per pixel, "." is transparent, every other character is looked up in the
 * sprite's palette.
 */

export type PixelGrid = {
  rows: string[];
  palette: Record<string, string>;
};

export type ArcadeGameId = "snake" | "invaders" | "stacker" | "muncher" | "meteors";

export type ArcadeGame = {
  id: ArcadeGameId;
  title: string;
  tagline: string;
  /** Accent color used for the sprite glow on the card screen. */
  color: string;
  /** One-line control summary shown on the card and in the play dialog. */
  controls: string;
  sprite: PixelGrid;
};

export const GAMES: ArcadeGame[] = [
  {
    id: "snake",
    title: "Snake",
    tagline: "Eat the apples. Don't bite yourself.",
    controls: "Arrow keys or swipe to steer",
    color: "#4ade80",
    sprite: {
      palette: { G: "#4ade80", D: "#16a34a", R: "#f87171", W: "#f8fafc" },
      rows: [
        "............",
        ".GGGGGGGGG..",
        ".GW......G..",
        ".G.......G..",
        ".GGGGGGGGG..",
        ".D..........",
        ".D..........",
        ".DGGGGGGGG..",
        ".........G..",
        "..RR.....G..",
        "..RR..GGGG..",
        "............",
      ],
    },
  },
  {
    id: "invaders",
    title: "Invaders",
    tagline: "Defend the planet. Again.",
    controls: "Arrows move, Space fires",
    color: "#22d3ee",
    sprite: {
      palette: { M: "#22d3ee", E: "#0f172a" },
      rows: [
        "...........",
        "..M.....M..",
        "...M...M...",
        "..MMMMMMM..",
        ".MM.MMM.MM.",
        "MMMMMMMMMMM",
        "M.MMMMMMM.M",
        "M.M.....M.M",
        "...MM.MM...",
        "...........",
      ],
    },
  },
  {
    id: "stacker",
    title: "Stacker",
    tagline: "The falling blocks. You know the ones.",
    controls: "Arrows move, Up rotates, Space drops",
    color: "#c084fc",
    sprite: {
      palette: {
        P: "#c084fc",
        Y: "#facc15",
        R: "#f87171",
        G: "#4ade80",
        B: "#60a5fa",
        O: "#fb923c",
        C: "#22d3ee",
      },
      rows: [
        "............",
        ".....P......",
        "....PPP.....",
        "............",
        "............",
        "........RR..",
        "YY......RR..",
        "YY.G..B..O..",
        ".GG.BBB..O..",
        "CCCC.....OO.",
      ],
    },
  },
  {
    id: "muncher",
    title: "Muncher",
    tagline: "Chomp the maze. Dodge the critters.",
    controls: "Arrow keys or swipe to steer",
    color: "#facc15",
    sprite: {
      palette: { Y: "#facc15", W: "#fde68a" },
      rows: [
        "............",
        "..YYYY......",
        ".YYYYYY.....",
        ".YYYY.......",
        ".YYY....WW..",
        ".YYY....WW..",
        ".YYYY.......",
        ".YYYYYY.....",
        "..YYYY......",
        "............",
        "......WW....",
        "......WW....",
      ],
    },
  },
  {
    id: "meteors",
    title: "Meteors",
    tagline: "Drift, spin, shoot the rocks.",
    controls: "Arrows steer, Space fires, H hyperspace",
    color: "#f8fafc",
    sprite: {
      palette: { W: "#f8fafc", D: "#94a3b8" },
      rows: [
        "............",
        "....W.......",
        "...WWW......",
        "..WW.WW.....",
        ".WWWWWWW....",
        "............",
        ".DDD....DD..",
        "DD..DD.DDDD.",
        "D....D.D..DD",
        "DD..DD.DDDD.",
        ".DDDD...DD..",
        "............",
      ],
    },
  },
];
