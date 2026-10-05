"use client";

import { Checkbox } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

// Interactive checklist. Ticks persist per browser in localStorage under a
// key derived from the `id` you give it, so every chapter's checklist needs
// a unique, stable id. Rename the id and the reader's ticks reset; that is
// the intended way to invalidate a checklist you have rewritten.
//
// Usage in MDX:
//   <Checklist id="ch1-before-you-move-on">
//     <Check>You have a repo.</Check>
//     <Check>It runs locally.</Check>
//   </Checklist>

const STORAGE_PREFIX = "handbook:checklist:";

type ChecklistContextValue = {
  checked: boolean[];
  toggle: (index: number) => void;
};

const ChecklistContext = createContext<ChecklistContextValue | null>(null);

function read(id: string, size: number): boolean[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + id);
    if (!raw) return Array(size).fill(false);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return Array(size).fill(false);
    return Array.from({ length: size }, (_, i) => parsed[i] === true);
  } catch {
    return Array(size).fill(false);
  }
}

function write(id: string, value: boolean[]) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage. The list still works for the session.
  }
}

export function Checklist({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const items = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<CheckProps>[],
    [children],
  );
  const size = items.length;
  const [checked, setChecked] = useState<boolean[]>(() => Array(size).fill(false));

  useEffect(() => {
    setChecked(read(id, size));
  }, [id, size]);

  const toggle = useCallback(
    (index: number) => {
      setChecked((prev) => {
        const next = prev.slice();
        next[index] = !next[index];
        write(id, next);
        return next;
      });
    },
    [id],
  );

  const done = checked.filter(Boolean).length;

  return (
    <ChecklistContext.Provider value={{ checked, toggle }}>
      <section
        className={cn("hb-checklist", done === size && size > 0 && "hb-checklist--done", className)}
        aria-label={typeof title === "string" ? title : "Checklist"}
      >
        <header className="hb-checklist-head">
          <span className="hb-checklist-title">{title ?? "Before you move on"}</span>
          <span className="hb-checklist-count" aria-live="polite">
            {done} / {size}
          </span>
        </header>
        <ul className="hb-checklist-items">
          {items.map((item, index) => cloneElement(item, { index, key: index }))}
        </ul>
      </section>
    </ChecklistContext.Provider>
  );
}

type CheckProps = {
  children: ReactNode;
  /** Injected by Checklist. */
  index?: number;
};

export function Check({ children, index = 0 }: CheckProps) {
  const ctx = useContext(ChecklistContext);
  const inputId = useId();
  const isChecked = ctx?.checked[index] ?? false;

  return (
    <li className={cn("hb-check", isChecked && "hb-check--done")}>
      <Checkbox
        id={inputId}
        checked={isChecked}
        onCheckedChange={() => ctx?.toggle(index)}
        className="mt-1.5"
      />
      <label htmlFor={inputId} className="hb-check-label">
        {children}
      </label>
    </li>
  );
}
