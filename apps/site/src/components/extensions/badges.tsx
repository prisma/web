import { Badge } from "@/components/ui/badge";
import { CheckBold, Database } from "@/components/icons/forma";
import {
  EXTENSION_SOURCE_LABELS,
  EXTENSION_STATUS_LABELS,
  getDatabaseLabel,
  type ExtensionEntry,
} from "@prisma-docs/ui/data/extensions";

export function SourceBadge({ source }: { source: ExtensionEntry["source"] }) {
  if (source === "official") {
    return (
      <Badge variant="secondary" className="bg-prism-cyan-900 text-white">
        <CheckBold aria-hidden />
        {EXTENSION_SOURCE_LABELS.official}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-black/[0.25] text-primary">
      {EXTENSION_SOURCE_LABELS.community}
    </Badge>
  );
}

/**
 * Release candidate is the baseline for Prisma 8 today, so only the entries
 * whose surface is still moving get a badge. The detail page still prints the
 * full status in its facts list.
 */
export function StatusBadge({ status }: { status: ExtensionEntry["status"] }) {
  if (status !== "experimental") return null;
  return (
    <Badge
      variant="outline"
      className="border-prism-yellow-700/40 bg-prism-yellow-50 text-prism-yellow-700"
    >
      {EXTENSION_STATUS_LABELS[status]}
    </Badge>
  );
}

export function DatabaseBadges({ databases }: { databases: ExtensionEntry["databases"] }) {
  return (
    <>
      {databases.map((database) => (
        <Badge key={database} variant="outline" className="border-black/[0.2] text-foreground">
          <Database aria-hidden />
          {getDatabaseLabel(database)}
        </Badge>
      ))}
    </>
  );
}
