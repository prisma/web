// Compute mounts the deployed application read-only. Keep Next's prerendered
// file reads and bounded page/fetch memory cache, but never write into it.
// This adapter is coupled to the pinned Next version; the seed-read test and
// deployed image HIT smoke check guard that boundary when upgrading Next.
const FileSystemCache =
  require("next/dist/server/lib/incremental-cache/file-system-cache.js").default;

const MAX_IMAGE_BYTES = 16 * 1024 * 1024;
const MAX_IMAGE_ENTRIES = 256;

module.exports = class ComputeCache extends FileSystemCache {
  constructor(context) {
    super({ ...context, flushToDisk: false });
    this.images = new Map();
    this.imageBytes = 0;
  }

  async get(key, context) {
    if (context.kind !== "IMAGE") return super.get(key, context);
    const entry = this.images.get(key);
    if (!entry) return null;
    this.images.delete(key);
    this.images.set(key, entry);
    return { value: entry.value, lastModified: entry.lastModified };
  }

  async set(key, value, context) {
    const previous = this.images.get(key);
    if (previous) {
      this.imageBytes -= previous.bytes;
      this.images.delete(key);
    }
    if (value?.kind !== "IMAGE") return super.set(key, value, context);
    // Account for the binary payload plus a bounded entry's metadata. Oversize
    // images still work, but do not evict the entire cache to store one file.
    const bytes = value.buffer.byteLength + 1024 + Buffer.byteLength(key);
    if (bytes > MAX_IMAGE_BYTES) return;
    while (this.imageBytes + bytes > MAX_IMAGE_BYTES || this.images.size >= MAX_IMAGE_ENTRIES) {
      const oldest = this.images.keys().next().value;
      this.imageBytes -= this.images.get(oldest).bytes;
      this.images.delete(oldest);
    }
    this.images.set(key, { value, bytes, lastModified: Date.now() });
    this.imageBytes += bytes;
  }
};
