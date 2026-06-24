export const dark = {
  colorBackgroundDefault: "#030712",
  colorBackgroundNeutral: "#1f2937",
  colorBackgroundNeutralWeak: "#111827",
  colorForegroundNeutral: "#f9fafb",
  colorForegroundNeutralWeak: "#9ca3af",
  colorForegroundPpg: "#14b8a6",
  colorForegroundPpgStrong: "#2dd4bf",
  colorForegroundPpgWeak: "#0d9488",
  colorForegroundPpgReverseWeak: "#99f6e4",
  colorStrokePpg: "#2dd4bf",
  colorStrokePpgWeak: "#115e59",
} as const;

export const light = {
  colorBackgroundDefault: "#CCFBF1", // --color-background-default
  colorBackgroundNeutral: "#f3f4f6", // --color-background-neutral
  colorBackgroundNeutralWeak: "#f9fafb", // --color-background-neutral-weak
  colorForegroundNeutral: "#111827", // --color-foreground-neutral
  colorForegroundNeutralWeak: "#6b7280", // --color-foreground-neutral-weak
  colorForegroundPpg: "#0d9488", // --color-foreground-ppg
  colorForegroundPpgStrong: "#0f766e", // --color-foreground-ppg-strong
  colorForegroundPpgWeak: "#CCFBF1", // --color-foreground-ppg-weak
  colorForegroundPpgReverseWeak: "#99f6e4", // --color-foreground-ppg-reverse-weak
  colorStrokePpg: "#0d9488", // --color-stroke-ppg
  colorStrokePpgWeak: "#99f6e4", // --color-stroke-ppg-weak
} as const;

export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const n = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(n)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Per-marker tint so cobe uses the colored marker shader path. */
export const COBE_MARKER_DOT_RGB = (isLight?: boolean) =>
  hexToRgb01(
    isLight ? light.colorForegroundPpgReverseWeak : dark.colorForegroundPpgReverseWeak,
  ) as [number, number, number];

/** RGB 0–1 for cobe `baseColor`, `markerColor`, `glowColor`, `arcColor`. */
export const cobeGlobe = (isLight?: boolean) => ({
  baseColor: hexToRgb01(isLight ? light.colorForegroundPpgWeak : dark.colorForegroundPpgWeak),
  markerColor: COBE_MARKER_DOT_RGB(isLight),
  glowColor: hexToRgb01(
    isLight ? light.colorForegroundPpgReverseWeak : dark.colorForegroundPpgReverseWeak,
  ),
  arcColor: hexToRgb01(isLight ? light.colorForegroundPpg : dark.colorForegroundPpg),
});
