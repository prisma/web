import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "flex flex-row justify-center items-center rounded-square transition-all duration-50 cursor-pointer disabled:bg-background-neutral-weak! disabled:border-none! disabled:text-foreground-neutral-weaker! disabled:cursor-not-allowed disabled:shadow-none",
  {
    variants: {
      variant: {
        ppg: "bg-background-ppg-reverse text-foreground-ppg-reverse hover:bg-background-ppg-reverse-strong shadow-box-low",
        orm: "bg-background-orm-reverse text-foreground-orm-reverse hover:bg-background-orm-reverse-strong shadow-box-low",
        "orm-reverse":
          "bg-background-orm text-foreground-orm hover:bg-background-orm-strong shadow-box-low",
        "default-stronger":
          "bg-background-neutral text-foreground-neutral hover:bg-background-neutral-strong border border-stroke-neutral-strong",
        default:
          "bg-background-default hover:bg-background-neutral border border-stroke-neutral hover:border-stroke-neutral-strong text-foreground-neutral shadow-box-low",
        "default-weaker":
          "bg-transparent hover:bg-background-neutral text-foreground-neutral",
        error:
          "bg-background-error-reverse text-foreground-error-reverse hover:bg-background-error-reverse-strong shadow-box-low",
        success:
          "bg-background-success-reverse text-foreground-success-reverse hover:bg-background-success-reverse-strong shadow-box-low",
        link: "text-foreground-neutral underline-offset-4 hover:underline focus-visible:ring-foreground-neutral",
      },
      size: {
        lg: "px-2 h-element-lg type-text-sm-strong",
        xl: "px-3 h-element-xl type-text-sm-strong",
        "2xl": "px-3  h-element-2xl type-text-sm-strong",
        "3xl": "px-3  h-element-3xl type-text-sm-strong",
        "4xl": "px-4  h-element-4xl type-heading-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonVariants>;

type ButtonAsButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsAnchorProps = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ className, variant, size, href, ...props }, ref) => {
  const classNames = cn(buttonVariants({ variant, size, className }));

  if (href) {
    return (
      <a
        className={classNames}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <button
      className={classNames}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
