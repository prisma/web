import type { ComponentProps } from 'react';
import { source } from '@/lib/source';
import { baseOptions, links } from '@/lib/layout.shared';
import { VersionSwitcher } from '@/components/version-switcher';
import type { LinkItemType } from 'fumadocs-ui/layouts/shared';
import { DocsLayout } from '@/components/layout/notebook';
import { LATEST_VERSION } from '@/lib/version';
import { StatusIndicator } from '@/components/status-indicator';
import { cn } from '@prisma-docs/ui/lib/cn';

export default async function Layout({ children, }: { children: React.ReactNode; }) {
  const { nav, ...base } = baseOptions();

  const navbarLinks: LinkItemType[] = [
    ...links,
    {
      type: 'custom',
      children: <VersionSwitcher currentVersion={LATEST_VERSION} />,
    },
  ];

  return (
    <DocsLayout
      {...base}
      links={navbarLinks}
      nav={{ ...nav }}
      sidebar={{
        collapsible: false,
        footer: ({ className, ...props }: ComponentProps<'div'>) => (
          <div className={cn('flex flex-col p-4 pt-2 gap-3', className)} {...props}>
            <StatusIndicator />
            {props.children}
          </div>
        ),
      }}
      tree={source.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
