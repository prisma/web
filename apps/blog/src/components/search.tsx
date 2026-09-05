"use client";
import { UnifiedSearchDialog } from "@prisma-docs/ui/components/unified-search";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";
export default function CustomSearchDialog(props: SharedProps) {
  return (
    <UnifiedSearchDialog
      open={props.open}
      onOpenChange={props.onOpenChange}
      api="/blog/api/search"
    />
  );
}
