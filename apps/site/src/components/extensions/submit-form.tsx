"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle, Github } from "@/components/icons/forma";
import { KNOWN_DATABASES, getDatabaseLabel } from "@prisma-docs/ui/data/extensions";
import { slugFromPackage, submissionSchema } from "@/lib/extensions/submission";

type FormState = {
  package: string;
  repo: string;
  tldr: string;
  description: string;
  databases: string[];
  /** Databases outside KNOWN_DATABASES, comma separated, for an extension that adds one. */
  otherDatabases: string;
  authorName: string;
  experimental: boolean;
  website: string;
};

const initialState: FormState = {
  package: "",
  repo: "",
  tldr: "",
  description: "",
  databases: ["postgresql"],
  otherDatabases: "",
  authorName: "",
  experimental: false,
  website: "",
};

type Result =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; prUrl: string | null }
  | { kind: "fallback"; message: string; url: string }
  | { kind: "error"; message: string; issues: Record<string, string> };

const INPUT = "border-black/[0.3] text-primary focus-visible:border-primary";

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor} className="text-primary">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function SubmitExtensionForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<Result>({ kind: "idle" });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const issues = result.kind === "error" ? result.issues : {};
  const slug = slugFromPackage(form.package);

  const payload = () => ({
    package: form.package,
    repo: form.repo,
    tldr: form.tldr,
    description: form.description,
    databases: [
      ...new Set([
        ...form.databases,
        ...form.otherDatabases
          .split(",")
          .map((database) => database.trim().toLowerCase())
          .filter(Boolean),
      ]),
    ],
    authorName: form.authorName,
    experimental: form.experimental,
    website: form.website,
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = payload();

    const local = submissionSchema.safeParse(data);
    if (!local.success) {
      const collected: Record<string, string> = {};
      for (const issue of local.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!collected[key]) collected[key] = issue.message;
      }
      setResult({ kind: "error", message: "Check the highlighted fields.", issues: collected });
      return;
    }

    setResult({ kind: "submitting" });
    try {
      const response = await fetch("/api/extensions/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await response.json()) as {
        ok?: boolean;
        prUrl?: string | null;
        error?: string;
        fallbackUrl?: string;
        issues?: { path: string; message: string }[];
      };
      if (response.ok && json.ok) {
        setResult({ kind: "success", prUrl: json.prUrl ?? null });
        return;
      }
      if (json.fallbackUrl) {
        setResult({
          kind: "fallback",
          message: json.error ?? "Automatic submission is unavailable.",
          url: json.fallbackUrl,
        });
        return;
      }
      const collected: Record<string, string> = {};
      for (const issue of json.issues ?? []) {
        // Array items report as "databases.0"; the form shows errors per field.
        const key = issue.path.split(".")[0] || "form";
        if (!collected[key]) collected[key] = issue.message;
      }
      setResult({ kind: "error", message: json.error ?? "Submission failed.", issues: collected });
    } catch {
      setResult({ kind: "error", message: "Network error. Try again.", issues: {} });
    }
  };

  if (result.kind === "success") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-black/[0.2] bg-paper p-8">
        <CheckCircle className="size-8 text-prism-cyan-700" aria-hidden />
        <h2 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15] text-primary">
          Pull request opened
        </h2>
        <p className="max-w-[56ch] leading-relaxed text-foreground">
          A maintainer reviews it, and the listing goes live on the next deploy after the merge.
        </p>
        {result.prUrl ? (
          <Button asChild size="lg">
            <a href={result.prUrl} rel="noopener noreferrer">
              <Github aria-hidden />
              View the pull request
            </a>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative flex flex-col gap-6 rounded-2xl border border-black/[0.2] bg-white p-6 sm:p-8"
    >
      {result.kind === "fallback" ? (
        <div className="flex flex-col gap-3 rounded-xl border border-prism-yellow-700/40 bg-prism-yellow-50 p-5 text-sm text-prism-yellow-700">
          <p>{result.message}</p>
          <Button asChild variant="outline" className="w-fit">
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              Open the prefilled GitHub issue
              <ArrowRight aria-hidden />
            </a>
          </Button>
        </div>
      ) : null}
      {result.kind === "error" ? (
        <div className="rounded-xl border border-prism-red-700/40 bg-prism-red-50 p-4 text-sm text-prism-red-700">
          {result.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="npm package"
          htmlFor="package"
          hint={
            slug
              ? `Published on npm. Listed at prisma.io/extensions/${slug}.`
              : "Must be published."
          }
          error={issues.package}
        >
          <Input
            id="package"
            className={INPUT}
            value={form.package}
            placeholder="prisma-orm-extension-my-thing"
            onChange={(event) => update("package", event.target.value)}
            aria-invalid={Boolean(issues.package)}
            required
          />
        </Field>
        <Field
          label="Source repository"
          htmlFor="repo"
          hint="The README documents registration. The owner becomes the author link."
          error={issues.repo}
        >
          <Input
            id="repo"
            className={INPUT}
            type="url"
            value={form.repo}
            placeholder="https://github.com/you/prisma-orm-extension-my-thing"
            onChange={(event) => update("repo", event.target.value)}
            aria-invalid={Boolean(issues.repo)}
            required
          />
        </Field>
      </div>

      <Field
        label="One-line summary"
        htmlFor="tldr"
        hint={`${form.tldr.length}/140. Shown in the list and in the docs table.`}
        error={issues.tldr}
      >
        <Input
          id="tldr"
          className={INPUT}
          value={form.tldr}
          maxLength={140}
          placeholder="Typed JSON columns described and enforced by a zod schema."
          onChange={(event) => update("tldr", event.target.value)}
          aria-invalid={Boolean(issues.tldr)}
          required
        />
      </Field>
      <Field
        label="Description"
        htmlFor="description"
        hint={`${form.description.length}/600. One paragraph. Inline \`code\` is fine.`}
        error={issues.description}
      >
        <Textarea
          id="description"
          className={INPUT}
          value={form.description}
          maxLength={600}
          rows={4}
          placeholder="What it adds, how it is declared in the contract, and anything the database needs installed."
          onChange={(event) => update("description", event.target.value)}
          aria-invalid={Boolean(issues.description)}
          required
        />
      </Field>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-primary">Databases</span>
        <div className="flex min-h-9 flex-wrap items-center gap-x-5 gap-y-2">
          {KNOWN_DATABASES.map((database) => (
            <label
              key={database}
              className="flex cursor-pointer items-center gap-2 text-sm text-primary"
            >
              <Checkbox
                checked={form.databases.includes(database)}
                onCheckedChange={(checked) =>
                  update(
                    "databases",
                    checked === true
                      ? [...form.databases, database]
                      : form.databases.filter((item) => item !== database),
                  )
                }
              />
              {getDatabaseLabel(database)}
            </label>
          ))}
        </div>
        <Input
          id="otherDatabases"
          className={INPUT}
          value={form.otherDatabases}
          placeholder="Other, comma separated: cockroachdb, duckdb"
          aria-label="Other databases"
          onChange={(event) => update("otherDatabases", event.target.value)}
        />
        <p className={issues.databases ? "text-xs text-destructive" : "text-xs text-foreground"}>
          {issues.databases ?? "The databases it works with, or the database it adds to Prisma 8."}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:items-end">
        <Field label="Author or organization" htmlFor="authorName" error={issues.authorName}>
          <Input
            id="authorName"
            className={INPUT}
            value={form.authorName}
            onChange={(event) => update("authorName", event.target.value)}
            aria-invalid={Boolean(issues.authorName)}
            required
          />
        </Field>
        <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm text-primary">
          <Checkbox
            checked={form.experimental}
            onCheckedChange={(checked) => update("experimental", checked === true)}
          />
          Still experimental (surface may change)
        </label>
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => update("website", event.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={result.kind === "submitting"}>
          <Github aria-hidden />
          {result.kind === "submitting" ? "Opening pull request…" : "Open a pull request"}
        </Button>
        <p className="text-xs leading-relaxed text-foreground">
          Opens a pull request against{" "}
          <a
            href="https://github.com/prisma/web"
            className="font-semibold text-primary underline underline-offset-4"
            rel="noopener noreferrer"
          >
            prisma/web
          </a>
          . A maintainer reviews it before it goes live.
        </p>
      </div>
    </form>
  );
}
