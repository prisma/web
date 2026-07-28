import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  Code,
  Copy,
  Database,
  GitBranch,
  Layers,
  Plus,
  Rocket,
  Search,
  Server,
  Settings,
} from "@/components/icons/forma";
import { GlassPrism } from "@/components/brand/glass-prism";
import { IconTile } from "@/components/brand/icon-tile";
import { RoleKicker } from "@/components/brand/role-kicker";
import { LearnMore } from "@/components/brand/learn-more";
import { Pattern } from "@/components/brand/pattern";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay, prismBands } from "@/components/brand/prism-ray";
import { Texture } from "@/components/brand/texture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description: "Brand guidelines, typography, colors, and design tokens.",
};

const colors = [
  { name: "Primary", variable: "--primary", class: "bg-primary text-primary-foreground" },
  { name: "Secondary", variable: "--secondary", class: "bg-secondary text-secondary-foreground" },
  { name: "Accent", variable: "--accent", class: "bg-accent text-accent-foreground" },
  { name: "Muted", variable: "--muted", class: "bg-muted text-muted-foreground" },
  { name: "Destructive", variable: "--destructive", class: "bg-destructive text-white" },
  { name: "Background", variable: "--background", class: "bg-background text-foreground border" },
  { name: "Card", variable: "--card", class: "bg-card text-card-foreground border" },
  { name: "Popover", variable: "--popover", class: "bg-popover text-popover-foreground border" },
];

const brandScales = [
  {
    name: "Prism Cyan",
    anchor: 400,
    steps: [
      { step: 50, hex: "#EEFFFF", class: "bg-prism-cyan-50" },
      { step: 100, hex: "#DCFDFF", class: "bg-prism-cyan-100" },
      { step: 200, hex: "#B3F4F9", class: "bg-prism-cyan-200" },
      { step: 300, hex: "#7BE7F0", class: "bg-prism-cyan-300" },
      { step: 400, hex: "#01D7E4", class: "bg-prism-cyan-400" },
      { step: 500, hex: "#00BBCB", class: "bg-prism-cyan-500" },
      { step: 600, hex: "#009AAA", class: "bg-prism-cyan-600" },
      { step: 700, hex: "#007F8D", class: "bg-prism-cyan-700" },
      { step: 800, hex: "#006772", class: "bg-prism-cyan-800" },
      { step: 900, hex: "#00545D", class: "bg-prism-cyan-900" },
      { step: 950, hex: "#00353C", class: "bg-prism-cyan-950" },
    ],
  },
  {
    name: "Prism Red",
    anchor: 500,
    steps: [
      { step: 50, hex: "#FFEEEE", class: "bg-prism-red-50" },
      { step: 100, hex: "#FFDFDF", class: "bg-prism-red-100" },
      { step: 200, hex: "#FFC2C4", class: "bg-prism-red-200" },
      { step: 300, hex: "#FF9FA4", class: "bg-prism-red-300" },
      { step: 400, hex: "#FF7682", class: "bg-prism-red-400" },
      { step: 500, hex: "#F34A60", class: "bg-prism-red-500" },
      { step: 600, hex: "#D02344", class: "bg-prism-red-600" },
      { step: 700, hex: "#AF0A33", class: "bg-prism-red-700" },
      { step: 800, hex: "#8E0B29", class: "bg-prism-red-800" },
      { step: 900, hex: "#740F22", class: "bg-prism-red-900" },
      { step: 950, hex: "#4B0211", class: "bg-prism-red-950" },
    ],
  },
  {
    name: "Prism Yellow",
    anchor: 300,
    steps: [
      { step: 50, hex: "#FFF7E0", class: "bg-prism-yellow-50" },
      { step: 100, hex: "#FCEDC2", class: "bg-prism-yellow-100" },
      { step: 200, hex: "#F8DA85", class: "bg-prism-yellow-200" },
      { step: 300, hex: "#F3C306", class: "bg-prism-yellow-300" },
      { step: 400, hex: "#EAA700", class: "bg-prism-yellow-400" },
      { step: 500, hex: "#D48700", class: "bg-prism-yellow-500" },
      { step: 600, hex: "#B46700", class: "bg-prism-yellow-600" },
      { step: 700, hex: "#965100", class: "bg-prism-yellow-700" },
      { step: 800, hex: "#7A4200", class: "bg-prism-yellow-800" },
      { step: 900, hex: "#633700", class: "bg-prism-yellow-900" },
      { step: 950, hex: "#402000", class: "bg-prism-yellow-950" },
    ],
  },
];

