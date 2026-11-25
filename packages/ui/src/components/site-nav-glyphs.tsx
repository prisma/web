// The navbar menu glyphs, shared by the site header
// (apps/site/src/components/header.tsx) and the blog header
// (apps/blog/src/components/chrome/Header.tsx) so both draw the same icons
// (client, 2026-11-25: "make the icons the same for the home page and the
// blog page"). SVG components rather than FontAwesome classes: the site and
// the blog load different FontAwesome kits, and the site's lacks most of
// these glyphs. Keyed by route, like the links in ../data/site-nav.
import {
  Clapperboard,
  FileDigit,
  Globe,
  Layers,
  LayoutGrid,
  Lightbulb,
  MessageSquareCode,
  Users,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { PLATFORM_GLYPHS } from "./forma-product-icons";

export type NavGlyph = ComponentType<SVGProps<SVGSVGElement>>;

export { PLATFORM_GLYPHS };

/** The Resources menu's glyphs: the ones the blog's menu had, as lucide icons. */
export const RESOURCE_GLYPHS: Record<string, NavGlyph> = {
  "/mcp": MessageSquareCode,
  "/programs/partners": Lightbulb,
  "/docs/guides": Clapperboard,
  "https://github.com/prisma/prisma-examples": LayoutGrid,
  "/stack": Layers,
  "/ecosystem": Globe,
  "/customers": Users,
  "https://www.prisma.io/dataguide": FileDigit,
};
