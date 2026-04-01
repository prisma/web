import { McpPromptBubble } from "./mcp-bubble";

const capabilityIconClass = "shrink-0 text-[24px] text-foreground-ppg";
const capabilityCardClass =
  "relative flex w-full flex-col overflow-hidden rounded-[12px] border border-stroke-neutral bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] shadow-box-low";
const capabilityHeaderClass = "flex items-center gap-4";
const capabilityDescriptionClass =
  "max-w-full text-[16px] leading-6 text-foreground-neutral-weak";

function CapabilityCardContent({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className={capabilityHeaderClass}>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-square bg-background-ppg">
          <i className={`${icon} ${capabilityIconClass}`} aria-hidden />
        </div>
        <h4 className="stretch-display font-sans-display text-[20px] leading-7 font-black text-foreground-neutral">
          {title}
        </h4>
      </div>
      <p className={capabilityDescriptionClass}>{description}</p>
    </div>
  );
}

export function MobileCapabilityCard({
  icon,
  title,
  description,
  prompt,
  mobileTall,
}: {
  icon: string;
  title: string;
  description: string;
  prompt: string;
  mobileTall: boolean;
}) {
  return (
    <CapabilityCard
      icon={icon}
      title={title}
      description={description}
      prompt={prompt}
      mobileTall={mobileTall}
      size="compact"
    />
  );
}

export function CapabilityCard({
  icon,
  title,
  description,
  prompt,
  mobileTall = false,
  size,
}: {
  icon: string;
  title: string;
  description: string;
  prompt: string;
  mobileTall?: boolean;
  size: "wide" | "compact";
}) {
  const isWide = size === "wide";
  const cardHeightClass = mobileTall
    ? "h-[227px] xl:h-[179px]"
    : isWide
      ? "h-[203px] xl:h-[179px]"
      : "h-[203px]";
  const promptInsetClass = isWide
    ? "bottom-[14px] left-[14px] right-[14px] xl:bottom-[15px] xl:left-[16px] xl:right-[25px]"
    : "bottom-[14px] left-[14px] right-[14px] xl:left-[16px] xl:right-[27px]";
  const contentPadClass = mobileTall
    ? "pb-[104px] xl:pb-[60px]"
    : isWide
      ? "pb-[80px] xl:pb-[60px]"
      : "pb-[80px] xl:pb-[66px]";
  const promptVariant = mobileTall
    ? "mobile-tall"
    : isWide
      ? "wide"
      : "compact";

  return (
    <div
      className={`relative w-full ${cardHeightClass} ${isWide ? "xl:col-span-3" : "sm:col-span-1 xl:col-span-2"}`}
    >
      <div className={`${capabilityCardClass} h-full`}>
        <div className={contentPadClass}>
          <CapabilityCardContent
            icon={icon}
            title={title}
            description={description}
          />
        </div>
      </div>
      <div className={`absolute ${promptInsetClass}`}>
        <McpPromptBubble variant={promptVariant}>{prompt}</McpPromptBubble>
      </div>
    </div>
  );
}
