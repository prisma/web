import type { Version } from "@/lib/version";

interface VersionBannerProps {
  requestedVersion: Version;
  showingVersion: Version;
}

export function VersionBanner({ requestedVersion, showingVersion }: VersionBannerProps) {
  return (
    // The eclipse `warning` triad already carries its own dark-mode values, so
    // the four `dark:` overrides the raw amber palette needed are gone.
    <div className="mb-4 rounded-square border border-stroke-warning bg-background-warning p-4 text-foreground-warning">
      <p className="text-sm">
        This page doesn&apos;t exist in <strong>{requestedVersion}</strong>. Showing content from{" "}
        <strong>{showingVersion}</strong>.
      </p>
    </div>
  );
}
