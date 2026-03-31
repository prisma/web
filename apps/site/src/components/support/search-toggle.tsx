'use client';
import type { ComponentProps } from 'react';
import { Search } from 'lucide-react';
import { useSearchContext } from '@fumadocs/base-ui/contexts/search';
import { cn } from '@prisma-docs/ui/lib/cn';
import { Button } from '@prisma/eclipse';


export function LargeSearchToggle({
  className,
  onClick,
  ...props
}: ComponentProps<'button'>) {
  const { setOpenSearch } = useSearchContext();
  return (
    <Button
      {...props}
      aria-label={props["aria-label"] ?? "Search the blog"}
      variant="default"
      className={cn(
        'flex items-center justify-center gap-2 hover:cursor-pointer md:justify-between py-2.5 transition-colors hover:bg-background-ppg/50',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpenSearch(true);
        }
      }}
    >
      <span className="sr-only text-sm text-foreground-neutral-weak md:not-sr-only md:inline-flex">
        Search the blog
      </span>
      <Search className="size-4 justify-end" />

    </Button>
  );
}
