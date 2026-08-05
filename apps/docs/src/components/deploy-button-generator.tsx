"use client";
import { useMemo, useState } from "react";
import { CodeBlock, Pre } from "@prisma/eclipse";
import { buttonVariants } from "@prisma-docs/ui/components/button";
import { cn } from "@prisma-docs/ui/lib/cn";
import { withDocsBasePath } from "@/lib/urls";

const CONSOLE_CLONE_URL = "https://console.prisma.io/new/clone";
const BUTTON_IMAGE_PATH = "/img/deploy-button.svg";
const BUTTON_IMAGE_URL = `https://www.prisma.io/docs${BUTTON_IMAGE_PATH}`;
const BUTTON_ALT = "Deploy with Prisma";
const BUTTON_WIDTH = 172;
const BUTTON_HEIGHT = 36;

const OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const REPO_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
const PROJECT_NAME_PATTERN = REPO_PATTERN;
// Mirrors the Console's env-var rules for /new/clone links; the canonical
// implementation is services/console/lib/templates/deployEnvVars.ts in
// prisma/pdp-control-plane. Keep the two in sync.
const ENV_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
const MAX_ENV_VARS = 10;
const MAX_ENV_NAME_LENGTH = 64;
const MAX_ENV_EXAMPLE_LENGTH = 100;
const MAX_UTM_LENGTH = 100;

// C0/C1 controls and DEL, which the Console rejects, so a pasted tab or
// newline must fail here, for the author, not later for their users. Bidi
// overrides and zero-width characters are rejected on top of that: these
// values land in the author's README, where such characters could visually
// spoof its content.
const UNSAFE_CHARACTERS =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/;

interface EnvVarRow {
  name: string;
  example: string;
}

function exampleValid(example: string): boolean {
  return example.length <= MAX_ENV_EXAMPLE_LENGTH && !UNSAFE_CHARACTERS.test(example);
}

function utmValid(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length <= MAX_UTM_LENGTH && !UNSAFE_CHARACTERS.test(trimmed);
}

function envRowValid(row: EnvVarRow): boolean {
  const name = row.name.trim();
  const example = row.example.trim();
  if (name === "") return example === "";
  return name.length <= MAX_ENV_NAME_LENGTH && ENV_NAME_PATTERN.test(name) && exampleValid(example);
}

function parseRepositoryUrl(raw: string): { owner: string; repo: string } | null {
  const value = raw.trim();
  if (value.length === 0 || value.length > 300) return null;
  let url: URL;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port) return null;
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

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function Snippet({ label, value }: { label: string; value: string }) {
  return (
    <CodeBlock title={label} className="my-0">
      <Pre>
        <code>{value}</code>
      </Pre>
    </CodeBlock>
  );
}

const fieldClassName =
  "w-full rounded-lg border bg-fd-background px-3 py-2 text-sm text-fd-foreground outline-none focus-visible:ring-2 focus-visible:ring-fd-ring aria-invalid:border-red-500/70";

