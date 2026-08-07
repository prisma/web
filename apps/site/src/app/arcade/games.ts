/**
 * The Prisma Arcade game registry.
 *
 * Each game will get its own playable canvas implementation; for now each
 * entry is a placeholder cabinet. Sprites are tiny pixel-art grids rendered
 * by <PixelSprite /> — one character per pixel, "." is transparent, every
 * other character is looked up in the sprite's palette.
 */

export type PixelGrid = {
  rows: string[];
  palette: Record<string, string>;
};

export type ArcadeGame = {
  id: string;
  title: string;
  tagline: string;
  /** Accent color used for the cabinet glow, per-game. */
  color: string;
  /** Placeholder until global persistence lands. */
  hiScore: number;
  status: "playable" | "coming-soon";
  sprite: PixelGrid;
  blurb: string;
};

export const GAMES: ArcadeGame[] = [
  {
    id: "snake",
    title: "SNAKE",
    tagline: "The one from your childhood.",
    blurb: "Eat the apples. Grow the tail. Don't hit the walls — and don't bite yourself.",
    color: "#4ade80",
    hiScore: 0,
    status: "playable",
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
    title: "INVADERS",
    tagline: "Defend the planet. Again.",
    blurb: "Wave after wave of aliens descend. Shoot them down before they reach the ground.",
    color: "#22d3ee",
    hiScore: 0,
    status: "playable",
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
    title: "STACKER",
    tagline: "The falling blocks. You know the ones.",
    blurb: "Stack the falling pieces, clear the lines, chase the elusive four-at-once.",
    color: "#c084fc",
    hiScore: 0,
    status: "playable",
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
    title: "MUNCHER",
    tagline: "Chomp the maze. Dodge the critters.",
    blurb: "Gobble every dot, grab a power pellet, and turn the tables on the bugs chasing you.",
    color: "#facc15",
    hiScore: 0,
    status: "playable",
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
    title: "METEORS",
    tagline: "Drift, spin, shoot the rocks.",
    blurb: "Blast the tumbling rocks to bits, dodge the flying saucer, and don't get boxed in.",
    color: "#f8fafc",
    hiScore: 0,
    status: "playable",
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
  {
    id: "comet",
    title: "COMET CAT",
    tagline: "Flap. Drift. Leave a trail.",
    blurb: "One cat, endless pillars, and a brand-new comet tail. How far can you fly?",
    color: "#7cdae1",
    hiScore: 0,
    status: "playable",
    sprite: {
      palette: {
        T: "#7cdae1",
        Y: "#edcd5f",
        R: "#e37780",
        G: "#9ca3af",
        D: "#4b5563",
        K: "#1f2937",
        P: "#f2a0ac",
      },
      rows: [
        "............",
        "......DD.DD.",
        "......DGDGD.",
        "TTTTTDGGGGGD",
        "YYYYYDGKGKGD",
        "RRRRRDGGPGGD",
        "......DGGGD.",
        ".......DDD..",
        "............",
      ],
    },
  },
];
