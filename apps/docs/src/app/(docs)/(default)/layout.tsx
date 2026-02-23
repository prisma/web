import { source } from '@/lib/source';
import { baseOptions, links } from '@/lib/layout.shared';
import { VersionSwitcher } from '@/components/version-switcher';
import type { LinkItemType } from 'fumadocs-ui/layouts/shared';
import { DocsLayout } from '@/components/layout/notebook';
import { LATEST_VERSION } from '@/lib/version';

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
      sidebar={{ collapsible: false }}
      tree={source.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
