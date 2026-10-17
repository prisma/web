import type { Condition, Rule } from "./types.ts";

function conditionValue(condition: Condition, url: URL, headers: Headers) {
  if (condition.type === "host") return url.hostname;
  if (condition.type === "header") return headers.get(condition.key!);
  if (condition.type === "query") return url.searchParams.getAll(condition.key!).at(-1);
  return (headers.get("cookie") ?? "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${condition.key}=`))
    ?.slice(condition.key!.length + 1);
}
export function compileMatcher(rule: Rule) {
  // Reject PCRE constructs which JavaScript might accept with a different meaning.
  if (/\\[AKRCXgzZQE]|\(\?[P>(|]|\(\*[A-Z]/.test(rule.pattern))
    throw new Error(`Unsupported regular expression: ${rule.pattern}`);
  const pattern = new RegExp(rule.pattern, rule.caseSensitive === false ? "i" : "");
  const conditions = (items: Condition[] = []) =>
    items.map((condition) => ({
      condition,
      regex: condition.value === undefined ? undefined : new RegExp(`^(?:${condition.value})$`),
    }));
  const has = conditions(rule.has),
    missing = conditions(rule.missing);
  return (url: URL, request: Request): Record<string, string> | undefined => {
    if (rule.methods && !rule.methods.includes(request.method)) return;
    const matched = pattern.exec(url.pathname);
    if (!matched) return;
    const parameters: Record<string, string> = { ...matched.groups };
    matched.slice(1).forEach((value, index) => {
      parameters[String(index + 1)] = value ?? "";
    });
    const satisfies = ({ condition, regex }: (typeof has)[number], capture: boolean) => {
      const value = conditionValue(condition, url, request.headers);
      if (value == null) return false;
      const result = regex?.exec(value);
      if (regex && !result) return false;
      if (capture) {
        // Path captures already retain the request's encoding; condition values
        // are raw and must not become query delimiters or extra path segments.
        if (!regex && condition.key) parameters[condition.key] = encodeURIComponent(value);
        if (condition.type === "host") parameters.host = value;
        for (const [key, captured] of Object.entries(result?.groups ?? {}))
          parameters[key] = encodeURIComponent(captured);
      }
      return true;
    };
    if (
      !has.every((item) => satisfies(item, true)) ||
      missing.some((item) => satisfies(item, false))
    )
      return;
    return parameters;
  };
}
export function interpolate(template: string, parameters: Record<string, string>) {
  return template.replace(
    /\$([0-9]+|[A-Za-z_][A-Za-z0-9_]*)/g,
    (_, key: string) => parameters[key] ?? "",
  );
}
export function destination(template: string, parameters: Record<string, string>, source: URL) {
  const target = new URL(interpolate(template, parameters), source.origin);
  const explicit = new Set(target.searchParams.keys());
  for (const [key, value] of source.searchParams)
    if (!explicit.has(key)) target.searchParams.append(key, value);
  return target;
}
