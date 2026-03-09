'use client';
import type { ComponentProps } from 'react';
import { Search } from 'lucide-react';
import { useSearchContext } from '@fumadocs/base-ui/contexts/search';
import { useI18n } from '@fumadocs/base-ui/contexts/i18n';
import { cn } from '@prisma-docs/ui/lib/cn';
import { Button } from '@prisma/eclipse';


export function LargeSearchToggle({
  ...props
}: ComponentProps<'button'>) {
  const { setOpenSearch } = useSearchContext();
  return (
    <Button
      variant="default"
      className={cn(
        'flex justify-between items-center gap-2 hover:cursor-pointer',
        props.className,
      )}
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <span className="text-sm text-foreground-neutral-weak">Search the blog</span>
      <Search className="size-4 justify-end" />

    </Button>
  );
}
