/** A single byte range; unsupported/multipart syntax is ignored, as permitted by HTTP. */
export function byteRange(
  value: string | null,
  bytes: number,
): { start: number; end: number } | "unsatisfiable" | undefined {
  const match = value?.match(/^bytes=(\d*)-(\d*)$/i);
  if (!match || (!match[1] && !match[2])) return;
  const start = match[1] ? Number(match[1]) : Math.max(0, bytes - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), bytes - 1) : bytes - 1;
  if (bytes === 0 || start >= bytes || start > end || (!match[1] && Number(match[2]) === 0))
    return "unsatisfiable";
  return { start, end };
}
