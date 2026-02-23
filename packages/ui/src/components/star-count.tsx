"use client";
import { useStarCount } from "../hooks/use-star-count";

export const StarCount = ({ className }: any) => {
  const { starCount } = useStarCount();

  const getStarCount = () => {
    const stars = (starCount / 1000).toFixed(1);
    return Number(stars) % 1 ? stars : Number(stars).toFixed(0);
  };

  return (
    <span
      className={className}
      style={starCount <= 0 ? { opacity: 0 } : { opacity: 1 }}
    >
      {getStarCount()}K
    </span>
  );
};
