"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTreeContext } from "@fumadocs/base-ui/contexts/tree";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import {
  getCliVersionFromPathname,
  getGettingStartedVersionFromPathname,
  getGuidesVersionFromPathname,
  getOrmVersionFromPathname,
  getVersionLabel,
  getVersionSwitchPathname,
  isCliVersionPathname,
  isGettingStartedVersionPathname,
  isGuidesVersionPathname,
  LATEST_VERSION,
  type Version,
} from "@/lib/version";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@prisma/eclipse";

export function VersionSwitcher({
  versions,
  availablePathnames,
}: {
  versions: Version[];
  availablePathnames?: string[];
}) {
  const pathname = usePathname() as string;
  const router = useRouter();
  const { root } = useTreeContext();
  const isGettingStartedVersion = isGettingStartedVersionPathname(pathname);
  const isCliVersion = isCliVersionPathname(pathname);
  const isGuidesVersion = isGuidesVersionPathname(pathname);

  const detectedVersion =
    getGettingStartedVersionFromPathname(pathname) ??
    getCliVersionFromPathname(pathname) ??
    getGuidesVersionFromPathname(pathname) ??
    getOrmVersionFromPathname(pathname);
  const currentVersion = detectedVersion ?? null;
  // Getting Started, Guides, and the CLI exist only for Latest (Prisma 8) and
  // v7; the ORM section lists every version, including v6.
  const visibleVersions =
    isGettingStartedVersion || isGuidesVersion || isCliVersion
      ? versions.filter((version) => version === LATEST_VERSION || version === "v7")
      : versions;
  const label = isGettingStartedVersion
    ? "Docs version"
    : isCliVersion
      ? "CLI version"
      : isGuidesVersion
        ? "Guides version"
        : "ORM version";

  if (!currentVersion || !visibleVersions.includes(currentVersion)) {
    return null;
  }

  // The ORM section lists the upgrade guides, whose paths are under /guides. The
  // sidebar then shows the ORM tree while this switcher follows the path, so hide
  // it rather than show a Guides switcher under an ORM header.
  const rootIsOrm = root.name === "ORM";
  if (rootIsOrm && getOrmVersionFromPathname(pathname) === null) {
    return null;
  }

  const handleVersionChange = (newVersion: Version) => {
    if (newVersion === currentVersion) return;

    router.push(getVersionSwitchPathname(pathname, newVersion, availablePathnames));
  };

  return (
    <DropdownMenu>
      {/* One quiet row in the sidebar's own language: the label and the
          current version share the line, a hairline border with no fill, the
          rows' `rounded-square` corners, and the same crisp ink-tint hover
          (instant in, 120ms out). */}
      <DropdownMenuTrigger
        aria-label={`Select ${label.toLowerCase()}`}
        className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-square border border-stroke-neutral px-2 text-sm transition-colors duration-[120ms] ease-out outline-none hover:bg-fd-foreground/5 hover:duration-0 focus-visible:ring-2 focus-visible:ring-fd-foreground/60 motion-reduce:transition-none"
      >
        <span className="text-fd-muted-foreground">{label}</span>
        <span className="ms-auto font-medium text-fd-foreground">
          {getVersionLabel(currentVersion)}
        </span>
        <ChevronDownIcon className="size-3.5 text-fd-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      {/* A compact panel that matches the trigger: the sidebar's
          `rounded-(--radius-square)` corners (the CSS-variable form, so
          tailwind-merge drops the eclipse `rounded-md`), a hairline border
          and a light shadow. */}
      <DropdownMenuContent
        align="start"
        className="min-w-(--radix-dropdown-menu-trigger-width) rounded-(--radius-square) border-stroke-neutral p-1 shadow-box-low"
      >
        <DropdownMenuRadioGroup value={currentVersion} onValueChange={handleVersionChange}>
          {visibleVersions.map((version) => (
            // Compact rows in muted ink with the sidebar's faint tint on
            // hover and keyboard focus. The selected version is marked by
            // full ink and a trailing check rather than eclipse's leading
            // bullet (its indicator slot, the first child, is hidden) and
            // grey fill.
            <DropdownMenuRadioItem
              key={version}
              value={version}
              className="mb-0 h-8 cursor-pointer gap-2 rounded-[calc(var(--radius-square)-4px)] py-0 pr-2 pl-2.5 text-sm text-fd-foreground/70 focus:bg-fd-foreground/5 focus:text-fd-foreground data-[state=checked]:bg-transparent data-[state=checked]:font-medium data-[state=checked]:text-fd-foreground data-[state=checked]:focus:bg-fd-foreground/5 [&>span:first-child]:hidden"
            >
              {getVersionLabel(version)}
              {version === currentVersion && (
                <CheckIcon className="ms-auto size-3.5" aria-hidden="true" />
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
