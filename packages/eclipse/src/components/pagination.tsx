import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "../lib/cn";
import { ButtonProps, buttonVariants } from "../components/button";
import { Input } from "./input";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "lg",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "default-weaker" : "default",
        size,
      }),
      "flex border-none text-foreground-neutral cursor-pointer",
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

type PaginationInputProps = {
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalPages?: number;
} & React.ComponentProps<"div">;

const PaginationInput = ({
  className,
  value,
  onChange,
  totalPages,
  ...props
}: PaginationInputProps) => {
  const [pageNum, setPageNum] = React.useState(value || 1);
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-foreground-neutral-weak",
        className,
      )}
      {...props}
    >
      <span>Page</span>
      {value !== undefined && (
        <Input
          value={pageNum}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (
              !isNaN(newValue) &&
              newValue >= 1 &&
              newValue <= (totalPages || 1)
            ) {
              setPageNum(newValue);
              onChange?.(e);
            }
          }}
          type="number"
          className="max-w-fit"
          aria-invalid={pageNum > (totalPages || 1)}
          min={1}
          max={totalPages}
        />
      )}
      {totalPages && <span>of {totalPages}</span>}
    </div>
  );
};

PaginationInput.displayName = "PaginationInput";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="lg"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 mt-0.5" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="lg"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4 mt-0.5" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex h-9 w-9 items-center justify-center text-foreground-neutral-weaker",
      className,
    )}
    {...props}
  >
    {"..."}
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationInput,
};
