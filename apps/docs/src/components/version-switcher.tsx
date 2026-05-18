"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";

import {
  getOrmVersionFromPathname,
  getVersionLabel,
  getVersionRoot,
  type Version,
} from "@/lib/version";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@prisma/eclipse";

export function VersionSwitcher({ versions }: { versions: Version[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentVersion = getOrmVersionFromPathname(pathname);

  if (!currentVersion || !versions.includes(currentVersion)) {
    return null;
  }

  const handleVersionChange = (newVersion: Version) => {
    if (newVersion === currentVersion) return;

    router.push(getVersionRoot(newVersion));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center rounded-md border background bg-fd-background px-3 py-1.5 text-sm font-medium text-fd-foreground hover:bg-fd-accent transition-colors cursor-pointer justify-between">
        <p>{getVersionLabel(currentVersion)}</p>
        <ChevronDownIcon className="size-4 text-fd-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={currentVersion}
          onValueChange={handleVersionChange}
        >
          {versions.map((v) => (
            <DropdownMenuRadioItem
              key={v}
              value={v}
              className="cursor-pointer transition-colors hover:bg-fd-accent"
            >
              {getVersionLabel(v)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