function Field({
  label,
  hintId,
  hint,
  valid,
  span2 = false,
  optional = true,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  hintId: string;
  hint: string;
  valid: boolean;
  span2?: boolean;
  optional?: boolean;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", span2 && "sm:col-span-2")}>
      <span className="text-sm font-medium">
        {label}
        {optional ? (
          <span className="font-normal text-fd-muted-foreground"> (optional)</span>
        ) : null}
      </span>
      <input
        className={fieldClassName}
        placeholder={placeholder}
        value={value}
        aria-invalid={!valid}
        aria-describedby={valid ? undefined : hintId}
        onChange={(event) => onChange(event.target.value)}
      />
      {!valid ? (
        <span id={hintId} className="text-xs text-fd-muted-foreground">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function DeployButtonGenerator() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [envVars, setEnvVars] = useState<EnvVarRow[]>([{ name: "", example: "" }]);

  const updateEnvRow = (index: number, patch: Partial<EnvVarRow>) =>
    setEnvVars((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const parsed = useMemo(() => parseRepositoryUrl(repositoryUrl), [repositoryUrl]);
  const repositoryUrlValid = repositoryUrl.trim() === "" || parsed !== null;
  const projectNameValid =
    projectName.trim() === "" || PROJECT_NAME_PATTERN.test(projectName.trim());
  const envRowValidity = envVars.map(envRowValid);
  const envVarsValid = envRowValidity.every(Boolean);
  const utmSourceValid = utmValid(utmSource);
  const utmCampaignValid = utmValid(utmCampaign);

  let url: string | null = null;
  if (parsed && projectNameValid && envVarsValid && utmSourceValid && utmCampaignValid) {
    const search = new URLSearchParams();
    search.set("repository-url", `https://github.com/${parsed.owner}/${parsed.repo}`);
    if (projectName.trim()) search.set("project-name", projectName.trim());
    const seen = new Set<string>();
    const examples: [string, string][] = [];
    for (const row of envVars) {
      const name = row.name.trim();
      if (name === "" || seen.has(name)) continue;
      seen.add(name);
      const example = row.example.trim();
      if (example !== "") examples.push([name, example]);
    }
    if (seen.size > 0) {
      search.set("env", [...seen].join(","));
      for (const [name, example] of examples) {
        search.set(`env-example-${name}`, example);
      }
    }
    if (utmSource.trim()) search.set("utm_source", utmSource.trim());
    if (utmCampaign.trim()) search.set("utm_campaign", utmCampaign.trim());
    url = `${CONSOLE_CLONE_URL}?${search.toString()}`;
  }

  return (
    <div className="not-prose flex flex-col gap-5 rounded-xl border p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Repository URL"
          optional={false}
          span2
          placeholder="https://github.com/owner/repo"
          value={repositoryUrl}
          valid={repositoryUrlValid}
          hintId="deploy-button-repository-url-hint"
          hint="Enter a public GitHub repository URL like https://github.com/owner/repo."
          onChange={setRepositoryUrl}
        />
        <Field
          label="Project name"
          placeholder="my-app"
          value={projectName}
          valid={projectNameValid}
          hintId="deploy-button-project-name-hint"
          hint="Use up to 100 letters, numbers, dots, dashes, or underscores."
          onChange={setProjectName}
        />
        <Field
          label="Source"
          placeholder="github-readme"
          value={utmSource}
          valid={utmSourceValid}
          hintId="deploy-button-utm-source-hint"
          hint={`Use a short label of up to ${MAX_UTM_LENGTH} visible characters.`}
          onChange={setUtmSource}
        />
        <Field
          label="Campaign"
          placeholder="launch-2026"
          value={utmCampaign}
          valid={utmCampaignValid}
          hintId="deploy-button-utm-campaign-hint"
          hint={`Use a short label of up to ${MAX_UTM_LENGTH} visible characters.`}
          onChange={setUtmCampaign}
        />
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">
            Required environment variables{" "}
            <span className="font-normal text-fd-muted-foreground">(optional)</span>
          </span>
          <p className="m-0 text-xs text-fd-muted-foreground">
            The Console prompts the user for each value during the flow. The link carries only the
            names and any example you set here, never real values, so examples must be safe to
            publish. <code>DATABASE_URL</code> is configured automatically and doesn't need to be
            listed.
          </p>
          {envVars.map((row, index) => (
            <div key={index} className="flex items-start gap-2">
              <input
                className={fieldClassName}
                placeholder="OPENAI_API_KEY"
                aria-label={`Variable ${index + 1} name`}
                aria-invalid={!envRowValidity[index] && row.name.trim() !== "" ? true : undefined}
                value={row.name}
                onChange={(event) => updateEnvRow(index, { name: event.target.value })}
              />
              <input
                className={fieldClassName}
                placeholder="Example value (optional, non-secret)"
                aria-label={`Variable ${index + 1} example value`}
                value={row.example}
                onChange={(event) => updateEnvRow(index, { example: event.target.value })}
              />
              <button
                type="button"
                aria-label={`Remove variable ${index + 1}`}
                className={cn(buttonVariants({ color: "secondary", size: "sm" }), "shrink-0")}
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
              Names use uppercase letters, numbers, and underscores, like MY_API_KEY. An example
              needs a name next to it.
            </span>
          ) : null}
          {envVars.length < MAX_ENV_VARS ? (
            <button
              type="button"
              className={cn(buttonVariants({ color: "secondary", size: "sm" }), "self-start gap-2")}
              onClick={() => setEnvVars((rows) => [...rows, { name: "", example: "" }])}
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
                src={withDocsBasePath(BUTTON_IMAGE_PATH)}
                alt={BUTTON_ALT}
                width={BUTTON_WIDTH}
                height={BUTTON_HEIGHT}
              />
            </a>
          </div>
          <Snippet label="URL" value={url} />
          <Snippet label="Markdown" value={`[![${BUTTON_ALT}](${BUTTON_IMAGE_URL})](${url})`} />
          <Snippet
            label="HTML"
            value={`<a href="${escapeHtmlAttribute(url)}"><img src="${BUTTON_IMAGE_URL}" alt="${BUTTON_ALT}" width="${BUTTON_WIDTH}" height="${BUTTON_HEIGHT}" /></a>`}
          />
        </>
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          Enter your repository's GitHub URL to generate the button. The repository must be public
          and contain a <code>prisma.compute.json</code> file at its root.
        </p>
      )}
    </div>
  );
}
