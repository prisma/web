"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "handbook:building-tool";
const SELECTOR_ID = "handbook-building-tool";
const TOOLS = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
] as const;

type BuildingTool = (typeof TOOLS)[number]["value"];

function parseTool(value: string | null): BuildingTool | null {
  return value === "chatgpt" || value === "claude" ? value : null;
}

const BuildingToolContext = createContext<{
  tool: BuildingTool | null;
  selectTool: (tool: BuildingTool) => void;
} | null>(null);

export function BuildingToolProvider({ children }: { children: ReactNode }) {
  const [tool, setTool] = useState<BuildingTool | null>(null);

  useEffect(() => {
    let storage: Storage;
    try {
      storage = window.localStorage;
      setTool(parseTool(storage.getItem(STORAGE_KEY)));
    } catch {
      // The reader can still choose a tool when browser storage is unavailable.
      return;
    }

    function syncTool(event: StorageEvent) {
      if (event.storageArea !== storage) return;
      if (event.key === STORAGE_KEY || event.key === null) {
        setTool(parseTool(event.newValue));
      }
    }

    window.addEventListener("storage", syncTool);
    return () => window.removeEventListener("storage", syncTool);
  }, []);

  const selectTool = useCallback((next: BuildingTool) => {
    setTool(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The provider retains the choice across chapters for this visit.
    }
  }, []);

  const value = useMemo(() => ({ tool, selectTool }), [tool, selectTool]);

  return <BuildingToolContext.Provider value={value}>{children}</BuildingToolContext.Provider>;
}

function useBuildingTool() {
  const context = useContext(BuildingToolContext);
  if (!context) throw new Error("BuildingToolProvider is required");
  return context;
}

export function BuildingToolSelector() {
  const { tool, selectTool } = useBuildingTool();
  const name = useId();
  const descriptionId = `${name}-description`;

  return (
    <fieldset
      id={SELECTOR_ID}
      className="hb-tool-selector"
      aria-describedby={descriptionId}
      data-markdown-ignore
    >
      <legend>Which tool will you build with?</legend>
      <p id={descriptionId}>
        Choose the one you’re comfortable using. We’ll remember your choice as you work through the
        handbook.
      </p>
      <div className="hb-tool-options">
        {TOOLS.map(({ value, label }) => (
          <label key={value} className="hb-tool-option">
            <input
              className="sr-only"
              type="radio"
              name={name}
              value={value}
              checked={tool === value}
              onChange={() => selectTool(value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ToolInstructions({ children }: { children: ReactNode }) {
  const { tool } = useBuildingTool();

  if (!tool) {
    return (
      <p className="hb-tool-prompt">
        <a href={`#${SELECTOR_ID}`}>Choose ChatGPT or Claude above</a> to see these steps.
      </p>
    );
  }

  return (
    <div className="hb-tool-instructions" data-building-tool={tool}>
      {children}
    </div>
  );
}

export function ToolContent({ tool, children }: { tool: BuildingTool; children: ReactNode }) {
  const { tool: selected } = useBuildingTool();
  return selected === tool ? <>{children}</> : null;
}
