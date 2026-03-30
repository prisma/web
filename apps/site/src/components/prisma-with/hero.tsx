import parse from "html-react-parser";
import { cn } from "../../lib/cn";
import { Button } from "@prisma/eclipse";

type HeroData = {
  tech: string;
  eyebrow?: string;
  icon?: string;
  imageUrl: string;
  imageUrlLight?: string;
  imageClassName?: string;
  imageClassNameLight?: string;
  title: string;
  description: string;
  btns: Array<{
    label: string;
    icon?: string;
    url: string;
  }>;
};

export function Hero({ data }: { data: HeroData }) {
  const secondaryButton = data.btns[1];

  return (
    <div className="px-4 hero dark:bg-[linear-gradient(180deg,var(--color-foreground-ppg-weaker)_0%,var(--color-background-default)_100%)] bg-[linear-gradient(180deg,var(--color-background-ppg)_0%,var(--color-background-default)_100%)] relative before:absolute">
      <div className="max-w-300 mx-auto py-12 grid md:grid-cols-[1fr_320px] lg:grid-cols-[736px_1fr] gap-11 relative z-1">
        <div className="content flex flex-col gap-8 justify-center">
          <div className="flex flex-col gap-4 items-center md:items-start">
            {data.eyebrow && (
              <h5 className="uppercase text-foreground-ppg-weak my-0!">
                {data.icon && <i className={cn("mr-2", data.icon)} />}
                <span className="stretch-display font-sans-display">
                  {data.eyebrow}
                </span>
              </h5>
            )}
            <h1 className="stretch-display text-[40px] lg:text-[60px] font-bold my-0! font-sans-display max-w-184 leading-10 lg:leading-16 md:text-left text-center">
              {parse(data.title)}
            </h1>
          </div>
          <p className=" text-foreground-neutral-weak max-w-2xl font-sans-display [font-variation-settings:'wght'_400,'wdth'_115] text-center md:text-left mx-auto md:mx-0 [&>b]:text-foreground-ppg-strong">
            {parse(data.description)}
          </p>
          <div className="flex gap-4 md:justify-start justify-center">
            <Button variant="ppg" size="3xl" href={data.btns[0].url}>
              <span>{data.btns[0].label}</span>
              {data.btns[0].icon && (
                <i className={cn("ml-2", data.btns[0].icon)} />
              )}
            </Button>
            {secondaryButton && (
              <Button
                variant="default-stronger"
                size="3xl"
                href={secondaryButton.url}
              >
                <span>{secondaryButton.label}</span>
                {secondaryButton.icon && (
                  <i className={cn("ml-2", secondaryButton.icon)} />
                )}
              </Button>
            )}
          </div>
        </div>
        <div className="logos relative max-h-78 hidden md:block">
          <div className="absolute left-0 top-0 w-57 h-44 object-cover bg-background-default flex items-center justify-center p-9 border border-stroke-ppg-weak rounded-2xl">
            <img
              src={data.imageUrl}
              className={cn(
                "dark:hidden h-full max-w-full contain",
                data.imageClassName,
              )}
              alt={`Prisma with ${data.tech}`}
            />
            {data.imageUrlLight && (
              <img
                src={data.imageUrlLight}
                className={cn(
                  "hidden dark:block h-full max-w-full contain",
                  data.imageClassNameLight,
                )}
                alt={`Prisma with ${data.tech}`}
              />
            )}
          </div>
          <div className="absolute right-0 bottom-0 w-57 h-44 object-cover bg-background-default flex items-center justify-center p-9 border border-stroke-ppg-weak rounded-2xl">
            <img
              src="/icons/technologies/prisma.svg"
              className="dark:block hidden h-full contain"
              alt="Prisma"
            />
            <img
              src="/icons/technologies/prisma_light.svg"
              className="dark:hidden h-full contain"
              alt="Prisma"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
