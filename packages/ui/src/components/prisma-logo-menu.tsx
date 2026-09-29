"use client";

import { Menu } from "@base-ui/react/menu";
// A namespace import rather than named hooks: the docs tests render this
// through tsx, which compiles files outside apps/docs with the classic JSX
// transform, and that needs `React` in scope.
import * as React from "react";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";
// Copies of the brand kit's files (apps/site/public/brand-kit), bundled here
// so the menu works in every zone, preview deployment, and local dev server
// without depending on the site app serving /brand-kit.
import lockupPng from "../assets/brand/full-color.png";
import lockupSvg from "../assets/brand/full-color.svg";
import symbolPng from "../assets/brand/logo-mark.png";
import symbolSvg from "../assets/brand/logo-mark.svg";

// Colours are literal rather than theme tokens: the site, docs, and blog map
// the same token names to different values, and this menu has to look the
// same in all three. Light values are the site's; dark values are the site's
// dark palette, for the docs and blog. The tile previews stay light in dark
// mode because they show what gets copied: the full-colour logo on white.

const COPY_TILES = [
  {
    key: "logo",
    label: "Copy logo",
    svg: lockupSvg.src as string,
    png: lockupPng.src,
    imgClass: "h-6 w-auto",
  },
  {
    key: "symbol",
    label: "Copy symbol",
    svg: symbolSvg.src as string,
    png: symbolPng.src,
    imgClass: "h-8 w-auto",
  },
] as const;

type CopyTile = (typeof COPY_TILES)[number];

const itemClass =
  "flex cursor-default select-none items-center gap-2 rounded-[6px] px-2 py-1.5 text-[#3a3b3c] no-underline outline-none data-highlighted:bg-[oklch(0.97_0_0)] dark:text-[oklch(0.985_0_0)] dark:data-highlighted:bg-[oklch(0.269_0_0)]";
const itemIconClass = "size-4 shrink-0 text-[#646567] dark:text-[oklch(0.708_0_0)]";

function track(cta_text: string, cta_destination: string) {
  trackCTA({ cta_text, cta_location: "navbar_logo_menu", cta_destination });
}

function loadBlob(src: string, type: string) {
  return fetch(src).then(async (res) => {
    if (!res.ok) throw new Error(`Failed to load ${src}`);
    return new Blob([await res.blob()], { type });
  });
}

// Puts a logo on the clipboard in two formats and lets the paste target pick:
// the SVG markup as text, which Figma pastes as vectors and code editors as
// source, and the rendered PNG, which Slack, docs, and slides paste as an
// image. The files are fetched after the click, so they go in as pending
// blobs: Safari only honours clipboard writes that start inside the gesture.
async function copyLogo({ svg, png }: CopyTile) {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": loadBlob(svg, "text/plain"),
        "image/png": loadBlob(png, "image/png"),
      }),
    ]);
  } else {
    await navigator.clipboard.writeText(await (await loadBlob(svg, "text/plain")).text());
  }
}

/**
 * Wraps a header logo link. A left click still follows the link; a right
 * click (or the context-menu key) opens a small brand menu anchored under the
 * logo, after the one on vercel.com: copy the logo or the symbol, download the
 * brand kit, or go to the brand & press kit page.
 *
 * `siteUrl` is where the site zone lives: "" on the site itself, so its links
 * stay relative, and the prisma.io origin (the default) from docs and blog.
 */
