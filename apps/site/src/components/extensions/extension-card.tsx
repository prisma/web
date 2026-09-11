import Link from "next/link";
import type { ExtensionEntry } from "@prisma-docs/ui/data/extensions";
import { CheckBold } from "@/components/icons/forma";
import { getDatabaseLabel, EXTENSION_STATUS_LABELS } from "@prisma-docs/ui/data/extensions";
import { MONO } from "./copy-command";

/**
 * One cell of the directory grid: name, package, what it adds, and where it
 * runs. Kept to a fixed shape so a page of cards scans as a table would; the
 * install command and registration snippets live on the detail page.
 */
export function ExtensionCard({ entry }: { entry: ExtensionEntry }) {
  return (
    <li className="group relative flex flex-col gap-2.5 rounded-xl border border-black/[0.12] bg-white p-4 transition-colors hover:border-primary hover:bg-paper">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-[15px] font-semibold leading-snug text-primary">
          <Link
            href={`/extensions/${entry.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {entry.name}
          </Link>
        </h3>
        {entry.status === "experimental" ? (
          <span className="shrink-0 rounded-full border border-prism-yellow-700/40 bg-prism-yellow-50 px-1.5 py-px text-[11px] font-medium text-prism-yellow-700">
            {EXTENSION_STATUS_LABELS.experimental}
          </span>
        ) : null}
      </div>
      <p className={`truncate text-xs text-muted-foreground ${MONO}`} title={entry.package}>
        {entry.package}
      </p>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-foreground">{entry.tldr}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 text-primary">
          {entry.source === "official" ? <CheckBold aria-hidden className="size-3" /> : null}
          {entry.source === "official" ? "Prisma" : entry.author.name}
        </span>
        <span aria-hidden>·</span>
        <span>{entry.databases.map(getDatabaseLabel).join(", ")}</span>
      </div>
    </li>
  );
}
