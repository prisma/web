"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, ChevronsUpDown, X } from "@/components/icons/forma";
import { PrismButtonOutline } from "@/components/brand/prism-button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  CONTRIBUTE,
  filterTemplates,
  frameworkOptions,
  groupByCategory,
  isCategory,
  isSortKey,
  SORT_OPTIONS,
  sortTemplates,
  type Category,
  type CategoryMeta,
  type FrameworkMeta,
  type GalleryTemplate,
  type SortKey,
} from "../_lib/catalog";
import { TemplateCard } from "./template-card";
import { FrameworkLogo } from "./template-preview";

// The browsable gallery: filters down the left (type, framework), a sort
// control over the grid, and the templates grouped by category when no type is
// selected, each category in its own section (CATEGORY_ORDER decides which
// leads).
//
// Filter state lives in the URL (?type=app&framework=nextjs&sort=newest) so a
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
  category: Category | "all";
  framework: string | "all";
  sort: SortKey;
};

const DEFAULTS: GalleryState = { category: "all", framework: "all", sort: "featured" };

export function TemplateGallery({ templates }: { templates: GalleryTemplate[] }) {
  const search = useQueryString();
  const frameworks = useMemo(() => frameworkOptions(templates), [templates]);

  const state = useMemo<GalleryState>(() => {
    const params = new URLSearchParams(search);
    const type = params.get("type");
    const framework = params.get("framework");
    const sort = params.get("sort");
    return {
      category: isCategory(type) ? type : "all",
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
    if (next.category !== DEFAULTS.category) params.set("type", next.category);
    if (next.framework !== DEFAULTS.framework) params.set("framework", next.framework);
    if (next.sort !== DEFAULTS.sort) params.set("sort", next.sort);
    replaceQueryString(params);
  };

  const categoryCounts = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        count: templates.filter((template) => template.category === category).length,
      })).filter((entry) => entry.count > 0),
    [templates],
  );

  const visible = useMemo(
    () =>
      sortTemplates(
        filterTemplates(templates, { category: state.category, framework: state.framework }),
        state.sort,
      ),
    [templates, state],
  );

  const groups = useMemo(() => groupByCategory(visible), [visible]);
  const isFiltered = state.category !== "all" || state.framework !== "all";

  return (
    <section className="bg-white px-4 pb-24 pt-10 sm:px-8 sm:pb-32 sm:pt-14">
      <div className="mx-auto max-w-site lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-14">
        {/* Desktop filters */}
        <aside className="hidden lg:block lg:self-start lg:sticky lg:top-28">
          <FilterGroup label="Type">
            <FilterRow
              active={state.category === "all"}
              onClick={() => update({ category: "all" })}
              count={templates.length}
            >
              All templates
            </FilterRow>
            {categoryCounts.map(({ category, count }) => (
              <FilterRow
                key={category}
                active={state.category === category}
                onClick={() => update({ category })}
                count={count}
                dot={CATEGORY_META[category].dot}
              >
                {CATEGORY_META[category].shortLabel}
              </FilterRow>
            ))}
          </FilterGroup>

          {frameworks.length > 1 && (
            <FilterGroup label="Framework" className="mt-8">
              <FilterRow
                active={state.framework === "all"}
                onClick={() => update({ framework: "all" })}
                count={templates.length}
              >
                All frameworks
              </FilterRow>
              {frameworks.map(({ framework, count }) => (
                <FilterRow
                  key={framework.id}
                  active={state.framework === framework.id}
                  onClick={() => update({ framework: framework.id })}
                  count={count}
                  logo={framework}
                >
                  {framework.label}
                </FilterRow>
              ))}
            </FilterGroup>
          )}

          <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
            Missing your framework?{" "}
            <a
              href={CONTRIBUTE.requestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="spectrum-underline font-semibold text-foreground"
            >
              Request a template
            </a>
          </p>
        </aside>

        <div className="min-w-0">
          {/* Mobile filters: the same state as pills in two scrollable rows */}
          <div className="mb-6 flex flex-col gap-3 lg:hidden">
            <PillRow>
              <Pill
                active={state.category === "all"}
                onClick={() => update({ category: "all" })}
                count={templates.length}
              >
                All
              </Pill>
              {categoryCounts.map(({ category, count }) => (
                <Pill
                  key={category}
                  active={state.category === category}
                  onClick={() => update({ category })}
                  count={count}
                  dot={CATEGORY_META[category].dot}
                >
                  {CATEGORY_META[category].shortLabel}
                </Pill>
              ))}
            </PillRow>
            {frameworks.length > 1 && (
              <PillRow>
                <Pill
                  active={state.framework === "all"}
                  onClick={() => update({ framework: "all" })}
                >
                  All frameworks
                </Pill>
                {frameworks.map(({ framework }) => (
                  <Pill
                    key={framework.id}
                    active={state.framework === framework.id}
                    onClick={() => update({ framework: framework.id })}
                    logo={framework}
                  >
                    {framework.label}
                  </Pill>
                ))}
              </PillRow>
            )}
          </div>

          {/* Toolbar: result count and sort */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-black/[0.08] pb-5">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-semibold tabular-nums text-foreground">{visible.length}</span>{" "}
              {visible.length === 1 ? "template" : "templates"}
              {isFiltered && (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={() => update({ category: "all", framework: "all" })}
                    className="ml-2 inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Clear filters
                    <X className="size-3" aria-hidden />
                  </button>
                </>
              )}
            </p>
            <SortSelect value={state.sort} onChange={(sort) => update({ sort })} />
          </div>

          {groups.length === 0 ? (
            <EmptyState onReset={() => update({ category: "all", framework: "all" })} />
          ) : (
            <div className="flex flex-col gap-16 pt-8">
              {groups.map((group) => (
                <section key={group.category} aria-labelledby={`apps-${group.category}`}>
                  <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
                    <div>
                      <h2
                        id={`apps-${group.category}`}
                        className="flex items-center gap-2.5 text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15]"
                      >
                        <span aria-hidden className={cn("size-2.5 rounded-full", group.meta.dot)} />
                        {group.meta.label}
                      </h2>
                      <p className="mt-2 max-w-[72ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                        <SectionDescription meta={group.meta} />
                      </p>
                    </div>
                  </div>
                  <ul className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {group.templates.map((template) => (
                      <li key={template.id} className="min-w-0">
                        <TemplateCard template={template} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          <ContributePanel />
        </div>
      </div>
    </section>
  );
}

// The community door: every template here is by Prisma today, and this is how
// someone else's gets in. A folder under compute/ plus a manifest entry that
// names the author, sent as a pull request, and the gallery credits them.
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
            <a href={CONTRIBUTE.folderUrl} className="spectrum-underline font-semibold text-foreground">
              compute/
            </a>{" "}
            with a README and a Composer module, add it to{" "}
            <a href={CONTRIBUTE.manifestUrl} className="spectrum-underline font-semibold text-foreground">
              templates.json
            </a>{" "}
            with yourself as the author, and open a pull request. When it merges, it appears here
            under your name.
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

// The section line, with the meta's linked phrase rendered as a link into the
// rest of the site.
function SectionDescription({ meta }: { meta: CategoryMeta }) {
  const { description, link } = meta;
  const at = link ? description.indexOf(link.label) : -1;
  if (!link || at === -1) return description;
  return (
    <>
      {description.slice(0, at)}
      <a href={link.href} className="spectrum-underline font-semibold text-foreground">
        {link.label}
      </a>
      {description.slice(at + link.label.length)}
    </>
  );
}

function FilterGroup({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className} role="group" aria-label={label}>
      <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  count,
  dot,
  logo,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  dot?: string;
  logo?: FrameworkMeta;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
        active
          ? "bg-muted font-semibold text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {dot && <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dot)} />}
      {logo && <FrameworkLogo framework={logo} />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
    </button>
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
  dot,
  logo,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  dot?: string;
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
      {dot && <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dot)} />}
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
        No template uses that framework in this category yet.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 cursor-pointer rounded-full border border-black/[0.09] bg-white px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/30"
      >
        Clear filters
      </button>
    </div>
  );
}
