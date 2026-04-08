"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Action } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  icon: string;
  row: "top" | "center";
}

interface BentoBox {
  title: string;
  subtitle: string;
  imageUrl: string;
  icon: string;
  imageAlt: string | null;
  link: string;
}

interface BentoProps {
  bentoSection: {
    boxes: BentoBox[];
  };
  hero?: React.ReactNode;
  color?: "orm" | "ppg";
}

const HeroContent = ({
  className = "",
  hero,
}: {
  className?: string;
  hero?: React.ReactNode;
}) =>
  hero || (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center mx-auto mb-10",
        className,
      )}
    >
      <h2 className="text-center m-0 mb-4 text-4xl md:text-[36px] font-black text-foreground-neutral font-sans-display stretch-display">
        Your database, right in your workflow
      </h2>
    </div>
  );

export const Bento = ({ bentoSection, hero, color }: BentoProps) => {
  // Transform Sanity data to internal CardData format
  const CARDS: CardData[] = bentoSection.boxes.map((box, index) => ({
    id: (index + 1).toString(),
    title: box.title,
    subtitle: box.subtitle,
    image: box.imageUrl,
    icon: box.icon,
    link: box.link,
    row: index < 3 ? "top" : "center",
  }));

  const centerCards = CARDS.filter((card) => card.row === "center");
  const [firstCenterCard, secondCenterCard] = centerCards;
  return (
    <div className="max-w-[1240px] mx-auto w-full z-10 px-4 pt-4 pb-0">
      {/* Desktop Layout (961+): Original 3-row layout with text in middle */}
      <HeroContent hero={hero} />
      <>
        <div className="flex gap-4 flex-wrap justify-center lg:hidden md:grid md:grid-cols-2 md:[&>*]:last:col-span-2">
          {CARDS.map((card) => (
            <Card color={color} key={card.id} card={card} />
          ))}
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-4 mb-4">
          {CARDS.filter((card) => card.row === "top").map((card) => (
            <Card color={color} key={card.id} card={card} />
          ))}
        </div>

        <div className="hidden lg:flex gap-8 mb-4 items-center justify-between">
          {firstCenterCard && (
            <Card color={color} key={firstCenterCard.id} card={firstCenterCard} />
          )}

          {secondCenterCard && (
            <Card
              color={color}
              key={secondCenterCard.id}
              card={secondCenterCard}
            />
          )}
        </div>
      </>
    </div>
  );
};

interface CardProps {
  card: CardData;
  color?: "orm" | "ppg";
}

export const Card = ({ card, color }: CardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const cardCenterRef = useRef<{ x: number; y: number } | null>(null);
  const isCenterCard = ["4", "5"].includes(card.id);
  const imageClassName =
    "px-4 z-2 pt-0 pb-0 min-w-full min-h-[60%] object-fill object-[top_left] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_60%,transparent_90%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_60%,transparent_90%)]";

  const updateCardCenter = useCallback(() => {
    if (!cardRef.current) return false;

    const rect = cardRef.current.getBoundingClientRect();
    cardCenterRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    return true;
  }, []);

  const handleMouseEnter = useCallback(() => {
    updateCardCenter();
  }, [updateCardCenter]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const cardElement = cardRef.current;
      if (!cardElement) return;
      if (!cardCenterRef.current && !updateCardCenter()) return;

      const cardCenter = cardCenterRef.current;
      if (!cardCenter) return;

      const { x: centerX, y: centerY } = cardCenter;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const angle = Math.atan2(mouseY - centerY, mouseX - centerX);

      const degrees = ((angle * 180) / Math.PI + 90 + 360) % 360;

      cardElement.style.setProperty("--angle", `${degrees}deg`);
    },
    [updateCardCenter],
  );

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--angle", "0deg");
    }
    cardCenterRef.current = null;
  }, []);

  return (
    <Link
      ref={cardRef}
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "box",
        "box-visible",
        "w-full",
        isCenterCard && "w-full md:order-0",
        color,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-4 text-xs py-4 px-0 mx-4 w-[calc(100%-2rem)]">
        <Action color={color || "ppg"} size="4xl">
          <i className={cn("text-xl", card.icon)} />
        </Action>
        <div className="z-2">
          <h2 className="text-foreground-neutral font-sans-display text-base mt-0 mb-1 font-bold">
            {card.title}
          </h2>
          <p className="text-foreground-neutral dark:text-foreground-neutral-weak text-sm font-normal m-0">
            {card.subtitle}
          </p>
        </div>
      </div>
      {card.image && (
        <>
          <Image
            src={`${card.image}_light.svg`}
            alt={card.title}
            width={1200}
            height={800}
            loading="eager"
            className={cn(imageClassName, "dark:hidden")}
          />
          <Image
            src={`${card.image}.svg`}
            alt={card.title}
            width={1200}
            height={800}
            loading="eager"
            className={cn(imageClassName, "hidden dark:block")}
          />
        </>
      )}
    </Link>
  );
};
