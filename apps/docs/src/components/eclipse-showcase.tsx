"use client";

import * as React from "react";
import { Button } from "@prisma/eclipse";

export function EclipseShowcase() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="not-prose my-8 space-y-8">
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-stroke-neutral p-4 bg-background-neutral-weak">
        <span className="text-sm font-medium text-foreground-neutral">
          Theme Mode
        </span>
        <button
          onClick={() => setIsDark(!isDark)}
          className="rounded-square bg-background-neutral px-4 py-2 text-sm font-medium text-foreground-neutral hover:bg-background-neutral-strong transition-colors"
        >
          Toggle {isDark ? "Light" : "Dark"} Mode
        </button>
      </div>

      {/* Button Variants */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground-neutral">
          Button Variants
        </h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="ppg">Prisma Pulse & Accelerate</Button>
          <Button variant="orm">Prisma ORM</Button>
          <Button variant="error">Error</Button>
          <Button variant="default-stronger">Default Stronger</Button>
          <Button variant="default-weaker">Default Weaker</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground-neutral">
          Button Sizes
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="2xl">2 Extra Large</Button>
          <Button size="4xl">4 Extra Large</Button>
        </div>
      </section>

      {/* Color Palette - Backgrounds */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground-neutral">
          Background Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-neutral">
              Neutral
            </span>
          </div>
          <div className="p-4 bg-background-ppg rounded-square border border-stroke-ppg">
            <span className="text-sm font-medium text-foreground-neutral">
              PPG
            </span>
          </div>
          <div className="p-4 bg-background-orm rounded-square border border-stroke-orm">
            <span className="text-sm font-medium text-foreground-neutral">
              ORM
            </span>
          </div>
          <div className="p-4 bg-background-error rounded-square border border-stroke-error">
            <span className="text-sm font-medium text-foreground-neutral">
              Error
            </span>
          </div>
          <div className="p-4 bg-background-success rounded-square border border-stroke-success">
            <span className="text-sm font-medium text-foreground-neutral">
              Success
            </span>
          </div>
          <div className="p-4 bg-background-warning rounded-square border border-stroke-warning">
            <span className="text-sm font-medium text-foreground-neutral">
              Warning
            </span>
          </div>
          <div className="p-4 bg-background-cyan rounded-square border border-stroke-cyan">
            <span className="text-sm font-medium text-foreground-neutral">
              Cyan
            </span>
          </div>
          <div className="p-4 bg-background-fuchsia rounded-square border border-stroke-fuchsia">
            <span className="text-sm font-medium text-foreground-neutral">
              Fuchsia
            </span>
          </div>
        </div>
      </section>

      {/* Foreground Colors */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground-neutral">
          Foreground Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-ppg">PPG</span>
          </div>
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-orm">ORM</span>
          </div>
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-error">
              Error
            </span>
          </div>
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-success">
              Success
            </span>
          </div>
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-warning">
              Warning
            </span>
          </div>
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-cyan">
              Cyan
            </span>
          </div>
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-violet">
              Violet
            </span>
          </div>
          <div className="p-4 bg-background-neutral rounded-square border border-stroke-neutral">
            <span className="text-sm font-medium text-foreground-pink">
              Pink
            </span>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground-neutral">
          Typography
        </h3>
        <div className="space-y-2">
          <p className="text-2xs text-foreground-neutral">2XS - 11px</p>
          <p className="text-xs text-foreground-neutral">XS - 12px</p>
          <p className="text-sm text-foreground-neutral">SM - 14px</p>
          <p className="text-md text-foreground-neutral">MD - 16px (Base)</p>
          <p className="text-lg text-foreground-neutral">LG - 18px</p>
          <p className="text-xl text-foreground-neutral">XL - 20px</p>
          <p className="text-2xl text-foreground-neutral">2XL - 24px</p>
          <p className="text-3xl text-foreground-neutral">3XL - 30px</p>
        </div>

        <div className="space-y-2 pt-4">
          <p className="font-normal text-foreground-neutral">Normal (400)</p>
          <p className="font-medium text-foreground-neutral">Medium (500)</p>
          <p className="font-semibold text-foreground-neutral">
            Semibold (600)
          </p>
          <p className="font-bold text-foreground-neutral">Bold (750)</p>
          <p className="font-ultra-bold text-foreground-neutral">
            Ultra Bold (900)
          </p>
        </div>
      </section>

      {/* Border Radius */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground-neutral">
          Border Radius-
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="px-6 py-4 bg-background-orm rounded-low border border-stroke-orm">
            <span className="text-sm font-medium text-foreground-neutral">
              Low (3px)
            </span>
          </div>
          <div className="px-6 py-4 bg-background-orm rounded-square border border-stroke-orm">
            <span className="text-sm font-medium text-foreground-neutral">
              Square (6px)
            </span>
          </div>
          <div className="px-6 py-4 bg-background-orm rounded-high border border-stroke-orm">
            <span className="text-sm font-medium text-foreground-neutral">
              High (12px)
            </span>
          </div>
          <div className="px-6 py-4 bg-background-orm rounded-circle border border-stroke-orm">
            <span className="text-sm font-medium text-foreground-neutral">
              Circle
            </span>
          </div>
        </div>
      </section>

      {/* Semantic Patterns */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground-neutral">
          Semantic Patterns
        </h3>

        <div className="p-padding-block-container bg-background-error rounded-high border border-stroke-error">
          <div className="flex items-start gap-3">
            <span className="text-foreground-error">⚠️</span>
            <div>
              <h4 className="font-semibold text-foreground-error">
                Error Message
              </h4>
              <p className="text-sm text-foreground-error-weak">
                This is an example error message using semantic tokens.
              </p>
            </div>
          </div>
        </div>

        <div className="p-padding-block-container bg-background-success rounded-high border border-stroke-success">
          <div className="flex items-start gap-3">
            <span className="text-foreground-success">✓</span>
            <div>
              <h4 className="font-semibold text-foreground-success">
                Success Message
              </h4>
              <p className="text-sm text-foreground-success-weak">
                This is an example success message using semantic tokens.
              </p>
            </div>
          </div>
        </div>

        <div className="p-padding-block-container bg-background-warning rounded-high border border-stroke-warning">
          <div className="flex items-start gap-3">
            <span className="text-foreground-warning">!</span>
            <div>
              <h4 className="font-semibold text-foreground-warning">
                Warning Message
              </h4>
              <p className="text-sm text-foreground-warning-weak">
                This is an example warning message using semantic tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground-neutral">
          Gradients
        </h3>
        <div className="space-y-4">
          <div className="h-24 bg-gradient-orm rounded-high flex items-center justify-center">
            <span className="text-lg font-semibold text-foreground-orm-reverse">
              ORM Gradient
            </span>
          </div>
          <div className="h-24 bg-gradient-ppg rounded-high flex items-center justify-center">
            <span className="text-lg font-semibold text-foreground-ppg-reverse">
              PPG Gradient
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
