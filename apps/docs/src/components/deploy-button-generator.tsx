"use client";
import { useMemo, useState } from "react";
import { CodeBlock, Pre } from "@prisma/eclipse";
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
const MAX_UTM_LENGTH = 100;

// Generated values are commonly pasted into a README, so reject characters
// that could hide or visually reorder its content.
const UNSAFE_CHARACTERS =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/;

function utmValid(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length <= MAX_UTM_LENGTH && !UNSAFE_CHARACTERS.test(trimmed);
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

  const parsed = useMemo(() => parseRepositoryUrl(repositoryUrl), [repositoryUrl]);
  const repositoryUrlValid = repositoryUrl.trim() === "" || parsed !== null;
  const trimmedProjectName = projectName.trim();
  const projectNameValid =
    trimmedProjectName === "" ||
    (PROJECT_NAME_PATTERN.test(trimmedProjectName) &&
      trimmedProjectName !== "." &&
      trimmedProjectName !== "..");
  const utmSourceValid = utmValid(utmSource);

  let url: string | null = null;
  if (parsed && projectNameValid && utmSourceValid) {
    const search = new URLSearchParams();
    search.set("repository-url", `https://github.com/${parsed.owner}/${parsed.repo}`);
    if (trimmedProjectName) search.set("project-name", trimmedProjectName);
    if (utmSource.trim()) search.set("utm_source", utmSource.trim());
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
          label="Destination repository name"
          placeholder="my-app"
          value={projectName}
          valid={projectNameValid}
          hintId="deploy-button-project-name-hint"
          hint="Use 1–100 letters, numbers, dots, dashes, or underscores."
          onChange={setProjectName}
        />
        <Field
          label="Attribution source"
          placeholder="github-readme"
          value={utmSource}
          valid={utmSourceValid}
          hintId="deploy-button-utm-source-hint"
          hint={`Use a short label of up to ${MAX_UTM_LENGTH} visible characters.`}
          onChange={setUtmSource}
        />
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
          and contain a supported <code>prisma-composer.config.*</code> and <code>module.*</code> at
          its root.
        </p>
      )}
    </div>
  );
}
