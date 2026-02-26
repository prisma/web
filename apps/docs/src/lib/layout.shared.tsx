import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import logoDark from '../../public/img/logo-dark.svg';
import logoWhite from '../../public/img/logo-white.svg';
import { DiscordIcon } from '@/components/icons/discord';
import Link from 'next/link';

export const logo = (
  <>
    <Image
      alt="Prisma"
      src={logoDark}
      aria-label="Prisma"
      className="dark:hidden"
    />
    <Image
      alt="Prisma"
      src={logoWhite}
      aria-label="Prisma"
      className="hidden dark:block"
    />
  </>
);

type LinkItemTypeWithActivePaths = LinkItemType & {
  activePaths?: string[];
};

export const links: LinkItemTypeWithActivePaths[] = [
  {
    text: 'Getting Started',
    url: '/',
    active: 'nested-url',
    activePaths: ['/', '/prisma-orm', '/prisma-postgres'],
  },
  {
    text: 'ORM',
    url: '/orm',
    active: 'nested-url',
  },
  {
    text: 'Postgres',
    url: '/postgres',
    active: 'nested-url',
  },
  {
    text: 'CLI',
    url: '/cli',
    active: 'nested-url',
  },
  {
    text: 'Guides',
    url: '/guides',
    active: 'nested-url',
  },
  {
    text: 'More',
    type: 'menu',
    items: [
      { text: 'Management API', url: '/management-api', active: 'nested-url' },
      { text: 'Studio', url: '/studio', active: 'nested-url' },
      { text: 'AI', url: '/ai', active: 'nested-url' },
      { text: 'Optimize', url: '/optimize', active: 'nested-url' },
      { text: 'Accelerate', url: '/accelerate', active: 'nested-url' },
      { text: 'Console', url: '/console', active: 'nested-url' },
    ],
  },
  {
    type: 'icon',
    label: 'Join Discord',
    icon: <DiscordIcon />,
    text: 'Discord',
    url: 'https://pris.ly/discord?utm_source=docs&utm_medium=navbar',
  },
];

export const docsLinks: LinkItemType[] = [];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Link href="https://www.prisma.io">{logo} </Link> /
          <Link
            href="/"
            className="group relative inline-block"
          >
            <span className="font-mono text-lg">docs</span>
            <span
              className="absolute bottom-0 left-0 h-px w-full translate-y-full bg-current opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-y-0 group-hover:opacity-100"
              aria-hidden
            />
          </Link>
        </>
      ),
      transparentMode: 'none',
    },
    githubUrl: 'https://pris.ly/github?utm_source=docs&utm_medium=navbar',
  };
}
