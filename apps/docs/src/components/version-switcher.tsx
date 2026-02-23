'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronDownIcon } from 'lucide-react';

import { VERSIONS, LATEST_VERSION, type Version } from '@/lib/version';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@prisma-docs/eclipse';

interface VersionSwitcherProps {
  currentVersion: Version;
}

export function VersionSwitcher({ currentVersion }: VersionSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleVersionChange = (newVersion: string) => {
    if (newVersion === currentVersion) return;

    const VERSION_SECTIONS: Record<string, Set<string>> = {
      v7: new Set(['accelerate', 'ai', 'cli', 'console', 'guides', 'management-api', 'optimize', 'orm', 'postgres', 'studio']),
      v6: new Set(['accelerate', 'ai', 'guides', 'optimize', 'orm', 'platform', 'postgres']),
    };

    const rawPath = pathname.replace(/^\/v\d+(?=\/|$)/, '') || '/';
    const topSection = rawPath.split('/').filter(Boolean)[0] ?? '';
    const sectionExists = VERSION_SECTIONS[newVersion]?.has(topSection);

    let newPath: string;
    if (newVersion === LATEST_VERSION) {
      newPath = sectionExists ? `/${topSection}` : '/';
    } else {
      newPath = sectionExists ? `/${newVersion}/${topSection}` : `/${newVersion}`;
    }

    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border bg-fd-background px-3 py-1.5 text-sm font-medium text-fd-foreground hover:bg-fd-accent transition-colors cursor-pointer">
        {currentVersion}
        <ChevronDownIcon className="size-4 text-fd-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={currentVersion}
          onValueChange={handleVersionChange}
        >
          {VERSIONS.map((v) => (
            <DropdownMenuRadioItem
              key={v}
              value={v}
              className="cursor-pointer transition-colors hover:bg-fd-accent"
            >
              {v}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
