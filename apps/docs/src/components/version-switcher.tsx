"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";

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
  const isGettingStartedVersion = isGettingStartedVersionPathname(pathname);
  const isCliVersion = isCliVersionPathname(pathname);
  const isGuidesVersion = isGuidesVersionPathname(pathname);

  // Getting Started no longer has a version toggle: Prisma Next lives inline in the
  // getting-started sidebar as its own sections, so there is no "Docs version" dropdown.
  if (isGettingStartedVersion) {
    return null;
  }

  const detectedVersion =
    getGettingStartedVersionFromPathname(pathname) ??
    getCliVersionFromPathname(pathname) ??
    getGuidesVersionFromPathname(pathname) ??
    getOrmVersionFromPathname(pathname);
  const currentVersion = detectedVersion ?? null;
  const usesScopedVersions = isGettingStartedVersion || isCliVersion || isGuidesVersion;
  const visibleVersions = usesScopedVersions
    ? versions.filter((version) => version === LATEST_VERSION || version === "next")
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

  const handleVersionChange = (newVersion: Version) => {
    if (newVersion === currentVersion) return;

    router.push(getVersionSwitchPathname(pathname, newVersion, availablePathnames));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="px-1 text-xs font-medium text-fd-muted-foreground">{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Select ${label.toLowerCase()}`}
          className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-fd-background px-3 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
        >
          <span>{getVersionLabel(currentVersion)}</span>
          <ChevronDownIcon className="size-4 text-fd-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-(--radix-dropdown-menu-trigger-width)">
          <DropdownMenuRadioGroup value={currentVersion} onValueChange={handleVersionChange}>
            {visibleVersions.map((version) => (
              <DropdownMenuRadioItem
                key={version}
                value={version}
                className="cursor-pointer transition-colors hover:bg-fd-accent"
              >
                {getVersionLabel(version)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
