"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, ChevronsUpDown, X } from "@/components/icons/forma";
import { PrismButtonOutline } from "@/components/brand/prism-button";
import { cn } from "@/lib/utils";
import {
  CONTRIBUTE,
  filterTemplates,
  frameworkOptions,
  isSortKey,
  SORT_OPTIONS,
  sortTemplates,
  type FrameworkMeta,
  type GalleryTemplate,
  type SortKey,
} from "../_lib/catalog";
import { TemplateCard } from "./template-card";
import { FrameworkLogo } from "./template-preview";

// The browsable gallery: one grid of every template, a row of framework pills
// and a sort control above it. The default view is the curated Featured
// order, so the full-stack apps come first and the personal site closes.
//
// Filter state lives in the URL (?framework=nextjs&sort=newest) so a
// filtered view can be linked from docs or a tweet, but it is read with
// useSyncExternalStore rather than useSearchParams: the server renders the
// default view (everything, Featured) into the static HTML, and the client
// applies the query string on hydration without a Suspense boundary blanking
// the grid for crawlers.

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("popstate", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("popstate", callback);
  };
}

function useQueryString() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
}

function replaceQueryString(params: URLSearchParams) {
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", url);
  for (const listener of listeners) listener();
}

type GalleryState = {
  framework: string | "all";
  sort: SortKey;
};

const DEFAULTS: GalleryState = { framework: "all", sort: "featured" };

export function TemplateGallery({ templates }: { templates: GalleryTemplate[] }) {
  const search = useQueryString();
  const frameworks = useMemo(() => frameworkOptions(templates), [templates]);

  const state = useMemo<GalleryState>(() => {
    const params = new URLSearchParams(search);
    const framework = params.get("framework");
    const sort = params.get("sort");
    return {
      framework:
        framework && frameworks.some((option) => option.framework.id === framework)
          ? framework
          : "all",
      sort: isSortKey(sort) ? sort : "featured",
    };
  }, [search, frameworks]);

  const update = (patch: Partial<GalleryState>) => {
    const next = { ...state, ...patch };
    const params = new URLSearchParams();
    if (next.framework !== DEFAULTS.framework) params.set("framework", next.framework);
    if (next.sort !== DEFAULTS.sort) params.set("sort", next.sort);
    replaceQueryString(params);
  };

  const visible = useMemo(
    () => sortTemplates(filterTemplates(templates, { framework: state.framework }), state.sort),
    [templates, state],
  );
  const isFiltered = state.framework !== "all";

  return (
    <section
      aria-labelledby="apps-templates"
      className="bg-white px-4 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-10"
    >
      <div className="mx-auto max-w-site">
        <h2 id="apps-templates" className="sr-only">
          Templates
        </h2>

        {/* Toolbar: framework pills, then the count and the sort. One row on
            desktop, stacked on phones where the pills scroll sideways. */}
        <div className="flex flex-col gap-4 border-b border-black/[0.08] pb-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {frameworks.length > 1 && (
            <PillRow>
              <Pill
                active={state.framework === "all"}
                onClick={() => update({ framework: "all" })}
                count={templates.length}
              >
                All frameworks
              </Pill>
              {frameworks.map(({ framework, count }) => (
                <Pill
                  key={framework.id}
                  active={state.framework === framework.id}
                  onClick={() => update({ framework: framework.id })}
                  count={count}
                  logo={framework}
                >
                  {framework.label}
                </Pill>
              ))}
            </PillRow>
          )}
          <div className="flex shrink-0 items-center justify-between gap-6 lg:justify-end">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-semibold tabular-nums text-foreground">{visible.length}</span>{" "}
              {visible.length === 1 ? "template" : "templates"}
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => update({ framework: "all" })}
                  className="ml-2 inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Clear filter
                  <X className="size-3" aria-hidden />
                </button>
              )}
            </p>
            <SortSelect value={state.sort} onChange={(sort) => update({ sort })} />
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState onReset={() => update({ framework: "all" })} />
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((template) => (
              <li key={template.id} className="min-w-0">
                <TemplateCard template={template} />
              </li>
            ))}
          </ul>
        )}

        <ContributePanel />
      </div>
    </section>
  );
}

// The community door, and the one place on the page that asks for templates:
// how to add yours (a folder under compute/ plus a manifest entry that names
// the author, sent as a pull request), and where to ask for one you miss.
function ContributePanel() {
  return (
    <aside
      aria-labelledby="apps-contribute"
      className="relative mt-16 overflow-hidden rounded-2xl border border-black/[0.08] bg-card p-7 sm:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background: [
            "radial-gradient(70% 60% at 12% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 30%, transparent), transparent 70%)",
            "radial-gradient(60% 50% at 50% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 24%, transparent), transparent 68%)",
            "radial-gradient(70% 55% at 88% 100%, color-mix(in srgb, var(--color-prism-red-300) 26%, transparent), transparent 70%)",
          ].join(","),
        }}
      />
      <div className="relative flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Community templates
          </p>
          <h2 id="apps-contribute" className="mt-2 text-[1.375rem] leading-snug">
            Add it here if you built a template using the Prisma Stack
          </h2>
          <p className="mt-3 max-w-[80ch] text-pretty text-sm leading-relaxed text-muted-foreground">
            Put it in a folder under{" "}
            <a
              href={CONTRIBUTE.folderUrl}
              className="spectrum-underline font-semibold text-foreground"
            >
              compute/
            </a>{" "}
            with a README and a Composer module, add it to{" "}
            <a
              href={CONTRIBUTE.manifestUrl}
              className="spectrum-underline font-semibold text-foreground"
            >
              templates.json
            </a>{" "}
            with yourself as the author, and open a pull request. When it merges, it appears here
            under your name. Missing a framework and not building it yourself?{" "}
            <a
              href={CONTRIBUTE.requestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="spectrum-underline font-semibold text-foreground"
            >
              Request a template
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <PrismButtonOutline href={CONTRIBUTE.repoUrl}>Contribute a template</PrismButtonOutline>
          <a
            href={CONTRIBUTE.guideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/guide inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
          >
            Read the guidelines
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover/guide:translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </aside>
  );
}

function PillRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  count,
  logo,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  logo?: FrameworkMeta;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "border-transparent bg-foreground text-primary-foreground"
          : "border-black/[0.09] bg-white text-foreground hover:border-foreground/30",
      )}
    >
      {logo && <FrameworkLogo framework={logo} className={cn(active && "brightness-0 invert")} />}
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "text-xs font-medium tabular-nums",
            active ? "text-primary-foreground/60" : "text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (sort: SortKey) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      Sort by
      <span className="relative">
        <select
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            if (isSortKey(next)) onChange(next);
          }}
          className="cursor-pointer appearance-none rounded-full border border-black/[0.09] bg-white py-1.5 pl-3.5 pr-9 text-sm font-semibold text-foreground transition-colors hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-prism-cyan-400"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronsUpDown
          className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </span>
    </label>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/[0.12] bg-white px-6 py-14 text-center">
      <h2 className="text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.15]">No templates match</h2>
      <p className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
        No template uses that framework yet. Pick another, or request one below.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 cursor-pointer rounded-full border border-black/[0.09] bg-white px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/30"
      >
        Show all templates
      </button>
    </div>
  );
}
