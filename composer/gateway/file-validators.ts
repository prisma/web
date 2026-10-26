type Handler = (request: Request) => Response | Promise<Response>;
export type PublicFile = { bytes: number; sha256: string };

export function assetKey(path: string) {
  try {
    return path.split("/").map(decodeURIComponent).map(encodeURIComponent).join("/");
  } catch {
    return "";
  }
}

export function etagMatches(list: string | null, etag: string, weak: boolean) {
  const normalize = (value: string) => (weak ? value.replace(/^W\//, "") : value);
  return (
    list?.split(",").some((part) => {
      const value = part.trim();
      return (
        value === "*" ||
        (!!etag &&
          (!(value.startsWith("W/") || etag.startsWith("W/")) || weak) &&
          normalize(value) === normalize(etag))
      );
    }) ?? false
  );
}

/** Content validators survive reproducible archives that normalize file mtimes. */
export function withFileValidators(
  handler: Handler,
  files: ReadonlyMap<string, PublicFile>,
): Handler {
  return async (request) => {
    const file = files.get(assetKey(new URL(request.url).pathname));
    if (!file || !["GET", "HEAD"].includes(request.method)) return handler(request);
    const expected = `"asset-v1-${file.sha256}"`;
    const incoming = request.headers;
    const readRequest = new Request(request);
    // Bun 1.4 keeps the original headers when an override becomes empty.
    // Mutating the clone also preserves all other request metadata.
    const headers = readRequest.headers;
    // Next's size/mtime validators cannot detect equal-size edits after archive
    // timestamps are normalized. Evaluate conditional reads against the hash.
    for (const name of [
      "if-none-match",
      "if-modified-since",
      "if-match",
      "if-unmodified-since",
      "if-range",
    ])
      headers.delete(name);
    if (incoming.has("if-range") && incoming.get("if-range") !== expected) headers.delete("range");
    const response = await handler(readRequest);
    if (![200, 206].includes(response.status)) return response;
    const outgoing = new Headers(response.headers);
    const original = outgoing.get("etag") ?? "";
    const normalized =
      original.startsWith(`W/"${file.bytes.toString(16)}-`) &&
      /^W\/"[0-9a-f]+-[0-9a-f]+"$/.test(original);
    if (normalized) {
      outgoing.set("etag", `${outgoing.has("content-encoding") ? "W/" : ""}${expected}`);
      // The archive mtime is not the actual content modification date.
      outgoing.delete("last-modified");
    }
    if (
      !normalized &&
      !["if-none-match", "if-match", "if-modified-since", "if-unmodified-since"].some((name) =>
        incoming.has(name),
      )
    )
      return response;
    const etag = outgoing.get("etag") ?? "";
    const modified = Date.parse(outgoing.get("last-modified") ?? "");
    let status = response.status;
    if (
      incoming.has("if-match")
        ? !etagMatches(incoming.get("if-match"), etag, false)
        : modified > Date.parse(incoming.get("if-unmodified-since") ?? "")
    )
      status = 412;
    else if (
      incoming.has("if-none-match")
        ? etagMatches(incoming.get("if-none-match"), etag, true)
        : modified <= Date.parse(incoming.get("if-modified-since") ?? "")
    )
      status = 304;
    if ([304, 412].includes(status)) {
      await response.body?.cancel();
      for (const name of ["content-length", "content-range", "content-encoding"])
        outgoing.delete(name);
    }
    return new Response([304, 412].includes(status) ? null : response.body, {
      status,
      statusText: status === response.status ? response.statusText : undefined,
      headers: outgoing,
    });
  };
}
