"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";

const loadSearch = () => import("./search-dialog");
const LoadedSearchDialog = lazy(loadSearch);

/** Hover, keyboard focus and touch intent can warm the chunk before opening. */
export function preloadSearch() {
  void loadSearch().catch(() => {});
}

/** Keep search's fetching/interaction code out of the initial reading path. */
export default function CustomSearchDialog(props: SharedProps) {
  const [hasOpened, setHasOpened] = useState(props.open);
  useEffect(() => {
    if (props.open) setHasOpened(true);
  }, [props.open]);
  if (!props.open && !hasOpened) return null;
  return (
    <Suspense
      fallback={
        <Dialog.Root
          open={props.open}
          onOpenChange={props.onOpenChange}
          handle={props.dialogHandle}
        >
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 backdrop-blur-xs bg-fd-overlay" />
            <Dialog.Popup
              aria-describedby={undefined}
              className="prisma-unified-search fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 border-b p-3">
                <Dialog.Title className="flex-1">Search Prisma</Dialog.Title>
                <Dialog.Close
                  aria-label="Close search"
                  className="rounded border px-2 py-1 text-xs"
                >
                  Esc
                </Dialog.Close>
              </div>
              <p role="status" className="px-4 py-6 text-sm text-fd-muted-foreground">
                Loading search…
              </p>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      }
    >
      <LoadedSearchDialog {...props} />
    </Suspense>
  );
}
