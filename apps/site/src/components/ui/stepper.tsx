"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StepperProps = {
  currentStep: number;
  children: React.ReactNode;
  className?: string;
};

const StepIndexContext = React.createContext<number>(1);

type StepProps = {
  title: string;
  description?: string;
  className?: string;
};

function Step({ title, description, className }: StepProps) {
  return (
    <div data-slot="step" className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
          "[[data-state=completed]>&]:border-primary [[data-state=completed]>&]:bg-primary [[data-state=completed]>&]:text-primary-foreground",
          "[[data-state=active]>&]:border-primary [[data-state=active]>&]:text-primary",
          "[[data-state=pending]>&]:border-muted-foreground/30 [[data-state=pending]>&]:text-muted-foreground/50",
        )}
      >
        <span className="hidden [[data-state=completed]>&]:block">
          <CheckIcon className="size-4" />
        </span>
        <span className="[[data-state=completed]>&]:hidden">
          {React.useContext(StepIndexContext)}
        </span>
      </div>
      <div>
        <p
          className={cn("text-sm font-medium", "[[data-state=pending]>&]:text-muted-foreground/50")}
        >
          {title}
        </p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

function StepperWithContext({ currentStep, children, className }: StepperProps) {
  const steps = React.Children.toArray(children);

  return (
    <div data-slot="stepper" className={cn("flex w-full gap-2", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className="flex flex-1 items-center">
              <div
                className={cn("h-px w-full", index <= currentStep ? "bg-primary" : "bg-border")}
              />
            </div>
          )}
          <div
            data-step={index}
            data-state={
              index < currentStep ? "completed" : index === currentStep ? "active" : "pending"
            }
          >
            <StepIndexContext.Provider value={index + 1}>{step}</StepIndexContext.Provider>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export { StepperWithContext as Stepper, Step };
export type { StepperProps, StepProps };