const buttonVariantNames = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "destructive",
] as const;

const spacingScale = [
  { name: "0.5", px: "2px" },
  { name: "1", px: "4px" },
  { name: "2", px: "8px" },
  { name: "3", px: "12px" },
  { name: "4", px: "16px" },
  { name: "6", px: "24px" },
  { name: "8", px: "32px" },
  { name: "12", px: "48px" },
  { name: "16", px: "64px" },
  { name: "20", px: "80px" },
];

const radiusScale = [
  { name: "sm", variable: "--radius-sm" },
  { name: "md", variable: "--radius-md" },
  { name: "lg", variable: "--radius-lg" },
  { name: "xl", variable: "--radius-xl" },
  { name: "2xl", variable: "--radius-2xl" },
];

export default function BrandPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold sm:text-5xl">Brand Guidelines</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Design tokens, typography, colors, and spacing references for this project. Update{" "}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">globals.css</code> to customize
            these values per client.
          </p>
        </div>

        {/* Logo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Logo</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Light Background</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 bg-white rounded-lg border">
                <Image src="/logo/full-color.svg" alt="Prisma logo" width={158} height={40} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Dark Background</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 bg-zinc-900 rounded-lg">
                <Image src="/logo/full-color-white.svg" alt="Prisma logo" width={158} height={40} />
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Typography</h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Headings: Sora (--font-heading)
                </p>
                <p className="text-lg font-heading">The quick brown fox jumps over the lazy dog</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Body: Inter (--font-sans)</p>
                <p className="text-lg">The quick brown fox jumps over the lazy dog</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  Tagline / kicker — the standard section and product label. Sentence case, ink at
                  70%, colour carried by a dot. Never uppercase, never letter-spaced, never grey.
                  Use <code className="font-mono">RoleKicker</code> from
                  <code className="font-mono"> @/components/brand/role-kicker</code>.
                </p>
                <div className="flex flex-col gap-2">
                  <RoleKicker color="bg-prism-cyan-400">Type-safe data layer</RoleKicker>
                  <RoleKicker color="bg-prism-yellow-400">Managed database</RoleKicker>
                  <RoleKicker color="bg-prism-red-500">App hosting</RoleKicker>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">Heading Scale</p>
                <h1 className="text-6xl font-normal">Heading 1 (text-6xl)</h1>
                <h2 className="text-5xl font-normal">Heading 2 (text-5xl)</h2>
                <h3 className="text-4xl font-normal">Heading 3 (text-4xl)</h3>
                <h4 className="text-3xl font-normal">Heading 4 (text-3xl)</h4>
                <h5 className="text-2xl font-normal">Heading 5 (text-2xl)</h5>
                <h6 className="text-xl font-normal">Heading 6 (text-xl)</h6>
              </div>
              <Separator />
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Body Text</p>
                <p className="text-lg">Large body text (text-lg)</p>
                <p className="text-base">Base body text (text-base)</p>
                <p className="text-sm">Small body text (text-sm)</p>
                <p className="text-xs">Extra small text (text-xs)</p>
              </div>
              <Separator />
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Font Weights</p>
                <p className="font-normal">Normal (font-normal / 400)</p>
                <p className="font-semibold">Semibold (font-semibold / 600) — buttons and CTAs</p>
                <p className="text-xs text-muted-foreground">
                  Loaded weights: Inter variable 100–900, Sora variable 100–800.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="mb-16" />

        {/* Texture & Pattern */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Texture &amp; Pattern</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Grain Texture —{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;Texture /&gt;</code>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative h-40 rounded-lg overflow-hidden border">
                  <Texture opacity={1} className="mix-blend-normal" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Shown raw above. In practice it overlays color-washed section panels at 0.06
                  opacity with multiply blending (the component&apos;s default) — a present but fine
                  film grain, never a visible image.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Cube Pattern —{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;Pattern /&gt;</code>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Pattern className="h-40 rounded-lg border" />
                <p className="text-xs text-muted-foreground">
                  Isometric cube grid, cursor-reactive — cubes bulge away from the pointer. Move
                  your mouse over it.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Prism Ray */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Prism Ray</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  The motif —{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;PrismRay /&gt;</code>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative h-40 overflow-hidden rounded-lg border bg-white">
                  <PrismRay className="left-1/2 top-1/2 h-9 w-[160%] -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-xs text-muted-foreground">
                  The triple-band ray —{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">prism-cyan-400</code> /{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">prism-yellow-300</code> /{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">prism-red-500</code> — at the brand
                  angle of −16°, in whisper / structural / hero intensities.{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">prismBands()</code> exposes the raw
                  gradient for fills, edges, and rings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Usage doctrine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">The ray is a state, not a decoration.</span> It
                  appears where something is happening or where you are — never as a static
                  background stripe.
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>Scanning — the logo cloud sweep</li>
                  <li>Loading — prismatic skeletons</li>
                  <li>
                    Active —{" "}
                    <span className="relative inline-block font-medium text-foreground">
                      the selected tab
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full"
                        style={{ background: prismBands() }}
                      />
                    </span>
                  </li>
                  <li>Progress — bars, spinners, countdowns</li>
                </ul>
                <Button variant="outline" asChild>
                  <Link href="/brand/rays">
                    Open the Ray Lab <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Glass Prisms */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Glass Prisms</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  The shapes —{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    &lt;GlassPrism /&gt;
                  </code>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid h-44 grid-cols-4 overflow-hidden rounded-lg border bg-white">
                  {(["pentagon", "hexagon", "rect", "triangle"] as const).map((shape) => (
                    <div key={shape} className="relative">
                      <GlassPrism
                        shape={shape}
                        tint="spectral"
                        gradientId={`shape-grid-spectrum-${shape}`}
                        className="left-1/2 top-1/2 w-24 -translate-x-1/2 -translate-y-1/2"
                      />
                      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {shape}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  &ldquo;Any shape can be a Prisma&rdquo; — a polygon face extruded back into space
                  as translucent glass, drawn from the brand Figma&apos;s 3D exploration. The
                  pentagon is the canonical brand shape; hexagon, rectangle, and triangle extend the
                  family. Lean away from the triangle.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Tints &amp; usage doctrine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className="relative h-24 overflow-hidden rounded-lg"
                    style={{
                      backgroundImage:
                        "linear-gradient(85deg, #01d7e4 0%, #f3c306 50%, #f34a60 100%)",
                    }}
                  >
                    <GlassPrism
                      shape="pentagon"
                      tint="white"
                      className="left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
                    />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-xs text-white">
                      white
                    </span>
                  </div>
                  <div className="relative h-24 overflow-hidden rounded-lg border bg-white">
                    <GlassPrism
                      shape="pentagon"
                      tint="ink"
                      className="left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
                    />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      ink
                    </span>
                  </div>
                  <div className="relative h-24 overflow-hidden rounded-lg border bg-white">
                    <GlassPrism
                      shape="pentagon"
                      tint="spectral"
                      className="left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
                    />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      spectral
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">Glass lives in the background.</span> Prisms sit
                  behind content, cropped by section edges — never in front of copy, never floating
                  in whitespace as decoration.
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>
                    <code className="bg-muted px-1 py-0.5 rounded">white</code> — only over
                    saturated color, where the glass glows
                  </li>
                  <li>
                    <code className="bg-muted px-1 py-0.5 rounded">ink</code> — hairline glass for
                    white backgrounds
                  </li>
                  <li>
                    <code className="bg-muted px-1 py-0.5 rounded">spectral</code> — hairlines with
                    the face catching the spectrum
                  </li>
                </ul>
                <Button variant="outline" asChild>
                  <Link href="/brand/prisms">
                    Open the Prism Lab <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Icons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Icons</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm leading-relaxed">
                Icon library: <span className="font-semibold">Forma Thin</span> by Icons8 —
                thin-stroke geometric icons matching the light, precise brand voice. One library
                across the whole site; do not mix.
              </p>
              <div className="flex flex-wrap gap-5 rounded-lg border bg-white p-5 text-foreground">
                {[
                  Database,
                  Server,
                  Code,
                  GitBranch,
                  Bot,
                  Rocket,
                  Layers,
                  Search,
                  Settings,
                  Copy,
                  Check,
                  Plus,
                  ArrowRight,
                ].map((Icon, i) => (
                  <Icon key={i} className="size-5" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Source: Icons8, fetched via the{" "}
                <code className="bg-muted px-1 py-0.5 rounded">icons8mcp</code> MCP server (platform{" "}
                <code className="bg-muted px-1 py-0.5 rounded">forma-thin</code>) and committed as
                React components in{" "}
                <code className="bg-muted px-1 py-0.5 rounded">src/components/icons/forma.tsx</code>
                . Hero, navbar, and brand pages use Forma Thin; remaining starter sections still
                render Lucide and get swapped as they&apos;re rebuilt.
              </p>
              <Separator />
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Icon tiles</span> — when an icon anchors a card or
                feature row, it sits on an{" "}
                <code className="bg-muted px-1 py-0.5 rounded">IconTile</code> (
                <code className="bg-muted px-1 py-0.5 rounded">
                  src/components/brand/icon-tile.tsx
                </code>
                ): a white tile with the panel idiom in miniature — the spectral wash collecting
                along the tile&apos;s bottom edge, the glyph in{" "}
                <code className="bg-muted px-1 py-0.5 rounded">text-foreground</code> on top. Never
                flat tinted squares. Default{" "}
                <code className="bg-muted px-1 py-0.5 rounded">size-12</code>; pass{" "}
                <code className="bg-muted px-1 py-0.5 rounded">className</code> to resize
                (stack-bento uses <code className="bg-muted px-1 py-0.5 rounded">size-14</code>).
              </p>
              <div className="flex flex-wrap items-end gap-5 rounded-lg border bg-white p-5">
                {[Database, Server, Bot, Rocket].map((Icon, i) => (
                  <IconTile key={i}>
                    <Icon className="size-5 text-foreground" />
                  </IconTile>
                ))}
                <IconTile className="size-14">
                  <Layers className="size-6 text-foreground" />
                </IconTile>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="mb-16" />

        {/* Brand Color Scales */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Brand Color Scales</h2>
          <p className="text-muted-foreground mb-6">
            The three prism colors, each as an 11-step scale (
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">prism-cyan</code>,{" "}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">prism-red</code>,{" "}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">prism-yellow</code>). The
            ringed swatch is the exact brand color.
          </p>
          <div className="space-y-8">
            {brandScales.map((scale) => (
              <div key={scale.name}>
                <p className="text-sm font-medium mb-3">{scale.name}</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2">
                  {scale.steps.map((s) => (
                    <div key={s.step}>
                      <div
                        className={`h-14 rounded-lg ${s.class} ${
                          s.step === scale.anchor ? "ring-2 ring-offset-2 ring-foreground" : ""
                        }`}
                      />
                      <p className="text-xs mt-1.5 font-medium">{s.step}</p>
                      <p className="text-xs text-muted-foreground">{s.hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Colors */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Colors</h2>
          <p className="text-muted-foreground mb-6">
            All colors are defined as CSS custom properties in{" "}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">globals.css</code>. Override
            them to match the client&apos;s brand.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colors.map((color) => (
              <Card key={color.name}>
                <CardContent className="pt-6">
                  <div
                    className={`h-20 rounded-lg mb-3 flex items-center justify-center text-sm font-medium ${color.class}`}
                  >
                    {color.name}
                  </div>
                  <p className="text-sm font-medium">{color.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{color.variable}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Spacing */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Spacing</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {spacingScale.map((space) => (
                  <div key={space.name} className="flex items-center gap-4">
                    <span className="text-sm font-mono w-10 text-right text-muted-foreground">
                      {space.name}
                    </span>
                    <div className="bg-primary h-4 rounded" style={{ width: space.px }} />
                    <span className="text-xs text-muted-foreground">{space.px}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="mb-16" />

        {/* Border Radius */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Border Radius</h2>
          <div className="flex flex-wrap gap-6">
            {radiusScale.map((radius) => (
              <div key={radius.name} className="text-center">
                <div
                  className="h-16 w-16 bg-primary mb-2"
                  style={{ borderRadius: `var(${radius.variable})` }}
                />
                <p className="text-sm font-medium">{radius.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{radius.variable}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Buttons</h2>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Brand CTAs —{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  &lt;PrismButton /&gt;
                </code>{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  &lt;PrismButtonOutline /&gt;
                </code>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-white p-10">
                <PrismButton>Get Started</PrismButton>
                <PrismButtonOutline>Log in</PrismButtonOutline>
              </div>
              <p className="text-xs text-muted-foreground">
                From the approved stylescape: the primary CTA carries a drifting spectrum glow and
                erupts in a prismatic burst on hover; the secondary is a thin-border pill. Hover
                them.
              </p>
              <Separator />
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Learn more links</span> — the standard in-card text
                CTA is{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;LearnMore /&gt;</code>{" "}
                (
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  src/components/brand/learn-more.tsx
                </code>
                ): a spectrum-ink pill with the bold arrow. Use it wherever a card or feature row
                links deeper — never ad-hoc link styles. Pass{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">outline</code> to escalate
                to the bordered brand button when the link is a section&apos;s single closing CTA.
              </p>
              <div className="flex flex-wrap items-center gap-6 rounded-lg border bg-white p-10">
                <LearnMore href="/docs" product="the example feature" className="mt-0" />
                <LearnMore href="/docs" product="the example feature" outline className="mt-0" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  Variants &times; States (shadcn/ui)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs text-muted-foreground">
                        <th className="pb-3 pr-4 font-normal">Variant</th>
                        <th className="pb-3 pr-4 font-normal">Default</th>
                        <th className="pb-3 pr-4 font-normal">With icon</th>
                        <th className="pb-3 font-normal">Disabled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buttonVariantNames.map((v) => (
                        <tr key={v} className="border-t">
                          <td className="py-3 pr-4 text-xs text-muted-foreground">
                            <code className="bg-muted px-1.5 py-0.5 rounded">{v}</code>
                          </td>
                          <td className="py-3 pr-4">
                            <Button variant={v}>Button</Button>
                          </td>
                          <td className="py-3 pr-4">
                            <Button variant={v}>
                              Button <ArrowRight />
                            </Button>
                          </td>
                          <td className="py-3">
                            <Button variant={v} disabled>
                              Button
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-3">Sizes</p>
                <div className="flex flex-wrap items-end gap-3">
                  <Button size="xs">Extra small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-3">Icon Sizes</p>
                <div className="flex flex-wrap items-end gap-3">
                  <Button size="icon-xs" aria-label="Add">
                    <Plus />
                  </Button>
                  <Button size="icon-sm" aria-label="Add">
                    <Plus />
                  </Button>
                  <Button size="icon" aria-label="Add">
                    <Plus />
                  </Button>
                  <Button size="icon-lg" aria-label="Add">
                    <Plus />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="mb-16" />

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>
      </div>
    </section>
  );
}
