"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  DATABASES,
  DATABASE_STORAGE_KEY,
  getDatabaseSelection,
  getDatabaseUrl,
  normalizeDatabase,
  type Database,
} from "@/lib/database-selection";

type DatabaseContextValue = {
  database: Database | null;
  availableDatabases: Database[];
  selectDatabase: (database: Database) => void;
  registerGroup: (id: string, databases: Database[]) => () => void;
};

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

function readStoredDatabase() {
  try {
    return window.localStorage.getItem(DATABASE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function persistDatabase(database: Database | null) {
  if (!database) return;
  try {
    window.localStorage.setItem(DATABASE_STORAGE_KEY, database);
  } catch {
    // The shared in-memory preference still works when storage is blocked.
  }
}

function DatabaseUrlSync({
  apply,
  skipAnchor,
}: {
  apply: (database: Database | null) => void;
  skipAnchor: RefObject<boolean>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useLayoutEffect(() => {
    const database = getDatabaseSelection(search, readStoredDatabase());
    persistDatabase(database);
    apply(database);
  }, [pathname, search, apply]);

  // A different-sized example can move a heading after the browser's initial
  // anchor scroll. Realign after the preference has been applied to the tabs.
  useEffect(() => {
    if (skipAnchor.current) {
      skipAnchor.current = false;
      return;
    }
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() => {
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      document.getElementById(id)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, search, skipAnchor]);

  return null;
}

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [database, setDatabase] = useState<Database | null>(null);
  const [groups, setGroups] = useState<Map<string, Database[]>>(() => new Map());
  const skipAnchor = useRef(false);
  const applyDatabase = useCallback((database: Database | null) => {
    // Retain the in-memory choice across navigation if storage is unavailable.
    setDatabase((previous) => database ?? previous);
  }, []);

  const registerGroup = useCallback((id: string, databases: Database[]) => {
    setGroups((previous) => new Map(previous).set(id, databases));
    return () => {
      setGroups((previous) => {
        const next = new Map(previous);
        next.delete(id);
        return next;
      });
    };
  }, []);

  const selectDatabase = useCallback((database: Database) => {
    persistDatabase(database);
    setDatabase(database);
    // Next's patched replaceState preserves its internal history state and
    // updates useSearchParams without navigating or scrolling. Passing the
    // current state directly would bypass that patch (it carries __NA).
    const url = getDatabaseUrl(window.location.href, database);
    skipAnchor.current =
      url !== `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== DATABASE_STORAGE_KEY && event.key !== null) return;
      // An explicit link choice continues to take precedence in this tab.
      const fromUrl = normalizeDatabase(new URLSearchParams(window.location.search).get("db"));
      if (!fromUrl) setDatabase(normalizeDatabase(readStoredDatabase()));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const availableDatabases = useMemo(() => {
    const available = new Set([...groups.values()].flat());
    return DATABASES.filter(({ id }) => available.has(id)).map(({ id }) => id);
  }, [groups]);
  const value = useMemo(
    () => ({ database, availableDatabases, selectDatabase, registerGroup }),
    [database, availableDatabases, selectDatabase, registerGroup],
  );

  return (
    <DatabaseContext value={value}>
      <Suspense fallback={null}>
        <DatabaseUrlSync apply={applyDatabase} skipAnchor={skipAnchor} />
      </Suspense>
      {children}
    </DatabaseContext>
  );
}

export function useDatabaseSelection() {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error("Missing DatabaseProvider");
  return context;
}
