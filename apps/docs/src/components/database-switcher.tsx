"use client";

import { ChevronDownIcon, DatabaseIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@prisma/eclipse";
import { useDatabaseSelection } from "@/components/database-provider";
import { DATABASES, normalizeDatabase } from "@/lib/database-selection";

export function DatabaseSwitcher() {
  const { database, availableDatabases, selectDatabase } = useDatabaseSelection();
  if (availableDatabases.length < 2) return null;

  const label = DATABASES.find(({ id }) => id === database)?.label ?? "Select database";

  return (
    <div className="flex flex-col gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={
            database ? `Select example database, currently ${label}` : "Select example database"
          }
          className="group flex w-full cursor-pointer items-center gap-2.5 rounded-full border border-stroke-neutral bg-fd-background px-3.5 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent motion-reduce:transition-none"
        >
          <DatabaseIcon className="size-4 shrink-0 text-fd-primary" aria-hidden="true" />
          <span className="flex-1 text-left">{label}</span>
          <ChevronDownIcon className="size-4 text-fd-muted-foreground" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-(--radix-dropdown-menu-trigger-width) rounded-(--radius-square-high) border-stroke-neutral"
        >
          <DropdownMenuRadioGroup
            value={database ?? ""}
            onValueChange={(value) => {
              const database = normalizeDatabase(value);
              if (database) selectDatabase(database);
            }}
          >
            {DATABASES.filter(({ id }) => availableDatabases.includes(id)).map(({ id, label }) => (
              <DropdownMenuRadioItem key={id} value={id} className="cursor-pointer">
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {database && !availableDatabases.includes(database) && (
        <p className="px-1 text-xs text-fd-muted-foreground">
          {label} examples aren’t available here.
        </p>
      )}
    </div>
  );
}
