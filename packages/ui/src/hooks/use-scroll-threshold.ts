import { useEffect, useState } from "react";

export const useScrollThreshold = (threshold: number = 64) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY >= threshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [threshold]);

  return isScrolled;
};
