import Link from "next/link";
import { getInstallCommand, type ExtensionEntry } from "@prisma-docs/ui/data/extensions";
import { CopyCommand, MONO } from "./copy-command";
import { DatabaseBadges, SourceBadge, StatusBadge } from "./badges";

/** One line of the directory: name and package, what it adds, where it runs, how to install it. */
export function ExtensionRow({ entry }: { entry: ExtensionEntry }) {
  return (
    <li className="group relative grid gap-3 border-b border-black/[0.12] py-5 transition-colors hover:bg-paper md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8 md:px-3">
      <div className="flex min-w-0 flex-col gap-1.5 px-3 md:px-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[17px] font-semibold leading-snug text-primary">
            <Link
              href={`/extensions/${entry.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {entry.name}
            </Link>
          </h3>
          <span className={`truncate text-[13px] text-muted-foreground ${MONO}`}>
            {entry.importPath ?? entry.package}
          </span>
        </div>
        <p className="max-w-[70ch] text-[15px] leading-relaxed text-foreground">{entry.tldr}</p>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <SourceBadge source={entry.source} />
          <StatusBadge status={entry.status} />
          <DatabaseBadges databases={entry.databases} />
          {entry.source === "community" ? (
            <span className="text-xs text-muted-foreground">by {entry.author.name}</span>
          ) : null}
        </div>
      </div>
      <div className="relative z-10 px-3 md:w-[27rem] md:px-0">
        {entry.builtIn ? (
          <p
            className={`rounded-xl border border-dashed border-black/[0.25] px-3 py-2 text-[13px] text-foreground ${MONO}`}
          >
            built into {entry.package}
          </p>
        ) : (
          <CopyCommand command={getInstallCommand(entry)} />
        )}
      </div>
    </li>
  );
}
