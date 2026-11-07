/** Editorial dates survive shallow/synthetic deployment checkouts. */
export function postModifiedDate(data: {
  updatedAt?: unknown;
  date?: unknown;
}): string | undefined {
  for (const value of [data.updatedAt, data.date]) {
    if (!(value instanceof Date) && typeof value !== "string") continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
}
