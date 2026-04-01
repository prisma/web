"use client";
import dynamic from "next/dynamic";
const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});
export const StatsList = ({ statsList }: { statsList: any[] }) => {
  return (
    <div className="grid grid-cols-3 w-fit mx-auto font-sans-display stretch-display text-foreground-neutral-weak">
      {statsList.map((e: any, idx: number) => (
        <div key={idx} className="flex flex-col justify-center items-center">
          <span>
            <AnimatedNumbers
              animateToNumber={e.head}
              fontStyle={{
                fontFamily: "var(--font-sans-display)",
                fontVariationSettings: "'wght' 900, 'wdth' 125",
                lineHeight: "110%",
                fontSize: "48px",
                color: "var(--color-foreground-neutral)",
              }}
            />
            {e.sub.toLowerCase() === "remote" && `%`}
          </span>
          <p className="eyebrow-headline">{e.sub}</p>
        </div>
      ))}
    </div>
  );
};
