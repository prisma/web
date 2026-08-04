"use client";
import { useMemo, useState } from "react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { buttonVariants } from "@prisma-docs/ui/components/button";
import { cn } from "@prisma-docs/ui/lib/cn";
import { withDocsBasePath } from "@/lib/urls";

const CONSOLE_CLONE_URL = "https://console.prisma.io/new/clone";
const BUTTON_IMAGE_URL = "https://www.prisma.io/docs/img/deploy-button.svg";

const OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const REPO_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
const PROJECT_NAME_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
// Mirrors the Console's env-var name rules: uppercase names, 10 per link,
// examples must be single-line and safe to publish.
const ENV_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
const MAX_ENV_VARS = 10;
const MAX_ENV_NAME_LENGTH = 64;
const MAX_ENV_EXAMPLE_LENGTH = 100;

interface EnvVarRow {
  name: string;
  example: string;
}

// The Console rejects example values with control characters, so a pasted
// tab or newline must fail here, for the author, not later for their users.
function exampleValid(example: string): boolean {
  if (example.length > MAX_ENV_EXAMPLE_LENGTH) return false;
  for (const character of example) {
    const code = character.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) return false;
  }
  return true;
}

function envRowValid(row: EnvVarRow): boolean {
  const name = row.name.trim();
  const example = row.example.trim();
  if (name === "") return example === "";
  return (
    name.length <= MAX_ENV_NAME_LENGTH &&
    ENV_NAME_PATTERN.test(name) &&
    exampleValid(example)
  );
}

function parseRepositoryUrl(
  raw: string,
): { owner: string; repo: string } | null {
  const value = raw.trim();
  if (value.length === 0 || value.length > 300) return null;
  let url: URL;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port)
    return null;
  if (url.username || url.password || url.search || url.hash) return null;
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;
  const owner = segments[0];
  let repo = segments[1];
  if (repo.endsWith(".git")) repo = repo.slice(0, -4);
  if (!OWNER_PATTERN.test(owner) || !REPO_PATTERN.test(repo)) return null;
  if (repo === "." || repo === "..") return null;
  return { owner, repo };
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [checked, onClick] = useCopyButton(() =>
    navigator.clipboard.writeText(value),
  );

  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      className={cn(
        buttonVariants({
          color: "secondary",
          size: "sm",
          className: "shrink-0 gap-2",
        }),
      )}
      onClick={onClick}
    >
      {checked ? (
        <i className="fa-regular fa-check" />
      ) : (
        <i className="fa-regular fa-copy" />
      )}
      Copy
    </button>
  );
}

function Snippet({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-fd-muted-foreground">
        {label}
      </span>
      <div className="flex items-start gap-2">
        <pre className="min-w-0 flex-1 overflow-x-auto rounded-lg border bg-fd-secondary/50 p-3 text-xs leading-relaxed">
          <code>{value}</code>
        </pre>
        <CopyButton value={value} label={`${label} snippet`} />
      </div>
    </div>
  );
}

function escapeHtmlAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

const fieldClassName =
  "w-full rounded-lg border bg-fd-background px-3 py-2 text-sm text-fd-foreground outline-none focus-visible:ring-2 focus-visible:ring-fd-ring";

