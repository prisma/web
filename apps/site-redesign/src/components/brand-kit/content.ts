// Brand-kit content. Data-only; the sections compose it. Copy that the client
// still owes us is marked `TBC` — the same placeholder convention the pricing
// and use-case pages use, so the page reads as complete while the real words
// land. Grep `TBC` before shipping.

export type LogoFormat = "svg" | "png" | "transparent" | "jpg"

export type LogoVariant = {
  /** Display name in the UI. */
  name: string
  /** One-line guidance on when to reach for this treatment. */
  usage: string
  /** Folder under /public/brand-kit. */
  dir: string
  /** File stem inside the folder. */
  file: string
  /** Which surface the preview tile should render on. */
  surface: "light" | "dark"
  /** Formats present on disk for this variant. */
  formats: LogoFormat[]
}

const ALL_FORMATS: LogoFormat[] = ["svg", "png", "transparent", "jpg"]

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
]

// The primary lockup path, reused by the hero and logo sections.
export const PRIMARY_LOCKUP = "/brand-kit/full-color/full-color.svg"
export const MASTER_ZIP = "/brand-kit/prisma-brand-kit.zip"

export const FORMAT_LABELS: Record<LogoFormat, string> = {
  svg: "SVG",
  png: "PNG",
  transparent: "PNG (transparent)",
  jpg: "JPG",
}

export function assetHref(v: LogoVariant, format: LogoFormat): string {
  const suffix = format === "transparent" ? "-transparent.png" : `.${format}`
  return `/brand-kit/${v.dir}/${v.file}${suffix}`
}

// --- Colour -----------------------------------------------------------------

export type Swatch = {
  name: string
  hex: string
  rgb: string
  /** Tailwind bg utility for the swatch chip. */
  className: string
  /** Render the label/copy control in light ink over this swatch? */
  onDark?: boolean
}

// The three prism colours at their anchor step (the exact brand values from the
// /brand scales), plus the neutral ink and paper the site is built on.
export const BRAND_COLORS: Swatch[] = [
  { name: "Prism Cyan", hex: "#01D7E4", rgb: "1, 215, 228", className: "bg-prism-cyan-400" },
  { name: "Prism Yellow", hex: "#F3C306", rgb: "243, 195, 6", className: "bg-prism-yellow-300" },
  { name: "Prism Red", hex: "#F34A60", rgb: "243, 74, 96", className: "bg-prism-red-500", onDark: true },
]

export const NEUTRAL_COLORS: Swatch[] = [
  { name: "Ink", hex: "#121212", rgb: "18, 18, 18", className: "bg-[#121212]", onDark: true },
  { name: "Paper", hex: "#FFFFFF", rgb: "255, 255, 255", className: "bg-white" },
]

// --- Misuse -----------------------------------------------------------------

export type Dont = { title: string; detail: string }

export const LOGO_DONTS: Dont[] = [
  { title: "Don't recolour", detail: "Keep the brand colours. Never swap the palette or tint the mark." },
  { title: "Don't distort", detail: "Scale proportionally. Never stretch, squash, or skew." },
  { title: "Don't rotate", detail: "The lockup is always level. Never tilt or set it on an angle." },
  { title: "Don't add effects", detail: "No shadows, glows, gradients, or outlines on the logo." },
  { title: "Don't crowd it", detail: "Respect the clear space. Keep type, edges, and other marks out." },
  { title: "Don't place on busy backgrounds", detail: "Use a treatment with enough contrast. Never on low-contrast imagery." },
]

// --- Co-branding ------------------------------------------------------------

export const COBRAND_NOTES: string[] = [
  "Give each logo equal optical weight — match by height, not by bounding box.",
  "Separate the two marks with a thin vertical divider and at least one clear-space unit either side.",
  "Use the treatment that carries best on the shared background — full colour on light, white on dark.",
]
