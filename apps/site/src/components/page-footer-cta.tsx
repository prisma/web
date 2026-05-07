import { Button } from "@prisma/eclipse";
import { ConsoleCtaButton } from "@/components/console-cta-button";
import type { UtmParams } from "@prisma-docs/ui/lib/utm";
import type { ReactNode } from "react";

interface Btn {
  url: string;
  text: string;
  external?: boolean;
  defaultUtm?: UtmParams;
  consolePath?: "/login" | "/sign-up";
}

interface PageFooterCtaProps {
  title: string;
  description?: string;
  btns?: Btn[];
  children?: ReactNode;
  footer?: string;
  color?: "ppg" | "orm";
}

export function PageFooterCta({
  title,
  description,
  btns,
  children,
  footer,
  color = "ppg",
}: PageFooterCtaProps) {
  return (
    <div
      className={`bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:z-0 rounded-full before:blur-[100px] ${color === "orm" ? "before:bg-indigo-400" : "before:bg-teal-400"}`}
    >
      <div className="my-12 p-12 relative z-1">
        <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <h2
              className="text-3xl text-foreground-neutral font-sans-display stretch-display"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {description && (
              <p className="text-foreground-neutral-weak max-w-121 mx-auto">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {children ??
              btns?.map((btn, i) => {
                if (btn.defaultUtm) {
                  return (
                    <ConsoleCtaButton
                      key={btn.url}
                      consolePath={btn.consolePath ?? "/sign-up"}
                      defaultUtm={btn.defaultUtm}
                      variant={i === 0 ? color : "default-strong"}
                      size="2xl"
                      {...(btn.external && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                    >
                      {btn.text}
                      <i className="fa-regular fa-arrow-right ml-2" />
                    </ConsoleCtaButton>
                  );
                }

                return (
                  <Button
                    key={btn.url}
                    asChild
                    variant={i === 0 ? color : "default-strong"}
                    size="2xl"
                  >
                    <a
                      href={btn.url}
                      {...(btn.external && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                    >
                      {btn.text}
                      <i className="fa-regular fa-arrow-right ml-2" />
                    </a>
                  </Button>
                );
              })}
          </div>
          {footer && (
            <h6 className="mb-0! -mt-4 text-foreground-neutral-weaker text-xs">
              {footer}
            </h6>
          )}
        </div>
      </div>
    </div>
  );
}
