export interface MediaFile {
  path: string;
  bytes: number;
  sha256: string;
  modified: number;
}
export interface MediaShard {
  name: string;
  files: MediaFile[];
}

// Keep even incompressible files well below the provider's 256 MiB upload cap.
export const mediaLimit = 200_000_000;

export function partitionMedia(files: MediaFile[], names: readonly string[]): MediaShard[] {
  const shards = names.map((name) => ({ name, files: [] as MediaFile[], bytes: 0 }));
  for (const file of [...files].sort((a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path))) {
    const shard = [...shards].sort((a, b) => a.bytes - b.bytes || a.name.localeCompare(b.name))[0];
    if (!shard || shard.bytes + file.bytes > mediaLimit) {
      throw new Error(
        `Blog media exceeds the ${mediaLimit} byte shard budget. Add a media service or move large files to object storage.`,
      );
    }
    shard.files.push(file);
    shard.bytes += file.bytes;
  }
  return shards.map(({ name, files }) => ({
    name,
    files: files.sort((a, b) => a.path.localeCompare(b.path)),
  }));
}

export function mediaPath(file: string) {
  return `/blog/${file.split("/").map(encodeURIComponent).join("/")}`;
}