export function PrismaLogoMenu({
  children,
  siteUrl = "https://www.prisma.io",
}: {
  children: React.ReactNode;
  siteUrl?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [copyStatus, setCopyStatus] = React.useState<{
    key: CopyTile["key"];
    result: "copied" | "failed";
  } | null>(null);
  // `display: contents`, so wrapping the link changes nothing about how the
  // header lays it out; the menu anchors to the link itself.
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const closeReason = React.useRef<string | undefined>(undefined);
  // Counts openings, so a copy that settles after its menu has closed and
  // reopened doesn't report into (or close) the new one.
  const openCount = React.useRef(0);
  const brandKitUrl = `${siteUrl}/brand-kit`;
  const zipUrl = `${brandKitUrl}/prisma-brand-kit.zip`;

  function onOpenChange(next: boolean, details?: Menu.Root.ChangeEventDetails) {
    setOpen(next);
    if (next) {
      openCount.current += 1;
      setCopyStatus(null);
    } else {
      closeReason.current = details?.reason;
    }
  }

  // Hold the menu open for a beat after a copy so "Copied" can be read. A
  // failed copy leaves it open with "Couldn't copy" on the tile.
  React.useEffect(() => {
    if (copyStatus?.result !== "copied") return;
    const timer = setTimeout(() => onOpenChange(false), 900);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  function copy(tile: CopyTile) {
    track(tile.label, tile.svg);
    const opening = openCount.current;
    const settle = (result: "copied" | "failed") => {
      if (openCount.current === opening) setCopyStatus({ key: tile.key, result });
    };
    // Fails when the clipboard is unavailable (insecure context, denied
    // permission) or a file doesn't load.
    copyLogo(tile).then(
      () => settle("copied"),
      () => settle("failed"),
    );
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className="contents"
        onContextMenu={(event) => {
          event.preventDefault();
          onOpenChange(true);
        }}
      >
        {children}
      </div>
      <Menu.Root open={open} onOpenChange={onOpenChange} modal={false}>
        <Menu.Portal>
          <Menu.Positioner
            anchor={() => wrapperRef.current?.firstElementChild ?? null}
            side="bottom"
            align="start"
            alignOffset={-8}
            sideOffset={14}
            className="z-50 outline-none"
          >
            <Menu.Popup
              aria-label="Prisma brand assets"
              // Return focus to the logo link, unless the visitor closed the
              // menu by clicking or tabbing somewhere else.
              finalFocus={() =>
                closeReason.current === "outside-press" || closeReason.current === "focus-out"
                  ? false
                  : (wrapperRef.current?.querySelector<HTMLElement>("a[href]") ?? true)
              }
              className="w-80 origin-(--transform-origin) rounded-[14px] border border-[oklch(0.922_0_0)] bg-white p-1.5 text-[14px] leading-[20px] text-[#3a3b3c] shadow-[0_1px_2px_rgba(21,21,21,0.04),0_12px_32px_-8px_rgba(21,21,21,0.18)] outline-none transition-[opacity,scale,translate] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none dark:border-white/10 dark:bg-[oklch(0.205_0_0)] dark:text-[oklch(0.985_0_0)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_12px_32px_-8px_rgba(0,0,0,0.8)]"
            >
              <div className="grid grid-cols-2 gap-1.5">
                {COPY_TILES.map((tile) => (
                  <Menu.Item
                    key={tile.key}
                    label={tile.label}
                    closeOnClick={false}
                    onClick={() => copy(tile)}
                    className="group/tile flex cursor-default select-none flex-col items-stretch gap-2 rounded-[6px] p-1 outline-none"
                  >
                    <span className="flex h-16 items-center justify-center rounded-[10px] border border-[oklch(0.922_0_0)]/80 bg-[oklch(0.97_0_0)]/60 transition-colors group-data-highlighted/tile:border-[#3a3b3c]/15 group-data-highlighted/tile:bg-[oklch(0.97_0_0)] dark:border-white/10 dark:bg-white dark:group-data-highlighted/tile:border-white/40 dark:group-data-highlighted/tile:bg-[oklch(0.97_0_0)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tile.svg} alt="" className={tile.imgClass} />
                    </span>
                    <span aria-live="polite" className="flex items-center gap-1.5 px-1">
                      {copyStatus?.key !== tile.key ? (
                        tile.label
                      ) : copyStatus.result === "copied" ? (
                        <>
                          <CheckIcon className="size-3.5" aria-hidden />
                          Copied
                        </>
                      ) : (
                        <>
                          <XIcon className="size-3.5" aria-hidden />
                          Couldn&apos;t copy
                        </>
                      )}
                    </span>
                  </Menu.Item>
                ))}
              </div>
              <Menu.Separator className="-mx-1.5 my-1.5 h-px bg-[oklch(0.922_0_0)] dark:bg-white/10" />
              <Menu.LinkItem
                href={zipUrl}
                download
                closeOnClick
                onClick={() => track("Download brand assets", zipUrl)}
                className={itemClass}
              >
                <DownloadIcon className={itemIconClass} aria-hidden />
                Download brand assets
              </Menu.LinkItem>
              <Menu.LinkItem
                href={brandKitUrl}
                onClick={() => track("Brand & press kit", brandKitUrl)}
                className={itemClass}
              >
                <LayersIcon className={itemIconClass} aria-hidden />
                Brand &amp; press kit
              </Menu.LinkItem>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </>
  );
}

// Forma Thin glyphs, copied from the site's icon set
// (apps/site/src/components/icons/forma.tsx) so the menu matches it exactly.
function FormaIcon({ d, ...props }: React.SVGProps<SVGSVGElement> & { d: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d={d} />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <FormaIcon
      d="M 21.490234 5.9960938 A 0.50005 0.50005 0 0 0 21.146484 6.1464844 L 9.0136719 18.292969 L 2.8535156 12.146484 A 0.50005 0.50005 0 1 0 2.1464844 12.853516 L 8.6601562 19.353516 A 0.50005 0.50005 0 0 0 9.3671875 19.353516 L 21.853516 6.8535156 A 0.50005 0.50005 0 0 0 21.490234 5.9960938 z"
      {...props}
    />
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <FormaIcon
      d="M 20.496094 2.9921875 A 0.50005 0.50005 0 0 0 20.146484 3.1464844 L 12 11.292969 L 3.8535156 3.1464844 A 0.50005 0.50005 0 0 0 3.4941406 2.9941406 A 0.50005 0.50005 0 0 0 3.1464844 3.8535156 L 11.292969 12 L 3.1464844 20.146484 A 0.50005 0.50005 0 1 0 3.8535156 20.853516 L 12 12.707031 L 20.146484 20.853516 A 0.50005 0.50005 0 1 0 20.853516 20.146484 L 12.707031 12 L 20.853516 3.8535156 A 0.50005 0.50005 0 0 0 20.496094 2.9921875 z"
      {...props}
    />
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <FormaIcon
      d="M 11.970703 2 A 0.50005 0.50005 0 0 0 11.785156 2.0488281 L 2.2851562 6.5488281 A 0.50005 0.50005 0 0 0 2.2851562 7.4511719 L 6.6113281 9.5 L 2.2851562 11.548828 A 0.50005 0.50005 0 0 0 2.2851562 12.451172 L 6.6113281 14.5 L 2.2851562 16.548828 A 0.50005 0.50005 0 0 0 2.2851562 17.451172 L 11.785156 21.951172 A 0.50005 0.50005 0 0 0 12.214844 21.951172 L 21.714844 17.451172 A 0.50005 0.50005 0 0 0 21.714844 16.548828 L 17.388672 14.5 L 21.714844 12.451172 A 0.50005 0.50005 0 0 0 21.714844 11.548828 L 17.388672 9.5 L 21.714844 7.4511719 A 0.50005 0.50005 0 0 0 21.714844 6.5488281 L 12.214844 2.0488281 A 0.50005 0.50005 0 0 0 11.970703 2 z M 12 3.0527344 L 20.332031 7 L 16.123047 8.9941406 A 0.50005 0.50005 0 0 0 15.863281 9.1171875 L 12 10.947266 L 8.0722656 9.0878906 A 0.50005 0.50005 0 0 0 8.0644531 9.0839844 A 0.50005 0.50005 0 0 0 7.9277344 9.0175781 L 3.6679688 7 L 12 3.0527344 z M 7.7773438 10.052734 L 11.785156 11.951172 A 0.50005 0.50005 0 0 0 12.214844 11.951172 L 16.222656 10.052734 L 20.332031 12 L 16.123047 13.994141 A 0.50005 0.50005 0 0 0 15.863281 14.117188 L 12 15.947266 L 8.0722656 14.087891 A 0.50005 0.50005 0 0 0 8.0644531 14.083984 A 0.50005 0.50005 0 0 0 7.9277344 14.017578 L 3.6679688 12 L 7.7773438 10.052734 z M 7.7773438 15.052734 L 11.785156 16.951172 A 0.50005 0.50005 0 0 0 12.214844 16.951172 L 16.222656 15.052734 L 20.332031 17 L 12 20.947266 L 3.6679688 17 L 7.7773438 15.052734 z"
      {...props}
    />
  );
}

// Stroke-drawn in the Forma voice; the fetched set had no download glyph.
function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v11" />
      <path d="m7.5 9.5 4.5 4.5 4.5-4.5" />
      <path d="M4 20.5h16" />
    </svg>
  );
}
