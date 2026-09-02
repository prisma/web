// Brand-kit content. Data-only; the sections compose it. Every string here is
// real copy — there are no `TBC` placeholders left on this page or on pricing,
// so don't add one back: fill the real words in, or leave the entry out.

export type LogoFormat = "svg" | "png" | "transparent" | "jpg";

export type LogoVariant = {
  /** Display name in the UI. */
  name: string;
  /** One-line guidance on when to reach for this treatment. */
  usage: string;
  /** Folder under /public/brand-kit. */
  dir: string;
  /** File stem inside the folder. */
  file: string;
  /** Which surface the preview tile should render on. */
  surface: "light" | "dark";
  /** Formats present on disk for this variant. */
  formats: LogoFormat[];
};

const ALL_FORMATS: LogoFormat[] = ["svg", "png", "transparent", "jpg"];

// The seven treatments shipped in the client's logo pack, in recommended order.
export const LOGO_VARIANTS: LogoVariant[] = [
  {
    name: "Full colour",
    usage: "The primary lockup. Use it wherever the background allows.",
    dir: "full-color",
    file: "full-color",
    surface: "light",
    formats: ALL_FORMATS,
  },
  {
    name: "Black",
    usage: "One-colour, for light backgrounds, print, and faxable documents.",
    dir: "black",
    file: "black",
    surface: "light",
    formats: ALL_FORMATS,
  },
  {
    name: "White",
    usage: "One-colour, for dark or photographic backgrounds.",
    dir: "white",
    file: "white",
    surface: "dark",
    formats: ALL_FORMATS,
  },
  {
    name: "Grayscale",
    usage: "Neutral treatment for single-colour and greyscale contexts.",
    dir: "grayscale",
    file: "grayscale",
    surface: "light",
    formats: ALL_FORMATS,
  },
  {
    name: "Inverted",
    usage: "The colour mark with a light wordmark, for dark UI.",
    dir: "inverted",
    file: "inverted",
    surface: "dark",
    formats: ALL_FORMATS,
  },
  {
    name: "Wordmark",
    usage: "The Prisma wordmark on its own, where the mark already appears nearby.",
    dir: "logotype",
    file: "logotype",
    surface: "light",
    formats: ALL_FORMATS,
  },
  {
    name: "Symbol",
    usage: "The prism mark alone — avatars, favicons, app icons, square crops.",
    dir: "logo-mark",
    file: "logo-mark",
    surface: "light",
    formats: ALL_FORMATS,
  },
];

// The primary lockup path, reused by the hero and logo sections.
export const PRIMARY_LOCKUP = "/brand-kit/full-color/full-color.svg";
export const MASTER_ZIP = "/brand-kit/prisma-brand-kit.zip";

export const FORMAT_LABELS: Record<LogoFormat, string> = {
  svg: "SVG",
  png: "PNG",
  transparent: "PNG (transparent)",
  jpg: "JPG",
};

export function assetHref(v: LogoVariant, format: LogoFormat): string {
  const suffix = format === "transparent" ? "-transparent.png" : `.${format}`;
  return `/brand-kit/${v.dir}/${v.file}${suffix}`;
}

// --- Colour -----------------------------------------------------------------

export type Swatch = {
  name: string;
  hex: string;
  rgb: string;
  /** Tailwind bg utility for the swatch chip. */
  className: string;
};

// The three prism colours at their anchor step (the exact brand values from the
// /brand scales), plus the neutral ink and paper the site is built on.
export const BRAND_COLORS: Swatch[] = [
  { name: "Prism Cyan", hex: "#01D7E4", rgb: "1, 215, 228", className: "bg-prism-cyan-400" },
  { name: "Prism Yellow", hex: "#F3C306", rgb: "243, 195, 6", className: "bg-prism-yellow-300" },
  { name: "Prism Red", hex: "#F34A60", rgb: "243, 74, 96", className: "bg-prism-red-500" },
];

export const NEUTRAL_COLORS: Swatch[] = [
  { name: "Ink", hex: "#121212", rgb: "18, 18, 18", className: "bg-[#121212]" },
  { name: "Paper", hex: "#FFFFFF", rgb: "255, 255, 255", className: "bg-white" },
];

// Misuse copy is not here: each don't ships with a visual of the exact
// mistake, so the strings live next to the CSS that produces them in
// brand-kit-misuse.tsx rather than being split across two files.

// --- Mascot -----------------------------------------------------------------

// Named by the client 2026-08-19. Held as a constant because the name appears
// in the heading, the subhead, and the usage rules.
export const MASCOT_NAME = "Prismo";

export type Expression = {
  /** Display name in the UI. */
  name: string;
  /** File stem under /public/brand-kit/mascot. */
  file: string;
  /** One line on when to reach for this face. */
  usage: string;
};

// The nine expressions the client rendered, ordered warmest to coolest so the
// grid reads as a range rather than a random sheet.
export const MASCOT_EXPRESSIONS: Expression[] = [
  {
    name: "Salute",
    file: "salute",
    usage: "Hello and goodbye — welcome screens, onboarding, sign-offs.",
  },
  {
    name: "Happy",
    file: "happy",
    usage: "The default face. Success states, shipped features, good news.",
  },
  {
    name: "Laughing",
    file: "laughing",
    usage: "Delight — a playful release note or a community moment.",
  },
  {
    name: "Laughing to tears",
    file: "laughing-tears",
    usage: "For when something is genuinely funny. Social, not product UI.",
  },
  {
    name: "Relieved",
    file: "relieved",
    usage: "The it-worked-in-the-end face. Recovered errors, resolved incidents.",
  },
  {
    name: "Surprised",
    file: "surprised",
    usage: "A reveal or a number that lands. Launches and announcements.",
  },
  {
    name: "Thinking",
    file: "thinking",
    usage: "Loading, reasoning, and anything the agent is working through.",
  },
  {
    name: "Sad",
    file: "sad",
    usage: "Empty states and things that went wrong. Use sparingly.",
  },
  {
    name: "Annoyed",
    file: "annoyed",
    usage: "Rate limits, blocked actions, and firm don'ts. The rarest of the set.",
  },
];

export function expressionHref(e: Expression): string {
  return `/brand-kit/mascot/${e.file}.png`;
}

export const MASCOT_RULES: string[] = [
  `${MASCOT_NAME} is a character, not a logo. He never stands in for the prism mark or the wordmark.`,
  "One expression per surface. Repeated down a page he stops reading as a character and starts reading as wallpaper.",
  "Match the face to the message — the sad one never carries good news.",
  "Keep him whole and level. No cropping past the base, no tilting, and never recolour the visor bands.",
];

// --- Co-branding ------------------------------------------------------------

export const COBRAND_NOTES: string[] = [
  "Give each logo equal optical weight — match by height, not by bounding box.",
  "Separate the two marks with a thin vertical divider and at least one clear-space unit either side.",
  "Use the treatment that carries best on the shared background — full colour on light, white on dark.",
];
