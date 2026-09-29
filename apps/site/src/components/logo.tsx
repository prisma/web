"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MASTER_ZIP, PRIMARY_LOCKUP, PRIMARY_SYMBOL } from "@/components/brand-kit/content";
import { Check, Download, Layers } from "@/components/icons/forma";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/lib/config";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";

const COPY_TILES = [
  { key: "logo", label: "Copy logo", src: PRIMARY_LOCKUP, imgClass: "h-6 w-auto" },
  { key: "symbol", label: "Copy symbol", src: PRIMARY_SYMBOL, imgClass: "h-8 w-auto" },
] as const;

type TileKey = (typeof COPY_TILES)[number]["key"];

function track(cta_text: string, cta_destination: string) {
  trackCTA({ cta_text, cta_location: "navbar_logo_menu", cta_destination, section: "website" });
}

// Puts an SVG file's markup on the clipboard, ready to paste into Figma or a
// code editor. The file is fetched after the click, so the pending text goes
// in a ClipboardItem: Safari only honours writes that start inside the gesture.
async function copySvg(src: string) {
  const markup = fetch(src).then((res) => {
    if (!res.ok) throw new Error(`Failed to load ${src}`);
    return res.text();
  });
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
    const blob = markup.then((svg) => new Blob([svg], { type: "text/plain" }));
    await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
  } else {
    await navigator.clipboard.writeText(await markup);
  }
}

// The header logo. A left click goes home; a right click opens a small brand
// menu anchored under the logo (after Vercel's): copy the logo or symbol as
// SVG, download the full kit, or go to the brand & press kit page.
export function Logo() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<TileKey | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const dismissedOutside = useRef(false);

  // Hold the menu open for a beat after a copy so "Copied" can be read.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setOpen(false), 900);
    return () => clearTimeout(timer);
  }, [copied]);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next) setCopied(null);
  }

  function copy(tile: (typeof COPY_TILES)[number]) {
    track(tile.label, tile.src);
    copySvg(tile.src).then(
      () => setCopied(tile.key),
      () => {
        // Clipboard can be unavailable (insecure context); leave the menu open.
      },
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
      <div className="relative flex items-center">
        <Link
          ref={linkRef}
          href="/"
          className="flex items-center"
          onContextMenu={(event) => {
            event.preventDefault();
            onOpenChange(true);
          }}
        >
          <Image
            src="/logo/full-color.svg"
            alt={siteConfig.name}
            width={110}
            height={28}
            priority
          />
        </Link>
        {/* Positions the menu; it is not a control. Radix's trigger opens on a
            left click, which has to stay "go home", so the link above opens
            the menu from its contextmenu event instead. */}
        <DropdownMenuTrigger asChild>
          <span aria-hidden className="pointer-events-none absolute inset-0" />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align="start"
        alignOffset={-8}
        sideOffset={14}
        aria-labelledby={undefined}
        aria-label="Prisma brand assets"
        className="w-80 rounded-xl p-1.5 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_12px_32px_-8px_rgba(21,21,21,0.18)]"
        onInteractOutside={() => {
          dismissedOutside.current = true;
        }}
        onCloseAutoFocus={(event) => {
          // Return focus to the logo link rather than the hidden anchor, unless
          // the menu closed because the visitor clicked somewhere else.
          event.preventDefault();
          if (!dismissedOutside.current) linkRef.current?.focus({ preventScroll: true });
          dismissedOutside.current = false;
        }}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {COPY_TILES.map((tile) => (
            <DropdownMenuItem
              key={tile.key}
              className="group/tile flex-col items-stretch gap-2 p-1 focus:bg-transparent"
              onSelect={(event) => {
                event.preventDefault();
                copy(tile);
              }}
            >
              <span className="flex h-16 items-center justify-center rounded-lg border border-border/80 bg-muted/60 transition-colors group-data-[highlighted]/tile:border-foreground/15 group-data-[highlighted]/tile:bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tile.src} alt="" className={tile.imgClass} />
              </span>
              <span className="flex items-center gap-1.5 px-1 text-foreground">
                {copied === tile.key ? (
                  <>
                    <Check className="size-3.5 text-foreground" aria-hidden />
                    Copied
                  </>
                ) : (
                  tile.label
                )}
              </span>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="-mx-1.5 my-1.5" />
        <DropdownMenuItem asChild>
          <a href={MASTER_ZIP} download onClick={() => track("Download brand assets", MASTER_ZIP)}>
            <Download />
            Download brand assets
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/brand-kit" onClick={() => track("Brand & press kit", "/brand-kit")}>
            <Layers />
            Brand &amp; press kit
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
