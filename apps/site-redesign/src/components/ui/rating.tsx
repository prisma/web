"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type RatingProps = {
  value: number
  max?: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: "sm" | "default" | "lg"
  className?: string
}

function Rating({
  value,
  max = 5,
  onChange,
  readonly = false,
  size = "default",
  className,
}: RatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)

  const sizeClasses = {
    sm: "size-4",
    default: "size-5",
    lg: "size-6",
  }

  const displayed = hovered ?? value

  return (
    <div
      data-slot="rating"
      role="radiogroup"
      aria-label="Rating"
      className={cn("inline-flex gap-0.5", className)}
      onMouseLeave={() => !readonly && setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = starValue <= displayed

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} of ${max}`}
            disabled={readonly}
            className={cn(
              "transition-colors disabled:cursor-default",
              !readonly && "cursor-pointer hover:scale-110"
            )}
            onMouseEnter={() => !readonly && setHovered(starValue)}
            onClick={() => onChange?.(starValue)}
          >
            <StarIcon
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-muted-foreground/40"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export { Rating }
export type { RatingProps }
