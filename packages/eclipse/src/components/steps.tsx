import type { ReactNode } from "react";
import "../styles/steps.css";
import { cn } from "../lib/cn";

const variantStyle = {
  step: {
    horizontal: "relative pl-7 ml-4 mb-0 min-w-0 flex-1 flex last:max-w-max",
    vertical: "",
  },
  steps: {
    horizontal: "flex m-0 p-0 border-none justify-between gap-6",
    vertical: "",
  },
};

export function Steps({
  children,
  variant,
}: {
  children: ReactNode;
  variant?: "horizontal" | "vertical";
}) {
  return (
    <div
      className={cn("fd-steps border-stroke-neutral", variantStyle.steps[variant ?? "horizontal"])}
    >
      {children}
    </div>
  );
}

export function Step({
  children,
  active,
  checked,
  variant,
}: {
  children: ReactNode;
  active?: boolean;
  checked?: boolean;
  variant?: "horizontal" | "vertical";
}) {
  return (
    <div
      className={cn(
        "fd-step mb-3",
        !active && "fd-step--inactive",
        checked && "fd-step--checked",
        variantStyle.step[variant ?? "horizontal"],
      )}
    >
      <div className="max-w-full min-w-0">{children}</div>
      {variant !== "vertical" && <span className="separator flex mt-4 flex-1 mr min-w-4" />}
    </div>
  );
}
