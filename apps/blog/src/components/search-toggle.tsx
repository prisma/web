'use client';
import type { ComponentProps } from 'react';
import { Search } from 'lucide-react';
import { useSearchContext } from '@fumadocs/base-ui/contexts/search';
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
        'flex items-center justify-center gap-2 hover:cursor-pointer md:justify-between py-2.5 transition-colors hover:bg-background-ppg/50',
        props.className,
      )}
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <span className="hidden text-sm text-foreground-neutral-weak md:inline-flex">
        Search the blog
      </span>
      <Search className="size-4 justify-end" />

    </Button>
  );
}
