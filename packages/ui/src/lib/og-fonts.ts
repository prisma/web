import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The brand faces for Open Graph cards: Sora (display), Inter (body and
 * kicker), Mona Sans Mono (code and API paths). satori, behind `next/og`,
 * cannot parse the woff2 variable fonts vendored in @prisma/eclipse, so each
 * app ships static TTF cuts of those same files in `public/fonts` and this
 * reads them from disk. Disk rather than Google Fonts because the docs route
 * pre-renders one card per page at build time and must not need the network.
 *
 * The cuts are instanced from packages/eclipse/src/static/fonts with fontTools
 * (`instancer` + latin subset); regenerate them there when the brand fonts change.
 */
const OG_FONT_DEFINITIONS = [
  { name: "Sora", file: "Sora-Medium.ttf", weight: 500 },
  { name: "Sora", file: "Sora-SemiBold.ttf", weight: 600 },
  { name: "Inter", file: "Inter-Regular.ttf", weight: 400 },
  { name: "Inter", file: "Inter-SemiBold.ttf", weight: 600 },
  { name: "Mona Sans Mono", file: "MonaSansMono-Medium.ttf", weight: 500 },
] as const;

type OgFontWeight = (typeof OG_FONT_DEFINITIONS)[number]["weight"];

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: OgFontWeight;
  style: "normal";
};

let fontCache: Promise<OgFont[]> | undefined;

function bufferToArrayBuffer(buffer: Buffer) {
  return Uint8Array.from(buffer).buffer;
}

/** Loads the OG fonts from `<app>/public/fonts`, cached for the process lifetime. */
export function loadOgFonts() {
  fontCache ??= Promise.all(
    OG_FONT_DEFINITIONS.map(async ({ name, file, weight }) => {
      const fontBuffer = await readFile(path.join(process.cwd(), "public", "fonts", file));

      return {
        name,
        data: bufferToArrayBuffer(fontBuffer),
        weight,
        style: "normal" as const,
      };
    }),
  ).catch((err) => {
    fontCache = undefined;
    throw err;
  });

  return fontCache;
}