export function DeployButtonGenerator() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [envVars, setEnvVars] = useState<EnvVarRow[]>([
    { name: "", example: "" },
  ]);

  const parsed = useMemo(
    () => parseRepositoryUrl(repositoryUrl),
    [repositoryUrl],
  );
  const projectNameValid =
    projectName.trim() === "" || PROJECT_NAME_PATTERN.test(projectName.trim());
  const envVarsValid = envVars.every(envRowValid);

  const url = useMemo(() => {
    if (!parsed || !projectNameValid || !envVarsValid) return null;
    const search = new URLSearchParams();
    search.set(
      "repository-url",
      `https://github.com/${parsed.owner}/${parsed.repo}`,
    );
    if (projectName.trim()) search.set("project-name", projectName.trim());
    const names: string[] = [];
    const examples: [string, string][] = [];
    for (const row of envVars) {
      const name = row.name.trim();
      if (name === "" || names.includes(name)) continue;
      names.push(name);
      const example = row.example.trim();
      if (example !== "") examples.push([name, example]);
    }
    if (names.length > 0) {
      search.set("env", names.join(","));
      for (const [name, example] of examples) {
        search.set(`env-example-${name}`, example);
      }
    }
    if (utmSource.trim()) search.set("utm_source", utmSource.trim());
    if (utmCampaign.trim()) search.set("utm_campaign", utmCampaign.trim());
    return `${CONSOLE_CLONE_URL}?${search.toString()}`;
  }, [
    parsed,
    projectNameValid,
    envVarsValid,
    projectName,
    envVars,
    utmSource,
    utmCampaign,
  ]);

  return (
    <div className="not-prose flex flex-col gap-5 rounded-xl border p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Repository URL</span>
          <input
            className={fieldClassName}
            placeholder="https://github.com/owner/repo"
            value={repositoryUrl}
            aria-invalid={repositoryUrl.trim() !== "" && !parsed}
            aria-describedby="deploy-button-repository-url-hint"
            onChange={(event) => setRepositoryUrl(event.target.value)}
          />
          {repositoryUrl.trim() !== "" && !parsed ? (
            <span
              id="deploy-button-repository-url-hint"
              className="text-xs text-fd-muted-foreground"
            >
              Enter a public GitHub repository URL like
              https://github.com/owner/repo.
            </span>
          ) : null}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            Project name{" "}
            <span className="font-normal text-fd-muted-foreground">
              (optional)
            </span>
          </span>
          <input
            className={fieldClassName}
            placeholder="my-app"
            value={projectName}
            aria-invalid={!projectNameValid}
            aria-describedby="deploy-button-project-name-hint"
            onChange={(event) => setProjectName(event.target.value)}
          />
          {!projectNameValid ? (
            <span
              id="deploy-button-project-name-hint"
              className="text-xs text-fd-muted-foreground"
            >
              Use up to 100 letters, numbers, dots, dashes, or underscores.
            </span>
          ) : null}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            Source{" "}
            <span className="font-normal text-fd-muted-foreground">
              (optional)
            </span>
          </span>
          <input
            className={fieldClassName}
            placeholder="github-readme"
            value={utmSource}
            onChange={(event) => setUtmSource(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            Campaign{" "}
            <span className="font-normal text-fd-muted-foreground">
              (optional)
            </span>
          </span>
          <input
            className={fieldClassName}
            placeholder="launch-2026"
            value={utmCampaign}
            onChange={(event) => setUtmCampaign(event.target.value)}
          />
        </label>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">
            Required environment variables{" "}
            <span className="font-normal text-fd-muted-foreground">
              (optional)
            </span>
          </span>
          <p className="m-0 text-xs text-fd-muted-foreground">
            The Console prompts the user for each value during the flow. The
            link carries only the names and any example you set here, never real
            values, so examples must be safe to publish.{" "}
            <code>DATABASE_URL</code> is configured automatically and doesn't
            need to be listed.
          </p>
          {envVars.map((row, index) => (
            <div key={index} className="flex items-start gap-2">
              <input
                className={fieldClassName}
                placeholder="OPENAI_API_KEY"
                aria-label={`Variable ${index + 1} name`}
                aria-invalid={
                  !envRowValid(row) && row.name.trim() !== "" ? true : undefined
                }
                value={row.name}
                onChange={(event) =>
                  setEnvVars((rows) =>
                    rows.map((r, i) =>
                      i === index ? { ...r, name: event.target.value } : r,
                    ),
                  )
                }
              />
              <input
                className={fieldClassName}
                placeholder="Example value (optional, non-secret)"
                aria-label={`Variable ${index + 1} example value`}
                value={row.example}
                onChange={(event) =>
                  setEnvVars((rows) =>
                    rows.map((r, i) =>
                      i === index ? { ...r, example: event.target.value } : r,
                    ),
                  )
                }
              />
              <button
                type="button"
                aria-label={`Remove variable ${index + 1}`}
                className={cn(
                  buttonVariants({ color: "secondary", size: "sm" }),
                  "shrink-0",
                )}
                onClick={() =>
                  setEnvVars((rows) =>
                    rows.length === 1
                      ? [{ name: "", example: "" }]
                      : rows.filter((_, i) => i !== index),
                  )
                }
              >
                <i className="fa-regular fa-xmark" />
              </button>
            </div>
          ))}
          {!envVarsValid ? (
            <span className="text-xs text-fd-muted-foreground">
              Names use uppercase letters, numbers, and underscores, like
              MY_API_KEY. An example needs a name next to it.
            </span>
          ) : null}
          {envVars.length < MAX_ENV_VARS ? (
            <button
              type="button"
              className={cn(
                buttonVariants({ color: "secondary", size: "sm" }),
                "self-start gap-2",
              )}
              onClick={() =>
                setEnvVars((rows) => [...rows, { name: "", example: "" }])
              }
            >
              <i className="fa-regular fa-plus" />
              Add variable
            </button>
          ) : null}
        </div>
      </div>

      {url ? (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-4">
            <span className="text-sm text-fd-muted-foreground">Preview:</span>
            <a href={url} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withDocsBasePath("/img/deploy-button.svg")}
                alt="Deploy with Prisma"
                width={172}
                height={36}
              />
            </a>
          </div>
          <Snippet label="URL" value={url} />
          <Snippet
            label="Markdown"
            value={`[![Deploy with Prisma](${BUTTON_IMAGE_URL})](${url})`}
          />
          <Snippet
            label="HTML"
            value={`<a href="${escapeHtmlAttribute(url)}"><img src="${BUTTON_IMAGE_URL}" alt="Deploy with Prisma" width="172" height="36" /></a>`}
          />
        </>
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          Enter your repository's GitHub URL to generate the button. The
          repository must be public and contain a{" "}
          <code>prisma.compute.json</code> file at its root.
        </p>
      )}
    </div>
  );
}
