import type { Metadata } from "next";
import { CtaBurst } from "@/components/sections/cta-burst";
import { BrandKitHero } from "@/components/brand-kit/brand-kit-hero";
import { BrandKitLogo } from "@/components/brand-kit/brand-kit-logo";
import { BrandKitVariants } from "@/components/brand-kit/brand-kit-variants";
import { BrandKitClearspace } from "@/components/brand-kit/brand-kit-clearspace";
import { BrandKitMisuse } from "@/components/brand-kit/brand-kit-misuse";
import { BrandKitColor } from "@/components/brand-kit/brand-kit-color";
import { BrandKitType } from "@/components/brand-kit/brand-kit-type";
import { BrandKitElements } from "@/components/brand-kit/brand-kit-elements";
import { BrandKitMascot } from "@/components/brand-kit/brand-kit-mascot";
import { BrandKitCobranding } from "@/components/brand-kit/brand-kit-cobranding";
import { MASTER_ZIP } from "@/components/brand-kit/content";

export const metadata: Metadata = {
  alternates: { canonical: "/brand-kit" },
  title: "Brand & Press Kit",
  description:
    "Download Prisma logos and mascot art in every format, with the colours, typography, and guidelines that keep the brand consistent — for partners, integrations, and press.",
};

// The public brand & press kit. Built at /brand-kit so the internal
// design-system reference at /brand is untouched; can be promoted to /brand
// once the copy (boilerplate, facts, usage terms) is signed off.
export default function BrandKitPage() {
  return (
    <>
      <BrandKitHero />
      <BrandKitLogo />
      <BrandKitVariants />
      <BrandKitClearspace />
      <BrandKitMisuse />
      <BrandKitColor />
      <BrandKitType />
      <BrandKitElements />
      <BrandKitMascot />
      <BrandKitCobranding />
      <CtaBurst
        headline="Take the whole pack with you"
        headlineMaxWidth="max-w-[20ch]"
        body="Every logo and every mascot expression, in a single download."
        bodyMaxWidth="max-w-[40ch]"
        checks={[
          { label: "Seven treatments, SVG / PNG / JPG", color: "text-prism-cyan-500" },
          { label: "Colour values and type in this page", color: "text-prism-yellow-400" },
          { label: "Guidelines so it always looks like Prisma", color: "text-prism-red-500" },
        ]}
        primaryCta={{ label: "Download the kit", href: MASTER_ZIP }}
        secondaryCta={{ label: "Browse the assets", href: "#downloads" }}
      />
    </>
  );
}
